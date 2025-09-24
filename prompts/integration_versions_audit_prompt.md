# Integration Version Audit with Linear Ticket Management

You are tasked with conducting a comprehensive audit of integration versions across multiple RudderStack repositories to identify deprecation risks, version mismatches, and upgrade urgencies. This analysis will create and manage Linear tickets for tracking progress and ensuring timely resolution of critical issues.

---

## **Objective**

Analyze all integrations documented in a Notion database to:

1. Validate current API/SDK versions against official documentation
2. Identify deprecation dates and upgrade requirements
3. Create Linear tickets with appropriate priority and due dates
4. Generate actionable recommendations in ticket descriptions
5. Maintain incremental progress through Linear ticket management

---

## **Prerequisites**

- Access to Notion API for reading integration documentation: https://www.notion.so/rudderstacks/6e068b693e01413cbe768cd826f3f7b7?v=193f2b415dd0804ea829000c455eb136
- Web search capabilities for official documentation validation
- Access to Linear workspace with ticket creation permissions
- **Master Linear Ticket URL**: https://linear.app/rudderstack/issue/INT-3961/review-integration-version-upgrades
- Access to RudderStack codebase repositories:
  - `rudder-transformer` (server-side transformations)
  - `rudder-sdk-js` (client-side integrations)
  - `rudder-integrations-info` (integration routes/configs)
  - `rudder-integrations-lib` (SDK wrappers)
  - `rudder-server/router/batchrouter/asyncdestinationmanager` (async/batch destinations with Go SDKs)
  - `rudder-server/go.mod` (Go dependency versions)

---

## **Priority and Due Date Mapping**

### Priority Levels:

- **Urgent (1)**: Deprecated with sunset date < 3 months
- **High (2)**: Deprecated with sunset date < 6 months
- **Medium (3)**: Deprecated with sunset date < 12 months or using significantly outdated version
- **Low (4)**: Minor version updates, no immediate deprecation risk

### Due Date Logic:

- **Urgent**: Tomorrow (if deprecation < 3 months from now)
- **High**: 3 months before deprecation date
- **Medium**: 6 months before deprecation date
- **Low**: 12 months from analysis date or no specific due date

---

## **Step-by-Step Execution Plan**

### **Phase 0: State Verification and Continuation Setup**

#### Step 0.1: Retrieve Master Ticket and Existing State

```
TOOL: mcp_Linear_get_issue
ACTION: Retrieve the master Linear ticket details and current description
PARAMETERS:
- id: [Master ticket ID from provided URL]
```

#### Step 0.2: Analyze Existing Sub-tickets

```
TOOL: mcp_Linear_list_issues
ACTION: Find all existing sub-tickets for this audit
PARAMETERS:
- parentId: [Pick this from master linear ticket url]
- includeArchived: false
- limit: 250
```

#### Step 0.3: Parse Existing Progress

From the master ticket description and sub-tickets, extract:

- **Integrations with Sub-tickets**: Those requiring action (from sub-ticket list)
- **No-Action Integrations**: Those marked as up-to-date/compliant (from master ticket description)
- Current progress counts by priority level
- Last update timestamp
- Any integrations currently "In Progress" that may need completion

#### Step 0.4: Create Progress Tracking System

```
TOOL: todo_write
ACTION: Create todo list including continuation logic
PARAMETERS:
- Tasks for state verification and continuation
- Set first task to "in_progress"
```

---

### **Phase 1: Data Collection and Integration Selection**

#### Step 1.1: Access Master Notion Database

```
TOOL: mcp_Notion_fetch
ACTION: Retrieve the master Notion page/database containing all integrations
PARAMETERS:
- id: [Master Notion URL/ID provided by user]
```

#### Step 1.2: Extract Complete Integration List

```
TOOL: mcp_Notion_search
ACTION: Search for all integration entries in the database
PARAMETERS:
- query: "destination integration API version"
- data_source_url: [Use collection URL from master database if available]
```

#### Step 1.3: Identify Remaining Integrations

**CRITICAL**: Cross-reference the complete Notion integration list with BOTH existing Linear sub-tickets AND the no-action list from master ticket to determine:

- **Completed Integrations**: Those with existing sub-tickets (skip these)
- **No-Action Integrations**: Those listed in master ticket as up-to-date/compliant (skip these)
- **Remaining Integrations**: Those without sub-tickets AND not in no-action list (candidates for this run)
- **In-Progress Integrations**: Sub-tickets in "In Progress" state (may need completion)

#### Step 1.4: Select Next Batch for Analysis

From the **Remaining Integrations** list:

