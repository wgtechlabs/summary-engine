export type BuildTitleInput = {
  summary: string;
  customerName?: string;
};

export type SummaryEngineConfig = {
  prefix: string;
  maxTitleLength: number;
  fallbackSuffix: string;
  fallbackNewTicket: string;
  unknownCustomerValues: string[];
  genericSummaryPhrases: string[];
  issueKeywords: string[];
  rootCausePatterns: RegExp[];
  impactOnlyPatterns: RegExp[];
  contextOnlyPatterns: RegExp[];
  leadingFillerPatterns: RegExp[];
  trailingFillerPatterns: RegExp[];
  conjunctionStripPatterns: RegExp[];
  causalSplitPattern: RegExp;
};

export type SummaryEngine = {
  extractSummary: (summary: string) => string | null;
  buildTitle: (input: BuildTitleInput) => string;
};
