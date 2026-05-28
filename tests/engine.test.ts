import { describe, expect, test } from "bun:test";
import { buildTitle, extractSummary } from "../src/engine.js";
import { telegramPreset, whatsappPreset } from "../src/presets.js";

describe("summary extraction", () => {
  test("prioritizes root cause over impact", () => {
    const summary =
      "we enabled 2FA for security, but OTP emails are not arriving for two users in our workspace, and both are now locked out of the platform.";

    expect(extractSummary(summary, telegramPreset)).toBe(
      "OTP emails are not arriving for two users in our workspace",
    );
  });

  test("compacts causal tail", () => {
    const summary =
      "A subset of users cannot complete password reset because reset links intermittently return token expired within 1-2 minutes.";

    expect(extractSummary(summary, telegramPreset)).toBe("Cannot complete password reset");
  });
});

describe("title building", () => {
  test("uses extracted summary when available", () => {
    const title = buildTitle(
      {
        summary:
          "I need help with my account login, I can't login for some reason, please help me.",
        customerName: "Acme Corp",
      },
      telegramPreset,
    );

    expect(title).toBe("[Telegram] Can't login");
  });

  test("falls back to customer support request", () => {
    const title = buildTitle(
      {
        summary: "help",
        customerName: "Acme Corp",
      },
      whatsappPreset,
    );

    expect(title).toBe("[WhatsApp] Acme Corp - Support Request");
  });

  test("falls back to new support ticket", () => {
    const title = buildTitle(
      {
        summary: "help",
        customerName: "Unknown Company",
      },
      telegramPreset,
    );

    expect(title).toBe("[Telegram] New Support Ticket");
  });
});