- Select 5-10 integrations for this run
- Prioritize based on:
  - Integration popularity/usage (if known)
  - Alphabetical order for consistency
  - Any specific integrations mentioned by the user

---

### **Phase 2: Individual Integration Analysis Loop**

**IMPORTANT**: Only process integrations from the **Selected Next Batch** (Step 1.4). Skip any integrations that already have sub-tickets.

For each integration in the selected batch, execute the following sub-steps:

#### Step 2.1: Retrieve Integration Details

```
TOOL: mcp_Notion_fetch
ACTION: Get detailed information for the specific integration
PARAMETERS:
- id: [Integration page URL/ID]
```

#### Step 2.2: Extract Key Information

From the Notion document, extract:

- Integration name
- Current API version in use
- Latest API version documented
- Current SDK version (if applicable)
- Official documentation links
- Existing sunset/deprecation dates
- Comments or notes

#### Step 2.3: Validate Documentation Links

```
TOOL: web_search
ACTION: Verify if the provided documentation link is correct and accessible
PARAMETERS:
- search_term: "[Integration Name] official API documentation [current year]"
```

If link is incorrect or inaccessible:

```
TOOL: web_search
ACTION: Find the correct official documentation
PARAMETERS:
- search_term: "[Integration Name] developers documentation API reference official"
```

#### Step 2.4: Search Codebase Implementation

```
TOOL: codebase_search (parallel execution recommended)
ACTION: Find integration implementations across repositories
PARAMETERS:
- query: "[Integration Name] API version implementation"
- target_directories: [] (search all repositories)

TOOL: grep (parallel execution)
ACTION: Find specific integration files and SDK dependencies
PARAMETERS:
- pattern: "[integration_name]|[Integration Name]"
- output_mode: "files_with_matches"
- -i: true

TOOL: grep (additional search for Go SDK dependencies)
ACTION: Search for Go SDK imports in rudder-server
PARAMETERS:
- pattern: "github\\.com/.*(sdk|api|client|go).*[Integration Name]"
- path: "/path/to/rudder-server"
- output_mode: "content"
- -i: true
```

#### Step 2.5: Analyze Code Implementation

```
TOOL: read_file (for key files found)
ACTION: Examine configuration and implementation files
Focus on:
- API endpoint URLs (look for version indicators like /v1/, /v2/, /api/3/)
- SDK loading scripts and URLs
- Version constants or configurations
```

#### Step 2.6: Research Latest Versions and Deprecation

```
TOOL: web_search (parallel execution recommended)
SEARCHES:
1. "[Integration Name] API latest version [current year]"
2. "[Integration Name] API deprecation sunset date [current year]"
3. "[Integration Name] API version migration guide"
4. "[Integration Name] SDK latest version deprecation"
```

#### Step 2.7: Version Comparison Analysis

Compare and document:

- **Notion Document Version** vs **Code Implementation Version** vs **Latest Available Version**
- Identify discrepancies and gaps
- Note any version inconsistencies between different repositories

#### Step 2.8: Determine Action Required and Create Ticket OR Add to No-Action List

**Decision Logic:**

- **Create Sub-ticket IF**: Version updates needed, deprecation risks, or configuration issues found
- **Add to No-Action List IF**: Integration is up-to-date, compliant, and requires no immediate action

**For integrations requiring action**, create a sub-ticket:

```
TOOL: mcp_Linear_create_issue
ACTION: Create sub-ticket for integration version issue
PARAMETERS:
- title: "[Integration Name] Version Audit"
- team: [Appropriate team ID]
- parentId: [Master ticket ID]
- priority: [1-4 based on urgency mapping above]
- dueDate: [Calculated based on deprecation timeline]
- labels: ["integration-audit", "version-update", "deprecation-risk"]
- description: [Detailed analysis using Individual Integration Ticket Template]
```

**For integrations requiring no action**, add to tracking list for master ticket update:

- Integration Name: [Brief reason - e.g., "Latest version, no deprecation announced"]

---

### **Phase 3: Comprehensive Summary Update**

#### Step 3.1: Collect All Current Sub-tickets (Including New Ones)

```
TOOL: mcp_Linear_list_issues
ACTION: Get updated list of all sub-tickets after current batch completion
PARAMETERS:
- parentId: [Master ticket ID]
- includeArchived: false
- limit: 250
```

#### Step 3.2: Categorize All Integrations by Status

From ALL existing sub-tickets AND no-action integrations (previous + current batch), categorize:

