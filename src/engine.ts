import { defaultConfig } from "./defaults.js";
import type { BuildTitleInput, SummaryEngine, SummaryEngineConfig } from "./types.js";

function normalizeText(input: string): string {
  return input
    .replace(/[`*_~>#\[\]{}()]/g, " ")
    .replace(/\r?\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateAtWordBoundary(input: string, maxLength: number): string {
  if (input.length <= maxLength) {
    return input;
  }

  const clip = input.slice(0, maxLength - 3);
  const lastSpace = clip.lastIndexOf(" ");
  const safe = lastSpace >= 24 ? clip.slice(0, lastSpace) : clip;
  return `${safe.trim()}...`;
}

function stripLeadingFiller(input: string, config: SummaryEngineConfig): string {
  let text = input.trim();
  for (const pattern of config.leadingFillerPatterns) {
    const next = text.replace(pattern, "").trim();
    if (next !== text && next.length > 0) {
      text = next;
    }
  }
  return text;
}

function stripTrailingFiller(input: string, config: SummaryEngineConfig): string {
  let text = input.trim();
  for (const pattern of config.trailingFillerPatterns) {
    text = text.replace(pattern, "").trim();
  }
  return text;
}

function cleanClause(input: string, config: SummaryEngineConfig): string {
  let text = input;

  for (const pattern of config.conjunctionStripPatterns) {
    text = text.replace(pattern, "");
  }

  return text
    .replace(/\bfor some reason\b/gi, "")
    .replace(/\b(please|pls)\s+help(\s+me)?\b/gi, "")
    .replace(/\bcan\s+you\s+help(\s+me)?\b/gi, "")
    .replace(/^\s*(i\s+am|i'm)\s+/i, "")
    .replace(/^\s*i\s+(cannot|can't|unable to)\s+/i, "$1 ")
    .replace(/\s+/g, " ")
    .replace(/^[,\-:\s]+|[,\-:\s]+$/g, "")
    .trim();
}

function compactSummary(input: string, config: SummaryEngineConfig): string {
  let text = input.trim();

  text = text
    .replace(/^\s*(a|an)\s+subset\s+of\s+users\s+/i, "")
    .replace(/^\s*(some|many|several)\s+users\s+/i, "")
    .replace(/^\s*users\s+/i, "");

  const causalSplit = text.split(config.causalSplitPattern);
  if (causalSplit[0]) {
    text = causalSplit[0].trim();
  }

  return text
    .replace(/\s+/g, " ")
    .replace(/[\s,:;-]+$/g, "")
    .trim();
}

function scoreClause(input: string, config: SummaryEngineConfig): number {
  const lowered = input.toLowerCase();
  let score = 0;

  for (const keyword of config.issueKeywords) {
    if (lowered.includes(keyword)) {
      score += 3;
    }
  }

  if (/\b(cannot|can't|unable|failed|error|timeout|locked)\b/.test(lowered)) {
    score += 3;
  }

  if (input.length >= 12 && input.length <= 90) {
    score += 2;
  }

  if (config.genericSummaryPhrases.includes(lowered)) {
    score -= 5;
  }

  if (config.rootCausePatterns.some((pattern) => pattern.test(input))) {
    score += 5;
  }

  if (config.impactOnlyPatterns.some((pattern) => pattern.test(input))) {
    score -= 4;
  }

  if (
    config.contextOnlyPatterns.some((pattern) => pattern.test(input)) &&
    !config.rootCausePatterns.some((pattern) => pattern.test(input))
  ) {
    score -= 3;
  }

  return score;
}

function extractSummaryInternal(summary: string, config: SummaryEngineConfig): string | null {
  const normalized = normalizeText(summary);
  if (!normalized) {
    return null;
  }

  const segments = normalized
    .split(/[.!?;:]+/)
    .map((segment) => stripLeadingFiller(segment, config))
    .map((segment) => stripTrailingFiller(segment, config))
    .map((segment) => segment.replace(/^[-\s]+/, "").trim())
    .filter(Boolean);

  const candidates: string[] = [];

  for (const segment of segments) {
    const clauses = segment
      .split(/[,|]+|\s+-\s+|\s+and\s+/i)
      .map((clause) => cleanClause(clause, config))
      .filter(Boolean);

    if (clauses.length > 0) {
      candidates.push(...clauses);
    } else {
      candidates.push(cleanClause(segment, config));
    }
  }

  const filtered = candidates.filter((candidate) => {
    const lowered = candidate.toLowerCase();
    return candidate.length >= 10 && !config.genericSummaryPhrases.includes(lowered);
  });

  if (filtered.length === 0) {
    return null;
  }

  const best = filtered
    .map((candidate) => ({
      candidate,
      score: scoreClause(candidate, config)
    }))
    .sort((a, b) => b.score - a.score)[0]?.candidate;

  if (!best) {
    return null;
  }

  const compacted = compactSummary(best, config);
  const selected = compacted.length >= 10 ? compacted : best;

  return selected.charAt(0).toUpperCase() + selected.slice(1);
}

function normalizeCustomer(customerName: string | undefined): string {
  if (!customerName) {
    return "";
  }
  return normalizeText(customerName).toLowerCase();
}

export function createEngine(overrides: Partial<SummaryEngineConfig> = {}): SummaryEngine {
  const config: SummaryEngineConfig = {
    ...defaultConfig,
    ...overrides
  };

  return {
    extractSummary(summary: string): string | null {
      return extractSummaryInternal(summary, config);
    },

    buildTitle(input: BuildTitleInput): string {
      const extracted = extractSummaryInternal(input.summary, config);

      if (extracted) {
        return truncateAtWordBoundary(`${config.prefix} ${extracted}`, config.maxTitleLength);
      }

      const normalizedCustomer = normalizeCustomer(input.customerName);
      const isUnknown = config.unknownCustomerValues.includes(normalizedCustomer);

      if (normalizedCustomer && !isUnknown) {
        return truncateAtWordBoundary(
          `${config.prefix} ${normalizeText(input.customerName ?? "")} - ${config.fallbackSuffix}`,
          config.maxTitleLength
        );
      }

      return `${config.prefix} ${config.fallbackNewTicket}`;
    }
  };
}

export function extractSummary(summary: string, config?: Partial<SummaryEngineConfig>): string | null {
  return createEngine(config).extractSummary(summary);
}

export function buildTitle(
  input: BuildTitleInput,
  config?: Partial<SummaryEngineConfig>
): string {
  return createEngine(config).buildTitle(input);
}
