import { ISubscriptionPlanDetails } from "../modules/subscribe/subscribe.interface";

export const subscriptionPlans: ISubscriptionPlanDetails = {
  MONTHLY: {
    name: "Monthly Premium",
    duration: 30,
    price: 299,
    description: "Access to all premium content for 30 days"
  },
  YEARLY: {
    name: "Yearly Premium",
    duration: 365,
    price: 2499,
    description: "Access to all premium content for 1 year (save 30%)"
  }
};

// Calculate end date based on subscription plan
export const calculateEndDate = (plan: "MONTHLY" | "YEARLY"): Date => {
  const now = new Date();
  const durationDays = subscriptionPlans[plan].duration;
  return new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000);
}; 