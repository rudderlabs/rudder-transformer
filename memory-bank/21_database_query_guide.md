# Rudderstack Database Query Guide

This document provides a comprehensive guide to querying different Rudderstack databases, including the tables, fields, and example queries for common use cases.

## Table of Contents

1. [Database Overview](#database-overview)
2. [Snowflake OLAP Database](#snowflake-olap-database)
3. [PostgreSQL Reporting Database](#postgresql-reporting-database)
4. [Common Query Patterns](#common-query-patterns)
5. [Troubleshooting](#troubleshooting)
6. [Common Analysis Scenarios](#common-analysis-scenarios)

## Database Overview

Rudderstack maintains several databases for different purposes:

| Database           | Type       | Purpose                                              | Connection Details                                    |
| ------------------ | ---------- | ---------------------------------------------------- | ----------------------------------------------------- |
| RUDDER_TEST_EVENTS | Snowflake  | Configuration data, workspaces, organizations, plans | Account: vmskhef-ina31471, User: integration_accounts |
| metricsdb          | PostgreSQL | Error reporting, metrics, event tracking             | Host: localhost, Port: 18432, User: rudder            |

## Snowflake OLAP Database

### Connection

```bash
# Using SnowSQL CLI
export SNOWSQL_PWD='your_password_here'
/Applications/SnowSQL.app/Contents/MacOS/snowsql -a vmskhef-ina31471 -u integration_accounts -d RUDDER_TEST_EVENTS -s PPW_PUBLIC
```

### Key Tables

#### WORKSPACES

Contains information about customer workspaces.

| Column         | Type    | Description                         |
| -------------- | ------- | ----------------------------------- |
| ID             | VARCHAR | Primary key, workspace identifier   |
| NAME           | VARCHAR | Workspace name                      |
| ORGANIZATIONID | VARCHAR | Foreign key to organizations table  |
| STATUS         | VARCHAR | Workspace status (ACTIVE, etc.)     |
| ENVIRONMENT    | VARCHAR | Environment type (PRODUCTION, etc.) |

#### ORGANIZATIONS

Contains information about customer organizations.

| Column   | Type    | Description                            |
| -------- | ------- | -------------------------------------- |
| ID       | VARCHAR | Primary key, organization identifier   |
| NAME     | VARCHAR | Organization name                      |
| SETTINGS | VARIANT | JSON object with organization settings |

#### USER_ACCOUNTS

Links organizations to plans.

| Column         | Type    | Description                        |
| -------------- | ------- | ---------------------------------- |
| ID             | VARCHAR | Primary key                        |
| ORGID          | VARCHAR | Foreign key to organizations table |
| ORGNAME        | VARCHAR | Organization name                  |
| PLANID         | VARCHAR | Foreign key to plans table         |
| BILLINGENABLED | BOOLEAN | Whether billing is enabled         |

#### PLANS

Contains information about subscription plans.

| Column      | Type    | Description                              |
| ----------- | ------- | ---------------------------------------- |
| ID          | VARCHAR | Primary key, plan identifier             |
| NAME        | VARCHAR | Plan name (e.g., "pro", "Growth")        |
| DISPLAYNAME | VARCHAR | Display name (e.g., "Pro", "Enterprise") |
| FEATURES    | VARIANT | JSON object with plan features           |

#### DESTINATIONS

Contains information about configured destinations.

| Column                  | Type    | Description                                  |
| ----------------------- | ------- | -------------------------------------------- |
| ID                      | VARCHAR | Primary key, destination identifier          |
| WORKSPACEID             | VARCHAR | Foreign key to workspaces table              |
| DESTINATIONDEFINITIONID | VARCHAR | Foreign key to destination_definitions table |

#### DESTINATION_DEFINITIONS

Contains information about destination types.

| Column | Type    | Description                                |
| ------ | ------- | ------------------------------------------ |
| ID     | VARCHAR | Primary key                                |
| NAME   | VARCHAR | Destination name (e.g., "MP" for Mixpanel) |

### Example Queries

#### Get Workspaces with Plan Information

```sql
SELECT
  w.id as workspace_id,
  w.name as workspace_name,
  o.id as organization_id,
  o.name as organization_name,
  ua.planid as plan_id,
  p.name as plan_name,
  p.displayname as plan_display_name
FROM
  workspaces w
JOIN
  organizations o ON w.organizationid = o.id
JOIN
  user_accounts ua ON o.id = ua.orgid
JOIN
  plans p ON p.id = ua.planid
WHERE
  p.displayname NOT IN ('Open source plan', 'Free Tier')
ORDER BY
  p.displayname, w.name;
```

#### Get Mixpanel Destinations for a Workspace

```sql
SELECT
  d.id as destination_id,
  d.name as destination_name
FROM
  destinations d
JOIN
  destination_definitions dd ON d.destinationdefinitionid = dd.id
WHERE
  d.workspaceid = '2bVMV2JiAJe42OXZrzyvJI75v0N'
  AND dd.name = 'MP';
```

#### Find All Workspaces with Mixpanel Destinations

```sql
SELECT
  w.id as workspace_id,
  w.name as workspace_name,
  d.id as destination_id,
  d.name as destination_name
FROM
  workspaces w
JOIN
  destinations d ON w.id = d.workspaceid
JOIN
  destination_definitions dd ON d.destinationdefinitionid = dd.id
WHERE
  dd.name = 'MP';
```

#### Get Plan Distribution

```sql
SELECT
  p.displayname as plan_type,
  COUNT(DISTINCT w.id) as workspace_count
FROM
  workspaces w
JOIN
  organizations o ON w.organizationid = o.id
JOIN
  user_accounts ua ON o.id = ua.orgid
JOIN
  plans p ON p.id = ua.planid
GROUP BY
  p.displayname
ORDER BY
  workspace_count DESC;
```

## PostgreSQL Reporting Database

### Connection

```bash
# Using psql CLI with SSL enabled
PGPASSWORD=your_password_here psql -h localhost -p 18432 -U rudder -d metricsdb --set=sslmode=require
```

### Key Tables

#### ERRORS

Contains information about errors that occurred in the system.

| Column                    | Type      | Description                                       |
| ------------------------- | --------- | ------------------------------------------------- |
| id                        | text      | Primary key                                       |
| workspaceId               | text      | Workspace identifier                              |
| reportedAt                | bigint    | Timestamp in milliseconds when error was reported |
| count                     | bigint    | Number of occurrences                             |
| sourceId                  | text      | Source identifier                                 |
| destinationId             | text      | Destination identifier                            |
| destinationDefinitionName | text      | Destination type (e.g., "MP" for Mixpanel)        |
| errorCode                 | text      | Error code                                        |
| errorMessage              | text      | Error message                                     |
| timeStamp                 | timestamp | Timestamp when error was recorded                 |

### Example Queries

#### Find Mixpanel Size Limit Errors

```sql
SELECT
  "workspaceId",
  "destinationId",
  "errorMessage",
  COUNT(*) as error_count
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
  AND "errorMessage" ILIKE '%maximum size limit%'
  AND "reportedAt" >= extract(epoch from date_trunc('day', now()))::bigint * 1000
GROUP BY
  "workspaceId", "destinationId", "errorMessage"
ORDER BY
  error_count DESC;
```

#### Count Errors by Day

```sql
SELECT
  date_trunc('day', to_timestamp("reportedAt"/1000)) as day,
  COUNT(*)
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
  AND "errorMessage" ILIKE '%maximum size limit%'
  AND "reportedAt" >= extract(epoch from date_trunc('day', now() - interval '10 day'))::bigint * 1000
GROUP BY
  day
ORDER BY
  day DESC;
```

#### Find Most Common Error Types for a Destination

```sql
SELECT
  "errorMessage",
  COUNT(*) as error_count
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
  AND "reportedAt" >= extract(epoch from date_trunc('day', now() - interval '30 day'))::bigint * 1000
GROUP BY
  "errorMessage"
ORDER BY
  error_count DESC
LIMIT 10;
```

#### Find Workspaces with Most Errors

```sql
SELECT
  "workspaceId",
  COUNT(*) as error_count
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
  AND "reportedAt" >= extract(epoch from date_trunc('day', now() - interval '30 day'))::bigint * 1000
GROUP BY
  "workspaceId"
ORDER BY
  error_count DESC
LIMIT 10;
```

## Common Query Patterns

### Time-Based Queries

When querying time-based data, it's important to understand how timestamps are stored:

1. **Snowflake**: Typically uses `TIMESTAMP_NTZ` type
2. **PostgreSQL Reporting DB**: Uses `bigint` for `reportedAt` (milliseconds since epoch) and `timestamp` for `timeStamp`

#### Converting Epoch to Timestamp in PostgreSQL

```sql
-- Convert milliseconds since epoch to timestamp
SELECT to_timestamp("reportedAt"/1000) FROM errors LIMIT 1;

-- Get current time as milliseconds since epoch
SELECT extract(epoch from now())::bigint * 1000;

-- Get start of day 10 days ago as milliseconds since epoch
SELECT extract(epoch from date_trunc('day', now() - interval '10 day'))::bigint * 1000;
```

### Filtering by Plan Type

To filter workspaces by plan type:

```sql
-- Get all paid workspaces (excluding Free Tier and Open Source)
SELECT
  w.id as workspace_id
FROM
  workspaces w
JOIN
  organizations o ON w.organizationid = o.id
JOIN
  user_accounts ua ON o.id = ua.orgid
JOIN
  plans p ON p.id = ua.planid
WHERE
  p.displayname NOT IN ('Open source plan', 'Free Tier');
```

### Finding Error Patterns

To identify common error patterns:

```sql
-- Get most common error messages for a destination type
SELECT
  "errorMessage",
  COUNT(*) as error_count
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
GROUP BY
  "errorMessage"
ORDER BY
  error_count DESC
LIMIT 10;
```

### Combining Data from Both Databases

To analyze errors by plan type, you'll need to:

1. Query the PostgreSQL database for error data
2. Query the Snowflake database for plan data
3. Join the data in your application or export to a common format

Example workflow:

```bash
# Export error data from PostgreSQL
PGPASSWORD=your_password_here psql -h localhost -p 18432 -U rudder -d metricsdb -c "COPY (SELECT \"workspaceId\", COUNT(*) FROM errors WHERE \"destinationDefinitionName\" = 'MP' GROUP BY \"workspaceId\") TO STDOUT WITH CSV HEADER" --set=sslmode=require > mixpanel_errors.csv

# Export workspace data from Snowflake
export SNOWSQL_PWD='your_password_here'
/Applications/SnowSQL.app/Contents/MacOS/snowsql -a vmskhef-ina31471 -u integration_accounts -d RUDDER_TEST_EVENTS -s PPW_PUBLIC -q "SELECT w.id, p.displayname FROM workspaces w JOIN organizations o ON w.organizationid = o.id JOIN user_accounts ua ON o.id = ua.orgid JOIN plans p ON p.id = ua.planid" -o output_format=csv > workspace_plans.csv

# Then join these files using a tool like Python, R, or Excel
```

## Troubleshooting

### Slow Queries

If queries are running slowly:

1. **Break down by time**: Query smaller time ranges (e.g., day by day)
2. **Limit results**: Use `LIMIT` to reduce result set size
3. **Use specific filters**: Add more specific WHERE clauses
4. **Check indexes**: Ensure relevant columns are indexed

### Connection Issues

If you're having trouble connecting:

1. **PostgreSQL**:

   - Ensure SSL is enabled: `--set=sslmode=require`
   - Check port and credentials
   - Verify the server is running

2. **Snowflake**:
   - Set password via environment variable: `export SNOWSQL_PWD='your_password_here'`
   - Verify account identifier format: `vmskhef-ina31471`

### Column Name Case Sensitivity

PostgreSQL requires double quotes for case-sensitive column names:

```sql
-- Incorrect (will fail)
SELECT workspaceId FROM errors;

-- Correct
SELECT "workspaceId" FROM errors;
```

### Large Result Sets

When dealing with large result sets:

1. **Use aggregation**: Group by relevant dimensions
2. **Filter aggressively**: Apply filters to reduce data volume
3. **Export to file**: For very large datasets, export to file and process offline

```sql
-- Export large result set to CSV
PGPASSWORD=your_password_here psql -h localhost -p 18432 -U rudder -d metricsdb -c "COPY (SELECT * FROM errors WHERE \"destinationDefinitionName\" = 'MP' LIMIT 1000) TO STDOUT WITH CSV HEADER" --set=sslmode=require > mixpanel_errors.csv
```

## Common Analysis Scenarios

### Analyzing Error Trends

To analyze error trends over time:

```sql
SELECT
  date_trunc('day', to_timestamp("reportedAt"/1000)) as day,
  "errorMessage",
  COUNT(*) as error_count
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
  AND "reportedAt" >= extract(epoch from date_trunc('day', now() - interval '30 day'))::bigint * 1000
GROUP BY
  day, "errorMessage"
ORDER BY
  day DESC, error_count DESC;
```

### Identifying High-Value Customers with Issues

To identify high-value customers (Enterprise/Growth plans) experiencing errors:

```sql
-- First, get workspaces with errors from PostgreSQL
-- Then, join with plan data from Snowflake

-- Example query for Snowflake to get high-value workspaces
SELECT
  w.id as workspace_id,
  w.name as workspace_name,
  p.displayname as plan_type
FROM
  workspaces w
JOIN
  organizations o ON w.organizationid = o.id
JOIN
  user_accounts ua ON o.id = ua.orgid
JOIN
  plans p ON p.id = ua.planid
WHERE
  p.displayname IN ('Enterprise', 'Growth')
  AND w.id IN ('workspace_id_1', 'workspace_id_2', ...);  -- IDs from error query
```

### Monitoring Specific Error Types

To monitor specific error types over time:

```sql
SELECT
  date_trunc('day', to_timestamp("reportedAt"/1000)) as day,
  COUNT(*) as error_count
FROM
  errors
WHERE
  "destinationDefinitionName" = 'MP'
  AND "errorMessage" ILIKE '%maximum size limit%'
  AND "reportedAt" >= extract(epoch from date_trunc('day', now() - interval '30 day'))::bigint * 1000
GROUP BY
  day
ORDER BY
  day DESC;
```

---

This document provides a comprehensive guide to querying Rudderstack databases. For specific use cases or more complex queries, consult the database documentation or reach out to the data team.
