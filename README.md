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

Use the CLI to preview title generation with different inputs and platform presets.

### Flags

| Flag | Description | Default |
| --- | --- | --- |
| `--summary` | The support message text | _(interactive prompt)_ |
| `--customer` | Customer or company name | `Unknown Company` |
| `--platform` | Platform preset (`telegram`, `whatsapp`, `discord`) | `telegram` |

When `--summary` is omitted the CLI starts an interactive prompt.

### Examples

**Telegram — login issue**

```bash
bun run preview --summary "I need help with my account login, I can't login for some reason" --customer "Acme Corp" --platform telegram
# Title preview:
# [Telegram] Can't login
```

**WhatsApp — password reset**

```bash
bun run preview --summary "A subset of users cannot complete password reset because reset links intermittently return token expired." --customer "Acme Corp" --platform whatsapp
# Title preview:
# [WhatsApp] Cannot complete password reset
```

**Discord — OTP delivery failure**

```bash
bun run preview --summary "we enabled 2FA for security, but OTP emails are not arriving for two users in our workspace, and both are now locked out of the platform." --customer "TechStart Inc" --platform discord
# Title preview:
# [Discord] OTP emails are not arriving for two users in our workspace
```

**Telegram — noisy message with buried issue**

```bash
bun run preview --summary "Hey there! Hope you're doing well. I just wanted to reach out because our team is unable to upload files larger than 10MB. The upload just times out after a few minutes." --customer "MediaGroup" --platform telegram
# Title preview:
# [Telegram] Unable to upload files larger than 10MB
```

**Discord — verbose bug report**

```bash
bun run preview --summary "I'm experiencing a critical bug where the app crashes whenever I open the settings page on mobile" --customer "MobileFirst" --platform discord
# Title preview:
# [Discord] The app crashes whenever I open the settings page on mobile
```

**WhatsApp — generic help (fallback)**

```bash
bun run preview --summary "help" --customer "Acme Corp" --platform whatsapp
# Title preview:
# [WhatsApp] Acme Corp - Support Request
```

**Telegram — unknown customer (fallback)**

```bash
bun run preview --summary "help" --customer "Unknown" --platform telegram
# Title preview:
# [Telegram] New Support Ticket
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
