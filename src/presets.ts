import { defaultConfig, withPrefix } from "./defaults.js";
import type { SummaryEngineConfig } from "./types.js";

export const telegramPreset: SummaryEngineConfig = withPrefix(defaultConfig, "[Telegram]");
export const whatsappPreset: SummaryEngineConfig = withPrefix(defaultConfig, "[WhatsApp]");
export const discordPreset: SummaryEngineConfig = withPrefix(defaultConfig, "[Discord]");
