# omp-crofai

[Oh My Pi](https://github.com/can1357/oh-my-pi) extension that adds **CrofAI** as a provider — dynamic model discovery, pricing, and reasoning support from the `crof.ai/v1/models` API.

## Install

```bash
omp install github:Sokoshy/omp-crofai
```

Set your API key:

```bash
export CROF_API_KEY="your-key"
```

CrofAI models appear in `/model` on next OMP launch.

## Uninstall

```bash
omp plugin uninstall omp-crofai
```

## Usage

| Command | Description |
|---|---|
| `/model` | Pick a model (prefix `crof/`) |
| `/refresh-crof` | Force re-fetch models from the API |

Models, prices, and capabilities are fetched live — nothing hardcoded.

## Provider

- **API** : OpenAI-compatible (`https://crof.ai/v1`)
- **Key** : `CROF_API_KEY` env var
- **Models** : 23+ (DeepSeek, Greg, MiMo, GLM, Kimi, etc.)
- **Cache** : SQLite (24h TTL, bypass via `/refresh-crof`)
