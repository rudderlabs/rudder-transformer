// Builds the Slack message for a finished audit run from the files in the output folder.
// Prints the text as one JSON string, ready for the Slack payload.
// Usage: JOB_STATUS=… RUN_URL=… WORKFLOW_URL=… CREATE_TICKETS=… tsx slack-message.ts [--out audit-out]
import path from 'path';
import { outDirFromArgs, readJson, AuditRecord, TicketCounts } from './common';
import { loadRecords } from './plan-tickets';

const NAME = 'Integration Audit (Rudder Transformer)';
const TEAM = '<!subteam^S02AEQL26CT>';
const MAX_NAMES = 10;

export interface RunFacts {
  jobStatus: string;
  runUrl: string;
  workflowUrl: string;
  createTickets: boolean;
  records: Pick<AuditRecord, 'integration' | 'status'>[];
  tickets: TicketCounts | null;
}

/** Slack mrkdwn needs &, < and > escaped in text. */
function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function capped(list: string[]): string {
  const more = list.length > MAX_NAMES ? ` +${list.length - MAX_NAMES} more` : '';
  return `${list.slice(0, MAX_NAMES).join(' · ')}${more}`;
}

export function slackText(facts: RunFacts): string {
  const notAudited = facts.records.filter((r) => r.status !== 'ok');
  const failed = facts.jobStatus !== 'success';
  let heading = `:white_check_mark: *${NAME} completed*`;
  if (failed) heading = `:x: *${NAME} failed*`;
  else if (notAudited.length) heading = `:warning: *${NAME} completed with gaps*`;

  const lines = [heading];
  if (facts.records.length) {
    lines.push(
      `Audited ${facts.records.length - notAudited.length} of ${facts.records.length} integrations`,
    );
  }
  if (notAudited.length) {
    lines.push(
      `Not audited (${notAudited.length}): ${capped(notAudited.map((r) => esc(`${r.integration} (${r.status})`)))}`,
      // The full list, ready for the `integrations` input of a manual run.
      notAudited.length === facts.records.length
        ? `<${facts.workflowUrl}|Run again> for all integrations once the cause is fixed`
        : `<${facts.workflowUrl}|Run again> with integrations: \`${esc(notAudited.map((r) => r.integration).join(','))}\``,
    );
  }
  if (!facts.createTickets) {
    lines.push('Tickets: off (plan only)');
  } else if (facts.tickets) {
    const t = facts.tickets;
    lines.push(
      t.changed.length
        ? `New or updated tickets (${t.changed.length}): ${capped(t.changed.map((c) => `<${c.url}|${esc(c.title)}>`))}`
        : 'No new changes found',
    );
    if (t.skippedItems) lines.push(`${t.skippedItems} item(s) were already filed and skipped`);
    if (t.failed.length) lines.push(`Linear failed for: ${capped(t.failed)}`);
  }
  lines.push(`<${facts.runUrl}|View workflow run>`, `CC: ${TEAM}`);
  return lines.join('\n');
}

function main(): void {
  const outDir = outDirFromArgs(process.argv);
  const text = slackText({
    jobStatus: process.env.JOB_STATUS || 'failure',
    runUrl: process.env.RUN_URL || '',
    workflowUrl: process.env.WORKFLOW_URL || '',
    createTickets: process.env.CREATE_TICKETS === 'true',
    records: loadRecords(outDir).map((r) => ({ integration: r.name, status: r.status })),
    tickets: readJson<TicketCounts | null>(path.join(outDir, 'tickets.json'), null),
  });
  process.stdout.write(JSON.stringify(text));
}

if (require.main === module) main();
