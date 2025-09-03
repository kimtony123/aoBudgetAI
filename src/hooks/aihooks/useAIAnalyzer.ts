// aiComponents/useAIAnalyzer.ts
import { useState, useCallback } from "react";
import { message, dryrun, createDataItemSigner } from "@permaweb/aoconnect";
import {
  createAnalysisPrompt,
  enrichTransactions,
} from "../../utils/promptUtils";

const YOUR_AO_PROCESS_ID = "CAqAjfPkvBJqtog9OrxUaS3iIVEcGzNkVlDwDM-e-dA";

export const useAIAnalyzer = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [taskRef, setTaskRef] = useState("");

  const formatAIResponse = useCallback((aiData: any) => {
    // Map compressed keys back to full structure
    return {
      summary: {
        totalIncome: aiData.s?.ti || 0,
        totalExpenses: aiData.s?.te || 0,
        netCashFlow: aiData.s?.nc || 0,
        topSpendingCategories: (aiData.s?.tsc || []).map((cat: any) => ({
          category: cat.c,
          amount: cat.a,
          percentage: cat.p,
        })),
        savingsRate: aiData.s?.sr || 0,
      },
      insights: aiData.i || ["No insights generated"],
      recommendations: aiData.r || [
        "Connect real data for specific recommendations",
      ],
      trends: aiData.t || ["Analysis based on sample data"],
      riskAssessment: {
        level: aiData.ra?.l || "unknown",
        concerns: aiData.ra?.c || ["Insufficient data"],
        positiveSigns: aiData.ra?.p || ["Insufficient data"],
      },
    };
  }, []);

  const sendToAIAgent = useCallback(
    async (transactions: any[], days: string, userContext: any) => {
      if (transactions.length === 0) throw new Error("No transactions");

      const ref = Date.now().toString();
      setTaskRef(ref);

      // Get MINIMAL transaction data (15 items max)
      const enriched = enrichTransactions(transactions);
      const prompt = createAnalysisPrompt(
        enriched,
        `last${days}days`,
        userContext
      );

      try {
        await message({
          process: YOUR_AO_PROCESS_ID,
          tags: [
            { name: "Action", value: "SendRequest" },
            { name: "X-Prompt", value: prompt }, // Now safely under 4096 bytes
            { name: "Ref", value: ref },
          ],
          signer: createDataItemSigner(window.arweaveWallet),
        });

        console.log(ref);
        return ref;
      } catch (error) {
        throw new Error("AI agent request failed");
      }
    },
    []
  );

  const fetchAIResult = useCallback(
    async (reference: string) => {
      try {
        const result = await dryrun({
          process: YOUR_AO_PROCESS_ID,
          tags: [
            { name: "Action", value: "GetResult" },
            { name: "Taskref", value: reference },
          ],
        });
        console.log(result.Messages?.[0]?.Data);
        if (result.Messages?.[0]?.Data) {
          try {
            return formatAIResponse(JSON.parse(result.Messages[0].Data));
          } catch {
            return formatAIResponse({
              s: {},
              i: ["Error parsing AI response"],
              r: [],
              t: [],
              ra: {},
            });
          }
        }
        throw new Error("No AI result");
      } catch (error) {
        throw new Error("Failed to fetch results");
      }
    },
    [formatAIResponse]
  );

  const analyzeTransactions = useCallback(
    async (transactions: any[], days: string, userContext: any) => {
      setIsAnalyzing(true);
      try {
        const ref = await sendToAIAgent(transactions, days, userContext);

        return new Promise((resolve, reject) => {
          setTimeout(async () => {
            try {
              const result = await fetchAIResult(ref);
              resolve(result);
            } catch (err) {
              reject(err);
            }
          }, 25000);
        });
      } catch (err) {
        throw err;
      } finally {
        setIsAnalyzing(false);
      }
    },
    [sendToAIAgent, fetchAIResult]
  );

  return {
    analyzeTransactions,
    isAnalyzing,
    taskRef,
  };
};
