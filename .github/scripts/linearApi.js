// Linear API helper for the Integration Audit workflow (.github/scripts/integrations_audit), using @linear/sdk.

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const LINEAR_TEAM_ID = process.env.LINEAR_TEAM_ID;

if (!LINEAR_API_KEY) {
  throw new Error('LINEAR_API_KEY environment variable is required');
}
if (!LINEAR_TEAM_ID) {
  throw new Error('LINEAR_TEAM_ID environment variable is required');
}

const { LinearClient } = require('@linear/sdk');
const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });

// Linear IDs the audit tickets use
const MAINTENANCE_PROJECT_ID = 'f99cafb5-7d4a-4549-8c77-afe2644feba9'; // Integrations: Maintenance Project
const KTLO_LABEL_ID = '68c1ca4f-cc21-4c28-9ce5-618a8b39c788'; // Type: KTLO
const VERSION_UPGRADE_LABEL_ID = '2ee64e36-d577-4b4b-9ae4-e7292db061d4'; // KTLO Type: VersionUpgrade

async function createIssue({
  title,
  description,
  parentId,
  priority,
  labelIds,
  dueDate,
  stateId,
  assigneeId,
  cycleId,
  projectId,
}) {
  try {
    const result = await linearClient.createIssue({
      teamId: LINEAR_TEAM_ID,
      title,
      description,
      parentId,
      priority,
      labelIds,
      dueDate,
      stateId,
      assigneeId,
      cycleId,
      projectId,
    });
    // Linear SDK createIssue returns { _issue: { id }, success, lastSyncId }
    // Check if result has an 'issue' property (promise/getter) or use _issue.id
    const issueId = result.issue ? (await result.issue).id : result._issue?.id || result.id;
    if (!issueId) {
      throw new Error('Failed to create issue: no issue ID returned');
    }
    // Fetch full issue details to get identifier, title, url
    const issue = await linearClient.issue(issueId);
    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
    };
  } catch (error) {
    console.error('Error creating issue:', error.message);
    throw error;
  }
}

async function updateIssue(issueId, fields) {
  try {
    const result = await linearClient.updateIssue(issueId, fields);
    // Linear SDK updateIssue returns { _issue: { id }, success, lastSyncId }
    // Check if result has an 'issue' property (promise/getter) or use _issue.id
    const updatedIssueId = result.issue
      ? (await result.issue).id
      : result._issue?.id || result.id || issueId;
    // Fetch full issue details to get identifier, title, url
    const issue = await linearClient.issue(updatedIssueId);
    return {
      id: issue.id,
      identifier: issue.identifier,
      title: issue.title,
      url: issue.url,
    };
  } catch (error) {
    console.error(`Error updating issue "${issueId}":`, error.message);
    throw error;
  }
}

async function createComment(issueId, body) {
  const result = await linearClient.createComment({ issueId, body });
  if (!result.success) throw new Error(`Failed to comment on issue "${issueId}"`);
}

const ISSUES_BY_TITLE = `query IssuesByTitle($teamId: ID!, $title: String!) {
  issues(
    filter: { team: { id: { eq: $teamId } }, title: { containsIgnoreCase: $title } }
    first: 250
    includeArchived: true
  ) {
    nodes { id identifier title url priority dueDate description archivedAt trashed state { type } parent { id } }
  }
}`;

/** Issues in any state, archived ones included and deleted ones left out, whose title contains `title`, in one request; throws on error so a failure is never read as "none". */
async function findIssuesByTitle(title) {
  const { data } = await linearClient.client.rawRequest(ISSUES_BY_TITLE, {
    teamId: LINEAR_TEAM_ID,
    title,
  });
  // Deleted issues (in the trash) are left out: deleting a ticket means its items are no longer filed.
  return data.issues.nodes
    .filter((issue) => !issue.trashed)
    .map(({ parent, trashed, ...issue }) => ({ ...issue, parentId: parent?.id || null }));
}

module.exports = {
  createIssue,
  updateIssue,
  createComment,
  findIssuesByTitle,
  MAINTENANCE_PROJECT_ID,
  KTLO_LABEL_ID,
  VERSION_UPGRADE_LABEL_ID,
};
