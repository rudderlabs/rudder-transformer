# RudderStack Transformer Memory Bank

This directory contains structured information about the RudderStack Transformer project, organized in markdown files by category. This memory bank follows best practices for AI agent knowledge management, using a hierarchical structure with clear, well-organized information.

## Files and Categories

### Project Fundamentals

1. **Project Overview** (`01_project_overview.md`)
   - Name, description, objectives, scope, timeline, and team members
   - Team structure and responsibilities
   - Integration with Event Stream Pipeline
   - System dependencies

1a. **Common Terminology** (`01a_common_terminology.md`)

- Definitions of key terms used in rudder-transformer
- Explanation of core concepts like batching, transform proxy, deliver
- Clarification of components like router, processor, multiplexing
- Description of transformation types and data flow components

2. **Technical Stack** (`02_technical_stack.md`)

   - Languages, frameworks, libraries, and tools used in the project
   - Development environment setup
   - Third-party dependencies

3. **System Architecture** (`03_system_architecture.md`)

   - Components and their relationships within the system
   - Data flow and scaling architecture
   - Integration with RudderStack ecosystem

4. **System Dependencies** (`10_system_dependencies.md`)

   - Dependencies and interactions with other RudderStack components
   - API interactions between rudder-server, rudder-ingestion-svc, and rudder-transformer
   - Configuration dependencies with rudder-integrations-config
   - System flow and deployment considerations

5. **Event Stream Pipeline** (`08_event_stream_pipeline.md`)
   - Details about the Event Stream pipeline functionality
   - Cloud mode vs. Device mode
   - Data flow through the pipeline

### Development Guidelines

6. **Code Structure** (`07_code_structure.md`)

   - Directory layout, naming conventions, and modular organization
   - Code organization principles
   - Module dependencies

7. **Best Practices and Guidelines** (`05_best_practices_and_guidelines.md`)

   - Coding standards, design patterns, and testing methodologies
   - Error handling and logging
   - Performance optimization

8. **Preferences and Settings** (`04_preferences_and_settings.md`)

   - User preferences and system settings
   - Configuration options
   - Environment variables

9. **Workflows and Processes** (`06_workflows_and_processes.md`)

   - Development workflow, deployment process, and maintenance procedures
   - Code review process
   - Release management

10. **Git Workflow and CI/CD** (`11_git_workflow_cicd.md`)
    - Git branching strategy and workflow process
    - Commit standards and validation
    - Pull request requirements and review process
    - CI/CD pipeline with GitHub Actions
    - Release and hotfix processes

### Integration Development

11. **Integration Development Guide** (`09_integration_development_guide.md`)

    - Step-by-step guide for developing source and destination integrations
    - Required components and minimum functions for integrations
    - Best practices and common pitfalls

12. **Version Differences** (`16_version_differences.md`)

    - Explanation of v0, v1, and CDK v2 versions
    - Architectural differences between versions
    - Migration guidelines between versions
    - Advantages and disadvantages of each approach

13. **Integration Analysis** (`12_integration_analysis.md`)

    - Analysis of v0, v1, and CDK v2 integration implementations
    - Identification of patterns, inconsistencies, and gaps
    - Rating of integrations based on complexity and code quality
    - Recommendations for improvement and documentation

14. **API Endpoints Analysis** (`13_api_endpoints.md`)

    - Documentation of API endpoint patterns and versioning
    - Template for comprehensive API endpoint documentation
    - Automation suggestions for API version checking
    - Integration-specific API endpoint examples

15. **Integration Nuances and Edge Cases** (`14_integration_nuances.md`)

    - Special handling requirements for different integrations
    - Common edge cases and their solutions
    - Performance considerations and optimization techniques
    - Integration-specific recommendations

16. **Integration-Specific Documentation** (`15_integration_specific_docs.md`)
    - Template for comprehensive integration documentation
    - Example documentation for selected integrations
    - Documentation management approaches
    - Documentation generation and testing strategies

### Advanced Implementation

