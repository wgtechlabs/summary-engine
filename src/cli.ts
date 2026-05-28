#!/usr/bin/env node

import { stdin as input, stdout as output } from "node:process";
import { createInterface } from "node:readline/promises";
import { buildTitle, extractSummary } from "./engine.js";
import { discordPreset, telegramPreset, whatsappPreset } from "./presets.js";
import type { SummaryEngineConfig } from "./types.js";

function getArgValue(flag: string): string | undefined {
  const args = process.argv.slice(2);
  const index = args.findIndex((arg) => arg === flag);
  if (index < 0) {
    return undefined;
  }

  const value = args[index + 1];
  if (!value || value.startsWith("--")) {
    return undefined;
  }

  return value;
}

function resolvePreset(platform?: string): Partial<SummaryEngineConfig> {
  const normalized = (platform ?? "telegram").toLowerCase();

  if (normalized === "whatsapp") {
    return whatsappPreset;
  }

  if (normalized === "discord") {
    return discordPreset;
  }

  return telegramPreset;
}

async function main(): Promise<void> {
  const summaryArg = getArgValue("--summary");
  const customerArg = getArgValue("--customer") ?? "Unknown Company";
  const platformArg = getArgValue("--platform") ?? "telegram";
  const preset = resolvePreset(platformArg);

  if (summaryArg) {
    const title = buildTitle({ summary: summaryArg, customerName: customerArg }, preset);
    const extracted = extractSummary(summaryArg, preset);

    console.log("Title preview:");
    console.log(title);
    console.log("Extractor details:");
    console.log(`summary_used=${extracted ?? "<none>"}`);
    console.log(`customer_used=${customerArg}`);
    console.log(`platform_used=${platformArg}`);
    return;
  }

  const rl = createInterface({ input, output });
  const summary = await rl.question("Issue details: ");
  const customer = (await rl.question("Customer name (optional): ")).trim() || customerArg;
  const platform =
    (await rl.question("Platform (telegram|whatsapp|discord): ")).trim() || platformArg;
  rl.close();

  const interactivePreset = resolvePreset(platform);
  const title = buildTitle({ summary, customerName: customer }, interactivePreset);
  const extracted = extractSummary(summary, interactivePreset);

  console.log("\nTitle preview:");
  console.log(title);
  console.log("\nExtractor details:");
  console.log(`summary_used=${extracted ?? "<none>"}`);
  console.log(`customer_used=${customer}`);
  console.log(`platform_used=${platform}`);
}

await main();
