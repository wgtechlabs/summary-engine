# @wgtechlabs/summary-engine

Deterministic summary extraction and title generation for support integrations.

## Features

- Deterministic, no AI/network dependency
- Tunable extraction/scoring rules
- Presets for Telegram, WhatsApp, and Discord
- Bun-native test suite
- CLI preview mode for fast tuning

## Runtime and Toolchain

- Runtime target: Node.js 26
- Supported runtime versions: Node.js 22, 24, 26
- Toolchain: Bun + Biome + bun test

## Install

```bash
bun add @wgtechlabs/summary-engine
```

## Quick Use

```ts
import { buildTitle, telegramPreset } from "@wgtechlabs/summary-engine";

const title = buildTitle(
  {
    summary:
      "A subset of users cannot complete password reset because reset links intermittently return token expired.",
    customerName: "Acme Corp"
  },
  telegramPreset
);

console.log(title);
// [Telegram] Cannot complete password reset
```

## API

### buildTitle(input, config?)

Builds a full title string with fallback order:

1. Prefix + extracted summary
2. Prefix + customer + fallback suffix
3. Prefix + fallback new ticket

### extractSummary(summary, config?)

Extracts a compact issue-focused summary clause from noisy support text.

### createEngine(config?)

Creates a reusable engine instance with shared config.

## CLI Preview

```bash
bun run preview --summary "I need help with my account login, I can't login for some reason" --customer "Acme Corp" --platform telegram
```

## Scripts

```bash
bun run build
bun run typecheck
bun run lint
bun run test
bun run preview
```

## License

GPL-3.0
