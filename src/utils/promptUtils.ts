export const createAnalysisPrompt = (
  transactions: any[],
  timePeriod: string,
  userContext?: any
) => {
  return `ROLE: You are a expert financial advisor specializing in personal budgeting and financial health analysis. Analyze the following transaction data and provide comprehensive insights.

TRANSACTION DATA:
${JSON.stringify(transactions, null, 2)}

TIME PERIOD: ${timePeriod}

${
  userContext
    ? `USER CONTEXT:
- Income: ${userContext.income || "Unknown"}
- Financial Goals: ${userContext.goals || "Not specified"}
- Risk Tolerance: ${userContext.riskTolerance || "Medium"}\n\n`
    : ""
}

ANALYSIS FRAMEWORK:
1. FINANCIAL SUMMARY:
   - Calculate total income, total expenses, and net cash flow
   - Identify top 3 spending categories with percentages
   - Calculate savings rate (if possible)

2. SPENDING PATTERNS:
   - Identify unusual spending patterns or anomalies
   - Note recurring subscriptions or regular payments
   - Highlight any concerning spending habits

3. FINANCIAL HEALTH ASSESSMENT:
   - Evaluate if expenses are within recommended guidelines (e.g., housing <30% of income)
   - Assess emergency fund adequacy
   - Identify potential financial risks

4. PERSONALIZED RECOMMENDATIONS:
   - Provide 3-5 actionable recommendations specific to this financial situation
   - Suggest concrete ways to reduce expenses or increase savings
   - Recommend budgeting strategies that would work for this spending pattern

5. TRENDS AND FORECASTING:
   - Identify any positive or negative trends
   - Project future financial position if current patterns continue
   - Note seasonal patterns or one-time events that affected finances

RESPONSE FORMAT REQUIREMENTS:
Return a JSON object with exactly this structure:
{
  "summary": {
    "totalIncome": number,
    "totalExpenses": number,
    "netCashFlow": number,
    "topSpendingCategories": [
      {"category": string, "amount": number, "percentage": number},
      ...
    ],
    "savingsRate": number
  },
  "insights": [
    "string (clear, actionable insight 1)",
    "string (clear, actionable insight 2)",
    ...
  ],
  "recommendations": [
    "string (specific, actionable recommendation 1)",
    "string (specific, actionable recommendation 2)",
    ...
  ],
  "trends": [
    "string (notable trend observation 1)",
    "string (notable trend observation 2)",
    ...
  ],
  "riskAssessment": {
    "level": "low/medium/high",
    "concerns": ["string", "string"],
    "positiveSigns": ["string", "string"]
  }
}

IMPORTANT: Be specific, actionable, and empathetic in your analysis. Focus on practical advice that can be implemented immediately.`;
};

// Helper function to enrich transaction data
export const enrichTransactions = (transactions: any[]) => {
  return transactions.map((tx) => ({
    ...tx,
    // Add day of week for spending pattern analysis
    dayOfWeek: new Date(tx.date).toLocaleDateString("en-US", {
      weekday: "long",
    }),
    // Add category groups (essential vs discretionary)
    categoryType: [
      "Rent",
      "Utilities",
      "Groceries",
      "Healthcare",
      "Insurance",
    ].includes(tx.category)
      ? "Essential"
      : "Discretionary",
    // Add month for trend analysis
    month: new Date(tx.date).toLocaleDateString("en-US", { month: "long" }),
  }));
};
