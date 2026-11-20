// Reads the items already on each integration's audit tickets, so the agent can tell a repeat from a new change.
// Writes filed/<integration>.json (key and title per item) into the output folder.
// Usage: LINEAR_API_KEY=… LINEAR_TEAM_ID=… tsx filed-items.ts [--only hs,marketo] [--out audit-out]
import fs from 'fs';
import path from 'path';
import { selectIntegrations } from './readme';
import { REPO_ROOT, pool, parseItems, filedItemsPath, FiledItem } from './common';
import { parseArgs } from './run';
import { findAuditIssues, linearClient, LinearClient } from './create-tickets';

const CONCURRENCY = 4;

export async function filedItems(
  client: Pick<LinearClient, 'search'>,
  integrationTitle: string,
): Promise<FiledItem[]> {
  const { parents, subs } = await findAuditIssues(client, integrationTitle);
  const items = [...parents, ...subs].flatMap((i) => parseItems(i.description));
  return [...new Map(items.map((i) => [i.key, i])).values()];
}

async function main(): Promise<void> {
  const opts = parseArgs(process.argv);
  const outDir = path.resolve(REPO_ROOT, opts.out);
  const { ready } = selectIntegrations(REPO_ROOT, opts.only);
  const { client } = linearClient();
  fs.mkdirSync(path.join(outDir, 'filed'), { recursive: true });
  const counts = await pool(ready, CONCURRENCY, async (integration) => {
    const items = await filedItems(client, integration.title);
    fs.writeFileSync(
      filedItemsPath(outDir, integration.name),
      `${JSON.stringify(items, null, 2)}\n`,
    );
    return items.length;
  });
  console.log(
    `Read ${counts.reduce((a, b) => a + b, 0)} filed items for ${ready.length} integrations`,
  );
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