- **Critical Issues (Urgent Priority)**: Count and list with due dates
- **High Priority Updates**: Count and list with due dates
- **Medium Priority Monitoring**: Count and list with due dates
- **Low Priority / Up-to-Date**: Count and list (from sub-tickets)
- **No Action Required**: Count and list (from tracking list)
- **Unknown / Pending Further Info**: Count and list

#### Step 3.3: Calculate Updated Progress Metrics

- **Total Integrations from Notion**: [Count from Step 1.2]
- **Total Integrations Analyzed**: [Count of all sub-tickets + no-action integrations]
- **Progress Percentage**: [Analyzed / Total * 100]
- **Remaining Integrations**: [Total - Analyzed]

#### Step 3.4: Update Master Ticket with Complete Summary

```
TOOL: mcp_Linear_update_issue
ACTION: Update master ticket with comprehensive current state
PARAMETERS:
- id: [Master ticket ID]
- description: [Complete updated summary using Master Ticket Description Template with ALL current data]
```

**CRITICAL**: The master ticket description should reflect the **complete current state** of the audit, including:

- All integrations processed to date (not just the current batch)
- Updated counts for each priority category INCLUDING no-action integrations
- Current progress percentage (sub-tickets + no-action integrations)
- **Complete no-action list** for future run reference
- Next steps and recommendations

---

## **Linear Ticket Description Templates**

### **Master Ticket Description Template**

```markdown
# Integration Version Audit - Executive Summary

**Last Updated**: [Current Date]  
**Total Integrations Analyzed**: [Number] / [Total]  
**Progress**: [Percentage]%

## 🚨 Critical Issues (Urgent Priority)

**Count**: [Number]

- [Integration Name] - Due: [Date] - [Brief description]

## ⚠️ High Priority Updates

**Count**: [Number]

- [Integration Name] - Due: [Date] - [Brief description]

## 📋 Medium Priority Monitoring

**Count**: [Number]

- [Integration Name] - Due: [Date] - [Brief description]

## ✅ Low Priority / Up-to-Date

**Count**: [Number]

- [Integration Name] - [Status]

## ✅ No Action Required (Up-to-Date & Compliant)

**Count**: [Number]

- [Integration Name] - [Brief reason - e.g., "Latest version v2.1.0, no deprecation announced"]
- [Integration Name] - [Brief reason - e.g., "Using current API v3, compliant with latest standards"]

## ❓ Unknown / Pending Further Info

**Count**: [Number]

- [Integration Name] - [Issue description]

## 📊 Repository Coverage Analysis

- **rudder-transformer**: [X] integrations found
- **rudder-sdk-js**: [X] integrations found
- **rudder-integrations-info**: [X] integrations found
- **rudder-integrations-lib**: [X] integrations found
- **rudder-server/asyncdestinationmanager**: [X] async/batch integrations found
- **rudder-server/go.mod**: [X] Go SDK dependencies tracked

## 🔗 Master Documentation

- [Notion Database](https://www.notion.so/rudderstacks/6e068b693e01413cbe768cd826f3f7b7?v=193f2b415dd0804ea829000c455eb136)

## 📋 Next Actions

1. **Immediate**: Review and assign urgent tickets
2. **This Week**: Plan high priority upgrades
3. **This Month**: Schedule medium priority reviews
```

### **Individual Integration Ticket Description Template**

````markdown
# [Integration Name] Version Audit Results

## 🔍 Current State Analysis

**Notion Documentation Version**: `[version]`  
**Code Implementation Version**: `[version]`  
**Latest Available Version**: `[version]`

## ⚠️ Deprecation Information

**Sunset Date**: [date or "None announced"]  
**Migration Path**: [details or "N/A"]  
**Urgency Level**: [CRITICAL/HIGH/MEDIUM/LOW]

## 📂 Repository Implementation Status

- **rudder-transformer**: [✅ Found / ❌ Not Found / 📍 Version: X.X.X]
- **rudder-sdk-js**: [✅ Found / ❌ Not Found / 📍 Version: X.X.X]
- **rudder-integrations-info**: [✅ Found / ❌ Not Found / 📍 Version: X.X.X]
- **rudder-integrations-lib**: [✅ Found / ❌ Not Found / 📍 Version: X.X.X]
- **rudder-server/asyncdestinationmanager**: [✅ Found / ❌ Not Found / 📍 Version: X.X.X]
- **rudder-server/go.mod**: [✅ SDK Dependency / ❌ No SDK / 📍 Version: X.X.X]

## 🔗 Reference Links

**Official Documentation**: [Verified URL]  
**Notion Page**: [Integration Notion URL]  
**Migration Guide**: [URL if available]  
**Changelog**: [URL if available]

