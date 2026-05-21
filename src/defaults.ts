import type { SummaryEngineConfig } from "./types.js";

export const defaultConfig: SummaryEngineConfig = {
  prefix: "[Support]",
  maxTitleLength: 100,
  fallbackSuffix: "Support Request",
  fallbackNewTicket: "New Support Ticket",
  unknownCustomerValues: ["unknown", "unknown customer", "unknown company", "n/a"],
  genericSummaryPhrases: [
    "help",
    "support",
    "issue",
    "problem",
    "urgent",
    "ticket",
    "need help",
    "need support",
    "please help",
    "can you help",
    "assistance"
  ],
  issueKeywords: [
    "login",
    "log in",
    "sign in",
    "signin",
    "password",
    "otp",
    "2fa",
    "authentication",
    "auth",
    "payment",
    "billing",
    "invoice",
    "checkout",
    "error",
    "failed",
    "failure",
    "cannot",
    "can't",
    "unable",
    "timeout",
    "locked",
    "access",
    "account"
  ],
  rootCausePatterns: [
    /\bnot\s+arriv(ing|ed)?\b/i,
    /\bnot\s+receiv(ing|ed)?\b/i,
    /\bdoes\s+not\b/i,
    /\bdon't\b/i,
    /\bcan't\b/i,
    /\bcannot\b/i,
    /\bunable\b/i,
    /\bfailed\b/i,
    /\berror\b/i,
    /\btimeout\b/i,
    /\binvalid\b/i
  ],
  impactOnlyPatterns: [
    /\blocked\s+out\b/i,
    /\bblocked\b/i,
    /\bcannot\s+access\b/i,
    /\bunable\s+to\s+access\b/i,
    /\bfor\s+urgent\s+tasks\b/i,
    /\bbusiness\s+impact\b/i
  ],
  contextOnlyPatterns: [/^we\s+enabled\b/i, /^we\s+updated\b/i, /^for\s+security\b/i, /^after\s+/i],
  leadingFillerPatterns: [
    /^(hi|hello|hey)(\s+(team|support|there))?[\s,.:!\-]*/i,
    /^(please|pls)\s+/i,
    /^(i have an issue with|i have an issue|i have problem with|i have a problem with)\s+/i,
    /^(i need help with|i need help|need help with|need help)\s+/i,
    /^(issue[:\-]\s*)/i,
    /^(problem[:\-]\s*)/i
  ],
  trailingFillerPatterns: [
    /[\s,.-]*(please|pls)\s+help(\s+me)?[\s,.-]*$/i,
    /[\s,.-]*(can\s+you\s+help(\s+me)?)[\s,.-]*$/i,
    /[\s,.-]*(need\s+help|support\s+please)[\s,.-]*$/i
  ],
  conjunctionStripPatterns: [/^\s*(but|and|also)\s+/i],
  causalSplitPattern: /\b(because|since|as|while|even though|although|so that)\b/i
};

export function withPrefix(config: SummaryEngineConfig, prefix: string): SummaryEngineConfig {
  return {
    ...config,
    prefix
  };
}
