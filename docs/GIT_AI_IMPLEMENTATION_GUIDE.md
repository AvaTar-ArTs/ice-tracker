# Git AI Implementation Guide for New Repositories

## Prerequisites

Before implementing Git AI in a new repository, ensure you have:

1. Git AI installed on your system:
   ```bash
   curl -fsSL https://usegitai.com/install.sh | bash
   ```

2. API keys properly configured in your `~/.env.d/` directory (as we verified in the ice-tracker project)

## Step-by-Step Implementation

### 1. Navigate to Your Target Repository
```bash
cd /path/to/your/repository
```

### 2. Install Git AI Hooks
```bash
git-ai install-hooks
```

Note: You may encounter the same Gemini hook issue we saw in the ice-tracker project. This is normal and doesn't affect Git AI's core functionality.

### 3. Verify Installation
```bash
git-ai status
```

### 4. Begin Using Git AI
Git AI will now automatically track AI contributions as you work. The system will:
- Attribute AI-generated code to specific models
- Track human vs AI contributions
- Maintain detailed commit history with AI model information

## Best Practices for Consistent Usage

### 1. Standard Workflow Integration
- Continue using your normal Git workflow (git add, git commit, etc.)
- Git AI operates transparently in the background
- No changes needed to your existing development process

### 2. Verification Steps
After setting up Git AI in a new repository, verify functionality with:
```bash
git-ai status
git-ai stats
git-ai show HEAD
```

### 3. Troubleshooting Common Issues
If you encounter the Gemini hook installation error:
- This is cosmetic and doesn't affect core functionality
- All other AI platforms will work correctly
- Git AI will still track Gemini contributions without the automated hooks

## Configuration Consistency

### API Key Management
Ensure your `~/.env.d/` directory is properly configured with:
- `llm-apis.env` containing your LLM API keys
- `github.env` with your GitHub tokens
- Other service-specific .env files as needed

### Environment Setup
Your API keys are already properly organized in `~/.env.d/`, so Git AI should automatically access them when needed.

## Automation Suggestions

### 1. Git AI Status Check
Add a periodic check to your workflow:
```bash
# Check AI attribution in your current project
git-ai stats
```

### 2. Pre-commit Verification
Consider adding a quick Git AI status check before major commits to maintain awareness of AI usage.

## Cross-Repository Benefits

With Git AI implemented across repositories, you'll be able to:
- Track AI adoption trends across your projects
- Maintain transparency in AI-assisted development
- Have consistent attribution practices
- Monitor which AI models are most effective for different tasks

## Troubleshooting

### If Git AI Doesn't Seem to Track Contributions
1. Verify hooks are installed: `git-ai install-hooks`
2. Check that your API keys are accessible
3. Ensure you're making changes that would trigger AI attribution

### If You See the Gemini Hook Error
This is expected based on our findings in the ice-tracker project. The error doesn't impact functionality.

## Verification Checklist

- [ ] Git AI installed on system
- [ ] API keys properly configured in `~/.env.d/`
- [ ] Hooks installed in target repository (`git-ai install-hooks`)
- [ ] Status command works (`git-ai status`)
- [ ] Stats command shows attribution (`git-ai stats`)
- [ ] Normal Git workflow continues to function

## Additional Resources

Refer to the documentation created during our session:
- `GIT_AI_SESSION_SUMMARY.md`
- `docs/GIT_AI_INTEGRATION.md`
- `docs/API_CONFIGURATIONS.md`

These contain detailed information about Git AI functionality and best practices.