## 💻 Code Snippets Found

### Configuration Files

```[language]
[Relevant code snippets showing version usage]
```
````

### API Endpoints

```[language]
[API endpoint configurations with version indicators]
```

## 📋 Action Items

### Immediate Actions Required:

- [ ] [Specific action 1]
- [ ] [Specific action 2]

### Implementation Steps:

1. [Step 1 with timeline]
2. [Step 2 with timeline]
3. [Step 3 with timeline]

### Testing Requirements:

- [ ] Verify backward compatibility
- [ ] Test migration path
- [ ] Update integration tests

## 🎯 Success Criteria

- [ ] Version updated across all repositories
- [ ] Tests passing
- [ ] Documentation updated
- [ ] No breaking changes for existing users

## ⚠️ Risk Assessment

**Breaking Changes**: [Yes/No - details]  
**Customer Impact**: [High/Medium/Low - explanation]  
**Rollback Plan**: [Description]

## 📝 Additional Notes

[Any other relevant information, edge cases, or considerations]

---

## **Known Async/Batch Integrations in rudder-server**

The following async/batch integrations are implemented in `rudder-server/router/batchrouter/asyncdestinationmanager/` and should be included in version audits:

### **Async Destination Integrations**

- **BINGADS_AUDIENCE**: Uses `github.com/rudderlabs/bing-ads-go-sdk v0.2.3`
- **BINGADS_OFFLINE_CONVERSIONS**: Uses `github.com/rudderlabs/bing-ads-go-sdk v0.2.3`
- **MARKETO_BULK_UPLOAD**: HTTP API-based (no external SDK)
- **ELOQUA**: HTTP API-based (no external SDK)
- **YANDEX_METRICA_OFFLINE_EVENTS**: HTTP API-based (no external SDK)
- **KLAVIYO_BULK_UPLOAD**: HTTP API-based (no external SDK)
- **LYTICS_BULK_UPLOAD**: HTTP API-based (no external SDK)
- **SNOWPIPE_STREAMING**: HTTP API-based (no external SDK)
- **SFTP**: Built-in Go SFTP client (no external SDK)

### **Additional Go SDK Dependencies in go.mod**

Check `rudder-server/go.mod` for other SDK versions that may need auditing:

- AWS SDK v2 components
- Google Cloud SDKs
- Database drivers (PostgreSQL, MySQL, etc.)
- Message queue SDKs (Kafka, Pulsar, etc.)

**IMPORTANT**: When processing integrations, always check if they have corresponding async/batch implementations in rudder-server that use Go SDKs, as these may have different version requirements than the transformer implementations.

---

## **Error Handling and Edge Cases**

- Missing or broken documentation links → Create ticket with "Unknown" priority, request documentation review

---

## **Optimization Tips**

- Execute web searches & codebase scans in parallel
- Use efficient search (semantic + grep for versions)
- Batch ticket creation to avoid API rate limits
- Update master ticket summary after each batch
- Use Linear's bulk operations when available

---

## **Final Workflow Summary**

### **Continuity-Aware Workflow**

1. **State Verification Phase**:
   - Retrieve master ticket current state
   - List all existing sub-tickets
   - Identify completed vs remaining integrations
2. **Smart Selection Phase**:
   - Get complete integration list from Notion
   - Cross-reference with existing tickets to avoid duplicates
   - Select 5-10 new integrations for current run
3. **Analysis Loop**: For each NEW integration only:
   - Gather version information from all sources (including async/batch implementations)
   - Check rudder-server for Go SDK dependencies
   - Research deprecation timelines for all implementations
   - Create appropriately prioritized sub-ticket
   - Include all relevant links and code snippets
4. **Comprehensive Summary Phase**:
   - Collect ALL sub-tickets (previous + current)
   - Recalculate complete progress metrics
   - Update master ticket with full current state
5. **Repeat**: Continue with next batch until all integrations processed

### **Key Continuity Features**

- **No Duplicate Work**: Always check existing sub-tickets AND no-action list before processing integrations
- **Complete State Tracking**: Master ticket always reflects total progress including both action-required and no-action integrations
- **Smart Decision Making**: Creates tickets only when action is needed, tracks compliant integrations separately
- **Incremental Progress**: Each run builds upon previous work without re-analyzing compliant integrations
- **Smart Resumption**: Can resume from any point without losing context or re-processing completed work

The master ticket serves as the **authoritative dashboard** showing the complete audit state across all runs, while individual integration tickets contain detailed technical information and actionable tasks for development teams.
