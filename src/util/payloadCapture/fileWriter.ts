import fs from 'fs';
import path from 'path';

const OPEN_SUFFIX = '.open';
const ROTATED_EXT = '.jsonl';
// bounds concurrently open fds under a workspace-level allowlist with many
// destinations; the oldest open file is rotated early to free a slot
const MAX_OPEN_FILES = 50;

interface OpenFile {
  fd: number;
  filePath: string;
  bytes: number;
  openedAt: number;
}

export interface FileWriterOptions {
  dir: string;
  maxFileBytes: number;
  maxDiskBytes: number;
  instanceId: string;
}

const errnoCode = (err: unknown): string | undefined => {
  if (err && typeof err === 'object' && 'code' in err && typeof err.code === 'string') {
    return err.code;
  }
  return undefined;
};

const isPidAlive = (pid: number): boolean => {
  try {
    process.kill(pid, 0);
    return true;
  } catch (err) {
    // EPERM: the process exists but belongs to another user — still alive
    return errnoCode(err) === 'EPERM';
  }
};

/**
 * Appends capture records to per-(workspace, destination) local JSONL files.
 * The pair is encoded into the filename (`<ws>__<dest>__...`) so the uploader
 * can build per-customer S3 keys from a flat staging directory.
 *
 * Each process writes to its own `<dir>/<pid>` subdirectory so cluster
 * workers never touch each other's live files; init() adopts files left by
 * dead pids (crashed or previous deploys). The disk cap is therefore
 * per-process — the node-level cap is NUM_PROCS * maxDiskBytes.
 *
 * A file is "open" while being written (`.jsonl.open`) and becomes eligible
 * for upload once rotated to `.jsonl`. Writes are synchronous on purpose:
 * the sampler bounds this path to ~1 small record per interval per pair, and
 * sync fds make rotation/upload free of flush races.
 */
export class FileWriter {
  private readonly openFiles = new Map<string, OpenFile>();

  private readonly workerDir: string;

  private stagedBytes = 0;

  // disambiguates filenames when a pair rotates and reopens within one ms
  private fileSeq = 0;

  constructor(private readonly opts: FileWriterOptions) {
    this.workerDir = path.join(opts.dir, String(process.pid));
  }

  init(): void {
    // captured payloads are PII: owner-only permissions throughout
    fs.mkdirSync(this.workerDir, { recursive: true, mode: 0o700 });
    fs.chmodSync(this.workerDir, 0o700);
    this.adoptDeadWorkerDirs();
    // own leftovers (pid reuse after a crash): make .open files uploadable
    for (const name of fs.readdirSync(this.workerDir)) {
      if (name.endsWith(OPEN_SUFFIX)) {
        const stale = path.join(this.workerDir, name);
        fs.renameSync(stale, stale.slice(0, -OPEN_SUFFIX.length));
      }
    }
    this.stagedBytes = this.listRotated().reduce(
      (total, filePath) => total + fs.statSync(filePath).size,
      0,
    );
  }

  /** Cheap pre-check so callers can avoid burning a sampling token on a full disk. */
  hasCapacity(): boolean {
    return this.stagedBytes < this.opts.maxDiskBytes;
  }

  /** Returns false when the local disk cap is reached and the record is dropped. */
  append(pairKey: string, line: string): boolean {
    const lineBytes = Buffer.byteLength(line);
    if (this.stagedBytes + lineBytes > this.opts.maxDiskBytes) {
      return false;
    }
    const file = this.getOrOpen(pairKey);
    fs.writeSync(file.fd, line);
    file.bytes += lineBytes;
    this.stagedBytes += lineBytes;
    if (file.bytes >= this.opts.maxFileBytes) {
      this.rotate(pairKey);
    }
    return true;
  }

  /** Rotates open files older than maxAgeMs so the uploader can pick them up. */
  rotateAged(maxAgeMs: number, now: number = Date.now()): void {
    for (const [pairKey, file] of this.openFiles) {
      if (now - file.openedAt >= maxAgeMs) {
        this.rotate(pairKey);
      }
    }
  }

