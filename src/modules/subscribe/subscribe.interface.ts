export type ISubscriptionPlan = "MONTHLY" | "YEARLY";
export type ISubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELLED";

export interface ISubscription {
  id: string;
  userId: string;
  plan: ISubscriptionPlan;
  status: ISubscriptionStatus;
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  transactionId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscription {
  plan: ISubscriptionPlan;
  userId: string;
}

export interface ISubscriptionWithUserData extends ISubscription {
  user: {
    id: string;
    email: string;
    fullName?: string;
    role: string;
  };
}

export interface ISubscriptionPaymentInitiate {
  userId: string;
  plan: ISubscriptionPlan;
  customerName: string;
  customerEmail: string;
  amount: number;
  customerPhone: string;
  customerAddress: string;
  customerCity: string;
}

export interface ISubscriptionPlanDetails {
  MONTHLY: {
    name: string;
    duration: number;
    price: number;
    description: string;
  };
  YEARLY: {
    name: string;
    duration: number;
    price: number;
    description: string;
  };
} 