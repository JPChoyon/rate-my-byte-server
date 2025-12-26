import { 
  ISubscriptionPlan, 
  ISubscriptionPaymentInitiate,
  ISubscriptionPlanDetails 
} from "./subscribe.interface";
import httpStatus from "http-status";
import { subscribeUtils } from "./subscribe.utils";
import { subscriptionPlans, calculateEndDate } from "../../utils/subscriptionPlans";
import AppError from "../../errors/AppError";
import prisma from "../../utils/prismaProvider";

// Track cancelled users by ID
const cancelledUsers = new Set<string>();

// Cancel premium subscription
const cancelSubscription = async (userId: string): Promise<{ success: boolean }> => {
  try {
    // Add user to cancelled set
    cancelledUsers.add(userId);
    console.log(`Added user ${userId} to cancelled users`);
    
    // Update user status to non-premium
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: false,
        role: "USER",
        premiumUntil: null
      }
    });
    
    return { success: true };
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return { success: false };
  }
};

// Get subscription plans
const getSubscriptionPlans = (): ISubscriptionPlanDetails => {
  return subscriptionPlans;
};

// Check if user is subscribed
const checkUserSubscription = async (userId: string): Promise<{
  isSubscribed: boolean;
  premiumUntil: Date | null;
  role: string;
  hasCancelled: boolean;
}> => {
  if (!userId) {
    throw new AppError(httpStatus.UNAUTHORIZED, "User ID is required");
  }

  // Check user's premium status directly
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { isPremium: true, premiumUntil: true, role: true }
  });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  
  // Check if user has cancelled before
  const hasCancelled = cancelledUsers.has(userId);

  return {
    isSubscribed: user.isPremium || false,
    premiumUntil: user.premiumUntil,
    role: user.role,
    hasCancelled
  };
};

// Initiate subscription payment
const initiateSubscriptionPayment = async (payload: ISubscriptionPaymentInitiate): Promise<{ checkout_url: string, transactionId: string }> => {
  const { userId, plan, customerName, customerEmail, amount, customerPhone, customerAddress, customerCity } = payload;
  
  // Create a transaction ID to track this payment
  const transactionId = `SUB_${Date.now()}_${userId.substring(0, 8)}`;
  
  // If a user is initiating a new payment, remove them from cancelled users list
  // This allows them to make a new payment and verify it
  if (cancelledUsers.has(userId)) {
    console.log(`User ${userId} is making a new payment after cancellation - clearing cancelled status`);
    cancelledUsers.delete(userId);
  }

  console.log({payload})
  
  // Prepare payment payload for Shurjopay
  const shurjopayPayload = {
    amount: amount,
    order_id: transactionId,
    currency: "BDT",
    customer_name: customerName,
    customer_email: customerEmail,
    client_ip: "127.0.0.1",
    customer_phone: customerPhone, 
    customer_city: customerCity,
    customer_address: customerAddress 
  };

  // Make payment request to Shurjopay
  const paymentResponse = await subscribeUtils.makePaymentAsync(shurjopayPayload);
  
  if (!paymentResponse || !paymentResponse.checkout_url) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to initiate payment");
  }

  console.log("paymentResponse", paymentResponse);

  return {
    checkout_url: paymentResponse.checkout_url,
    transactionId: paymentResponse.sp_order_id
  };
};

// Verify subscription payment and update user to premium if successful
const verifySubscriptionPayment = async (orderId: string, userId: string): Promise<any> => {
  // Verify payment with Shurjopay
  const verificationResponse = await subscribeUtils.verifyPaymentAsync(orderId);
  
  if (verificationResponse?.length && verificationResponse[0].bank_status === 'Success') {
    const paymentInfo = verificationResponse[0];
    
    // Get transaction ID
    const transactionId = (paymentInfo as any).order_id || orderId;
    console.log("transactionId", transactionId);
    
    // Check if user has cancelled their subscription before
    if (cancelledUsers.has(userId)) {
      console.log(`User ${userId} previously cancelled - must make a new payment`);
      return {
        ...verificationResponse,
        status: 'CANCELLED',
        message: 'User has previously cancelled subscription - new payment required'
      };
    }
    

    let plan: ISubscriptionPlan;

    console.log("paymentInfo.amount", {paymentInfo});
    
    if (paymentInfo.amount >= 2000) {
      plan = "YEARLY";
    } else {
      plan = "MONTHLY";
    }
    
    const endDate = calculateEndDate(plan);
    console.log("endDate", endDate);
    
    // Update user to premium status
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        role: "PREMIUM",
        premiumUntil: endDate
      }
    });
    
    // Record transaction in database
    await prisma.transaction.create({
      data: {
        userId,
        amount: paymentInfo.amount,
        transactionId,
        paymentMethod: 'ShurjoPay',
        plan,
        status: 'SUCCESS'
      }
    });
    
    // If they had cancelled before, they've now successfully renewed
    if (cancelledUsers.has(userId)) {
      cancelledUsers.delete(userId);
    }
  }
  
  return verificationResponse;
};

export const SubscriptionService = {
  cancelSubscription,
  getSubscriptionPlans,
  initiateSubscriptionPayment,
  verifySubscriptionPayment,
  checkUserSubscription
};
