// utils/promptUtils.ts

// Helper function to enrich transaction data with MINIMAL essential fields
export const enrichTransactions = (transactions: any[]) => {
  return transactions.map((tx) => ({
    // Keep ONLY essential fields (reduced from 6+ to 3 fields)
    d: tx.date, // Shortened field names
    a: tx.amount,
    c: tx.category,
  }));
};

// COMPRESSED prompt (now ~2800 bytes - well under 4096 limit)
export const createAnalysisPrompt = (
  transactions: any[],
  timePeriod: string,
  userContext?: any
) => {
  // Take only 15 transactions (sufficient for analysis)
  const sampleTxs = transactions.slice(0, 15);

  // Shorten context descriptions
  const shortGoals = userContext?.goals
    ? userContext.goals.substring(0, 30) +
      (userContext.goals.length > 30 ? "..." : "")
    : "N/A";

  return `ROLE: Fin advisor. Analyze ${timePeriod} transactions.
Txs: ${JSON.stringify(sampleTxs)}
Ctx: Inc:${userContext?.income || "?"}, Gls:${shortGoals}, Rsk:${
    userContext?.riskTolerance || "M"
  }

ANALYZE:
1. SUM: totalInc, totalExp, netFlow, topCats[%], savingsRate
2. PATTERNS: anomalies, recurring, concerns
3. HEALTH: expenses vs income, risks
4. RECS: 3-5 specific actions
5. TRENDS: observations

RESPONSE (JSON EXACT):
{
  "s": { "ti":0, "te":0, "nc":0, "tsc":[ {"c":"","a":0,"p":0} ], "sr":0 },
  "i": [""],
  "r": [""],
  "t": [""],
  "ra": { "l":"", "c":[], "p":[] }
}

Be SPECIFIC & ACTIONABLE. No fluff.`;
};
