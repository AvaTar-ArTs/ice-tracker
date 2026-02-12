# Changelog — v4

## 0.4.0

- **In-browser AI summarization**: "Summarize with AI (in-browser)" uses `@huggingface/transformers` in the client. No server API keys (OpenAI/Gemini) required.
- Same app as v3 otherwise: ICE news feed, ERO map, Know Your Rights, rapid response & hotlines, community reports, shareable filter URLs, API cache, security headers.
- First summarization may be slow while the model downloads; subsequent runs use the cached model.