  rotateAll(): void {
    for (const pairKey of this.openFiles.keys()) {
      this.rotate(pairKey);
    }
  }

  listRotated(): string[] {
    return fs
      .readdirSync(this.workerDir)
      .filter((name) => name.endsWith(ROTATED_EXT))
      .map((name) => path.join(this.workerDir, name));
  }

  async listRotatedAsync(): Promise<string[]> {
    const names = await fs.promises.readdir(this.workerDir);
    return names
      .filter((name) => name.endsWith(ROTATED_EXT))
      .map((name) => path.join(this.workerDir, name));
  }

  /** Called by the uploader after a successful upload+delete. */
  onFileRemoved(sizeBytes: number): void {
    this.stagedBytes = Math.max(0, this.stagedBytes - sizeBytes);
  }

  /** Moves rotated files of dead pids into this worker's dir and removes their dirs. */
  private adoptDeadWorkerDirs(): void {
    const deadDirEntries = fs
      .readdirSync(this.opts.dir, { withFileTypes: true })
      .filter((entry) => {
        const pid = Number(entry.name);
        return (
          entry.isDirectory() && Number.isInteger(pid) && pid !== process.pid && !isPidAlive(pid)
        );
      });
    for (const entry of deadDirEntries) {
      this.adoptOneDeadDir(path.join(this.opts.dir, entry.name));
    }
  }

  /** ENOENT is tolerated throughout: a sibling worker may adopt the same dir concurrently. */
  private adoptOneDeadDir(deadDir: string): void {
    let names: string[] = [];
    try {
      names = fs.readdirSync(deadDir);
    } catch (err) {
      if (errnoCode(err) !== 'ENOENT') {
        throw err;
      }
      return;
    }
    for (const name of names) {
      const from = path.join(deadDir, name);
      const to = path.join(
        this.workerDir,
        name.endsWith(OPEN_SUFFIX) ? name.slice(0, -OPEN_SUFFIX.length) : name,
      );
      try {
        fs.renameSync(from, to);
        fs.chmodSync(to, 0o600);
      } catch (err) {
        if (errnoCode(err) !== 'ENOENT') {
          throw err;
        }
      }
    }
    fs.rmSync(deadDir, { recursive: true, force: true });
  }

  private getOrOpen(pairKey: string): OpenFile {
    const existing = this.openFiles.get(pairKey);
    if (existing) {
      return existing;
    }
    if (this.openFiles.size >= MAX_OPEN_FILES) {
      // free a slot by rotating the oldest open file (Map preserves insertion order)
      const oldestKey = this.openFiles.keys().next().value;
      if (typeof oldestKey === 'string') {
        this.rotate(oldestKey);
      }
    }
    this.fileSeq += 1;
    const fileName = `${pairKey}__${this.opts.instanceId}-${process.pid}-${Date.now()}-${this.fileSeq}${ROTATED_EXT}${OPEN_SUFFIX}`;
    const filePath = path.join(this.workerDir, fileName);
    const opened: OpenFile = {
      fd: fs.openSync(filePath, 'a', 0o600),
      filePath,
      bytes: 0,
      openedAt: Date.now(),
    };
    this.openFiles.set(pairKey, opened);
    return opened;
  }

  private rotate(pairKey: string): void {
    const file = this.openFiles.get(pairKey);
    if (!file) {
      return;
    }
    this.openFiles.delete(pairKey);
    fs.closeSync(file.fd);
    if (file.bytes === 0) {
      fs.rmSync(file.filePath, { force: true });
      return;
    }
    // the .open file may already have been renamed (pid-reuse adoption);
    // its content lives on through the fd, so just skip the rename
    if (fs.existsSync(file.filePath)) {
      fs.renameSync(file.filePath, file.filePath.slice(0, -OPEN_SUFFIX.length));
    }
  }
}
