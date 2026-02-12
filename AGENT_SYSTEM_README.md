# Git AI Agent System

Comprehensive automation and management tools for Git AI across all repositories.

## Overview

This system provides multiple tools to help manage Git AI installations, troubleshoot issues, and maintain consistent AI attribution tracking across all your projects.

## Components

### 1. Git AI Dashboard (`git-ai-dashboard.sh`)

A simple tool for managing Git AI in individual repositories.

#### Features:
- Check Git AI installation status
- Set up Git AI in new repositories
- Diagnose common issues
- Verify API key configurations
- Generate attribution reports

#### Usage:
```bash
# Check status in current repository
./scripts/git-ai-dashboard.sh status

# Set up Git AI in current repository
./scripts/git-ai-dashboard.sh setup

# Diagnose issues
./scripts/git-ai-dashboard.sh diagnose

# Check API configurations
./scripts/git-ai-dashboard.sh api-check

# Generate attribution report
./scripts/git-ai-dashboard.sh report
```

### 2. Git AI Superpower Agent (`git-ai-superpower-agent.sh`)

An advanced automation tool for comprehensive Git AI management across multiple repositories.

#### Features:
- **Multi-repository scanning**: Scan all your repositories for Git AI status
- **Automated fixing**: Automatically resolve common Git AI issues
- **Security validation**: Check API key security and configurations
- **Attribution analysis**: Analyze AI adoption trends across projects
- **Complete diagnostics**: Run all checks with a single command
- **Logging**: Track all agent activities

#### Usage:
```bash
# Scan all repositories for Git AI status
./scripts/git-ai-superpower-agent.sh scan

# Run automated fixer for common issues
./scripts/git-ai-superpower-agent.sh fix

# Validate API key security
./scripts/git-ai-superpower-agent.sh security

# Analyze attribution trends
./scripts/git-ai-superpower-agent.sh analyze

# Run complete diagnostics
./scripts/git-ai-superpower-agent.sh all

# View recent agent logs
./scripts/git-ai-superpower-agent.sh logs
```

## Skills Framework

The system also includes a skills framework in the `skills/` directory that can be extended for more advanced AI-assisted development workflows.

## Best Practices

1. **Regular Scanning**: Use the superpower agent to regularly scan your repositories
2. **Security Checks**: Periodically validate your API key configurations
3. **Attribution Awareness**: Monitor AI vs human contribution ratios
4. **Issue Resolution**: Use the automated fixer to resolve common problems

## Known Issues

- The Gemini hook installation error ("JSON error: key must be a string at line 2 column 3") is a known cosmetic issue that doesn't affect Git AI functionality
- Both agent scripts handle this issue gracefully

## Integration

These tools are designed to complement your existing Git workflow and can be integrated into:
- CI/CD pipelines
- Development environment setups
- Team onboarding processes
- Regular maintenance routines

## Extending the System

The modular design allows for easy extension:
- Add new diagnostic checks to the superpower agent
- Create specialized scripts for specific workflows
- Integrate with IDE plugins or development tools