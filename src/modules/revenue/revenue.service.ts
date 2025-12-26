import { IRevenueFilters, IRevenueResponse } from "./revenue.interface";
import prisma from "../../utils/prismaProvider";
import { Transaction } from "../../../generated/prisma";

// Get total revenue with filtering options
const getRevenue = async (filters: IRevenueFilters): Promise<IRevenueResponse> => {
  const { startDate, endDate, paymentMethod, plan } = filters;
  
  // Build filter conditions
  const whereClause: any = {
    status: 'SUCCESS'
  };
  
  if (startDate) {
    whereClause.createdAt = {
      ...whereClause.createdAt,
      gte: new Date(startDate)
    };
  }
  
  if (endDate) {
    whereClause.createdAt = {
      ...whereClause.createdAt,
      lte: new Date(endDate)
    };
  }
  
  if (paymentMethod) {
    whereClause.paymentMethod = paymentMethod;
  }
  
  if (plan) {
    whereClause.plan = plan;
  }
  
  // Get all transactions matching the filter
  const transactions = await prisma.transaction.findMany({
    where: whereClause,
    orderBy: {
      createdAt: 'asc'
    }
  });
  
  // Calculate total revenue
  const totalRevenue = transactions.reduce((sum: number, transaction: Transaction) => sum + transaction.amount, 0);
  
  // Group by plan
  const planGroups: { [key: string]: { amount: number; count: number } } = {};
  
  // Group by payment method
  const paymentMethodGroups: { [key: string]: { amount: number; count: number } } = {};
  
  // Group by month
  const periodGroups: { [key: string]: number } = {};
  
  // Process transactions for grouping
  transactions.forEach((transaction: Transaction) => {
    // Plan groups
    if (!planGroups[transaction.plan]) {
      planGroups[transaction.plan] = { amount: 0, count: 0 };
    }
    planGroups[transaction.plan].amount += transaction.amount;
    planGroups[transaction.plan].count += 1;
    
    // Payment method groups
    if (!paymentMethodGroups[transaction.paymentMethod]) {
      paymentMethodGroups[transaction.paymentMethod] = { amount: 0, count: 0 };
    }
    paymentMethodGroups[transaction.paymentMethod].amount += transaction.amount;
    paymentMethodGroups[transaction.paymentMethod].count += 1;
    
    // Period (month) groups
    const periodKey = transaction.createdAt.toISOString().substring(0, 7); // YYYY-MM format
    if (!periodGroups[periodKey]) {
      periodGroups[periodKey] = 0;
    }
    periodGroups[periodKey] += transaction.amount;
  });
  
  // Convert grouped data to arrays
  const revenueByPlan = Object.entries(planGroups).map(([plan, data]) => ({
    plan,
    amount: data.amount,
    count: data.count
  }));
  
  const revenueByPaymentMethod = Object.entries(paymentMethodGroups).map(([paymentMethod, data]) => ({
    paymentMethod,
    amount: data.amount,
    count: data.count
  }));
  
  const revenueByPeriod = Object.entries(periodGroups).map(([period, amount]) => ({
    period,
    amount
  })).sort((a, b) => a.period.localeCompare(b.period));
  
  return {
    totalRevenue,
    transactionCount: transactions.length,
    averageTransactionValue: transactions.length > 0 ? totalRevenue / transactions.length : 0,
    revenueByPlan,
    revenueByPaymentMethod,
    revenueByPeriod
  };
};

export const RevenueService = {
  getRevenue
}; 