import type { InvestmentPlan } from "../type";

// Handles both string IDs and populated plan objects
export const getInvestmentPlan = (
  investment: { plan?: string | InvestmentPlan },
  plans: InvestmentPlan[]
): InvestmentPlan | null => {
  if (!investment.plan) return null;

  // If plan is already an object with _id, return it
  if (typeof investment.plan !== "string" && investment.plan._id) {
    return investment.plan as InvestmentPlan;
  }

  // If plan is a string ID, find it in the plans array
  const planId = typeof investment.plan === "string" ? investment.plan : investment.plan._id;
  const matchedPlan = plans.find((p) => String(p._id) === String(planId));

  return matchedPlan || null;
};
