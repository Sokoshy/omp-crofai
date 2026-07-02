# omp-crofai

[Oh My Pi](https://github.com/can1357/oh-my-pi) extension that adds **CrofAI** as a provider — dynamic model discovery, pricing, and reasoning support from the `crof.ai/v1/models` API.

## Install

```bash
omp install github:Sokoshy/omp-crofai
```

## API Key

CrofAI is **not** in the `/login` provider list — set your key via environment variable:

```bash
export CROF_API_KEY="your-key"
```

To make it permanent, add the line to your `~/.bashrc`, `~/.zshrc`, or `~/.config/fish/config.fish`.

Get a free key at [crof.ai](https://crof.ai) (no credit card required).

## Usage

Once the key is set, CrofAI models appear in `/model` with the `crof/` prefix.

| Command | Description |
|---|---|
| `/model` | Pick a model (prefix `crof/`) |
| `/refresh-crof` | Force re-fetch models from the API |

Models, prices, and capabilities are fetched live — nothing hardcoded.

## Uninstall

```bash
omp plugin uninstall omp-crofai
```

## Provider

- **API** : OpenAI-compatible (`https://crof.ai/v1`)
- **Key** : `CROF_API_KEY` env var
- **Models** : 23+ (DeepSeek, Greg, MiMo, GLM, Kimi, etc.)
- **Cache** : SQLite (24h TTL, bypass via `/refresh-crof`)