17. **Proxy Implementation Guide** (`17_proxy_implementation_guide.md`)

    - Guide for implementing proxy functionality for destinations
    - Onboarding destinations to proxy v0 and proxy v1
    - Best practices and implementation patterns
    - Error handling and response processing

18. **Component Testing Guide** (`18_component_testing_guide.md`)

    - Guide for writing component tests for rudder-transformer
    - Best practices for testing integrations
    - Test structure and organization
    - Mocking and test data management

19. **Reorganization** (`19_reorganization.md`)

    - Memory bank reorganization approach
    - Improvements to address duplication
    - Enhanced cross-references
    - Consistency across files

20. **Consistency Analysis** (`20_consistency_analysis.md`)
    - Analysis of memory bank consistency
    - Identified inconsistencies
    - Recommendations for improvement
    - Clarity and maintainability enhancements

### Memory Bank Management

22. **Review and Questions** (`review_and_questions.md`)

    - Review of memory bank structure and content
    - Identification of areas needing clarification
    - Questions for improving accuracy and completeness
    - Next steps for memory bank enhancement

23. **Task Tracking** (`task_tracking.md`)
    - Comprehensive list of completed tasks
    - Tracking of pending tasks and requirements
    - Current focus and next steps
    - Ensures systematic completion of all instructions

## About RudderStack Transformer

RudderStack Transformer is a service that handles both source and destination integrations in the RudderStack ecosystem. It transforms data between different formats as needed:

1. For sources: It transforms data from external sources (like webhooks, cloud apps) into RudderStack's standard event format
2. For destinations: It transforms RudderStack events to destination-specific formats

It serves as a critical component in the RudderStack data pipeline, enabling data to flow bidirectionally between various sources and destinations by handling the necessary format transformations.

## Key Features

- Support for numerous destinations and sources
- Scalable architecture with clustering support
- Comprehensive monitoring and metrics
- Extensible through the Component Development Kit (CDK)
- Robust error handling and reporting
- High-performance event processing

## Cross-References

### For New Developers

If you're new to the project, we recommend reading these documents in order:

1. [Project Overview](01_project_overview.md)
   1a. [Common Terminology](01a_common_terminology.md)
2. [System Architecture](03_system_architecture.md)
3. [Event Stream Pipeline](08_event_stream_pipeline.md)
4. [Code Structure](07_code_structure.md)
5. [Workflows and Processes](06_workflows_and_processes.md)

### For Integration Developers

If you're working on integrations, focus on these documents:

1. [Integration Development Guide](09_integration_development_guide.md)
2. [Version Differences](16_version_differences.md)
3. [API Endpoints Analysis](13_api_endpoints.md)
4. [Integration Nuances and Edge Cases](14_integration_nuances.md)
5. [Integration-Specific Documentation](15_integration_specific_docs.md)
6. [Common Terminology](01a_common_terminology.md)

### For DevOps Engineers

If you're responsible for deployment and operations, these documents are most relevant:

1. [System Dependencies](10_system_dependencies.md)
2. [Git Workflow and CI/CD](11_git_workflow_cicd.md)
3. [Preferences and Settings](04_preferences_and_settings.md)

## Usage

These files provide a structured knowledge base about the RudderStack Transformer project. You can use them to:

1. Onboard new team members
2. Reference project standards and practices
3. Understand the system architecture
4. Follow established workflows and processes
5. Develop new integrations
6. Troubleshoot issues

## Updating

When significant changes are made to the project, consider updating the relevant files in this memory bank to keep the information current and accurate. In particular:

1. When adding new integrations, update the [Integration Analysis](12_integration_analysis.md) document
2. When changing workflows, update the [Workflows and Processes](06_workflows_and_processes.md) document
3. When modifying the architecture, update the [System Architecture](03_system_architecture.md) document
4. When adding new dependencies, update the [System Dependencies](10_system_dependencies.md) document

## Sources

The information in this memory bank was compiled from:

- Repository code analysis
- Project documentation
- Integration SDK documentation from Notion
- RudderStack Event Stream documentation
- README and other documentation files
