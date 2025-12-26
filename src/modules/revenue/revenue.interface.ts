export interface IRevenueFilters {
  startDate?: string;
  endDate?: string;
  paymentMethod?: string;
  plan?: string;
}

export interface IRevenueResponse {
  totalRevenue: number;
  transactionCount: number;
  averageTransactionValue: number;
  revenueByPlan: {
    plan: string;
    amount: number;
    count: number;
  }[];
  revenueByPaymentMethod: {
    paymentMethod: string;
    amount: number;
    count: number;
  }[];
  revenueByPeriod: {
    period: string;
    amount: number;
  }[];
} 