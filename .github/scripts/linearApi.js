// Linear API helper for Integration SDK Version Audit workflow
// Reference implementation using @linear/sdk

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

const OPEN_STATES = ['Queued', 'In Progress', 'Todo', 'Backlog', 'Triage'];

async function getStateId(stateName, teamId) {
  try {
    const team = await linearClient.team(teamId);
    const states = await team.states();
    const state = states.nodes.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
    if (!state) {
      console.warn(
        `State "${stateName}" not found. Available states: ${states.nodes.map((s) => s.name).join(', ')}`,
      );
      return null;
    }
    return state.id;
  } catch (error) {
    console.error(`Error fetching state ID for "${stateName}":`, error.message);
    return null;
  }
}

async function getCurrentUserId() {
  try {
    const viewer = await linearClient.viewer;
    return viewer?.id || null;
  } catch (error) {
    console.error('Error fetching current user ID:', error.message);
    return null;
  }
}

async function getUserId(userName) {
  try {
    const users = await linearClient.users();
    const user = users.nodes.find(
      (u) =>
        u.name?.toLowerCase().includes(userName.toLowerCase()) ||
        u.displayName?.toLowerCase().includes(userName.toLowerCase()) ||
        u.email?.toLowerCase().includes(userName.toLowerCase()),
    );
    return user?.id || null;
  } catch (error) {
    console.error(`Error fetching user ID for "${userName}":`, error.message);
    return null;
  }
}

async function getCurrentCycleId(teamId) {
  try {
    const team = await linearClient.team(teamId);
    const cycle = await team.activeCycle;
    return cycle?.id || null;
  } catch (error) {
    console.error('Error fetching current cycle ID:', error.message);
    return null;
  }
}

async function searchIssues({ titleContains, teamId, states, limit = 50 }) {
  try {
    const filter = {
      team: { id: { eq: teamId || LINEAR_TEAM_ID } },
      title: { containsIgnoreCase: titleContains },
    };
    if (states && states.length > 0) {
      filter.state = { name: { in: states } };
    }
    const issues = await linearClient.issues({ filter, first: limit });
    return Promise.all(
      issues.nodes.map(async (issue) => {
        const state = await issue.state;
        const parent = await issue.parent;
        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          priority: issue.priority,
          url: issue.url,
          dueDate: issue.dueDate,
          state: { name: state?.name },
          parentId: parent?.id || null,
        };
      }),
    );
  } catch (error) {
    console.error(`Error searching issues with title "${titleContains}":`, error.message);
    return [];
  }
}

async function findOpenAuditMasterTicket() {
  const results = await searchIssues({
    titleContains: 'Integration Version Audit [Rudder Transformer]',
    states: OPEN_STATES,
  });
  // Filter to only top-level tickets (no parent) and sort by highest issue number
  const getNumber = (id) => parseInt(id.replace(/\D+/g, ''), 10) || 0;
  const masterTickets = results
    .filter((issue) => !issue.parentId)
    .sort((a, b) => getNumber(b.identifier) - getNumber(a.identifier));
  return masterTickets.length > 0 ? masterTickets[0] : null;
}

async function findOpenSubticketByIntegration(parentId, integrationName) {
  const results = await searchIssues({
    titleContains: `${integrationName} Version Audit`,
    states: OPEN_STATES,
  });
  return results.find((issue) => issue.parentId === parentId) || null;
}

async function findOpenSubticketGlobally(integrationName) {
  const results = await searchIssues({
    titleContains: `${integrationName} Version Audit`,
    states: OPEN_STATES,
  });
  // Return any open subticket for this integration, regardless of parent
  return results.find((issue) => issue.parentId) || null;
}

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

async function listIssuesByParent(parentId, limit = 250) {
  try {
    const issues = await linearClient.issues({
      filter: { parent: { id: { eq: parentId } } },
      first: limit,
    });
    return Promise.all(
      issues.nodes.map(async (issue) => {
        const state = await issue.state;
        return {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          priority: issue.priority,
          url: issue.url,
          dueDate: issue.dueDate,
          state: { name: state?.name },
        };
      }),
    );
  } catch (error) {
    console.error(`Error listing issues by parent "${parentId}":`, error.message);
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

async function updateIssueDescription(issueId, description) {
  return updateIssue(issueId, { description });
}

module.exports = {
  createIssue,
  listIssuesByParent,
  updateIssue,
  updateIssueDescription,
  getStateId,
  getUserId,
  getCurrentUserId,
  getCurrentCycleId,
  searchIssues,
  findOpenAuditMasterTicket,
  findOpenSubticketByIntegration,
  findOpenSubticketGlobally,
};
