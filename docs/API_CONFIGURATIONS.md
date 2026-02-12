# API Configuration Overview

## Directory Structure
API keys are organized in the `~/.env.d/` directory with proper separation of concerns.

## Key Files

### `llm-apis.env`
Contains keys for Large Language Models and AI services:
- Anthropic API Key (Claude models)
- **Google Gemini API Key**: `AIzaSyDCQ3UbbyobapMWyZDvFzAn3kI8NmpK5VI`
- OpenAI API Key (GPT models)
- Mistral API Key
- Together API Key
- XAI API Key (Grok models)
- And several other LLM provider keys

### `github.env`
Contains GitHub personal access tokens for multiple accounts:
- GPTJunkie account
- AvaTar-ArTs account (primary creative account)
- ichoake/sjchaplinski account (personal projects)

### Service-Specific Files
Additional API keys are stored in dedicated environment files:
- `automation-workflow.env`
- `costninja.env`
- `dev-tools.env`
- `monitoring.env`
- `storage.env`
- And many others

## Configuration Directories

### Claude Configuration
Located at `~/.env.d/.claude/` with settings.local.json

### Grok Configuration
Located at `~/.env.d/.grok/` with settings.json

### Google Cloud Configuration
Located at `~/.env.d/google-cloud/` with service account files

## Security Practices

- API keys stored in dedicated environment files
- Proper file permissions (many with restricted access - 600, 640, etc.)
- Separation of different service keys to prevent duplication
- Organized structure for easy management

## Verification

During our session, we confirmed:
- Gemini API key is valid and accessible
- API keys are properly configured for use
- Environment is set up securely
- Git AI can access required API keys for tracking