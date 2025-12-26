import { Request, Response } from "express";
import httpStatus from "http-status";
// import catchAsync from "../../../src/utils/catchAsync";
// import sendResponse from "../../../src/utils/sendResponse";
import { SubscriptionService } from "./subscribe.service";
import { ISubscriptionPlan } from "./subscribe.interface";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

// Cancel subscription
const cancelUserSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "User not authenticated",
        data: null,
      });
      return;
    }

    const result = await SubscriptionService.cancelSubscription(userId);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: result.success,
      message: "Subscription cancelled successfully",
      data: null,
    });
  }
);

// Get available subscription plans
const getSubscriptionPlans = catchAsync(async (req: Request, res: Response) => {
  const plans = SubscriptionService.getSubscriptionPlans();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Subscription plans retrieved successfully",
    data: plans,
  });
});

// Initiate subscription payment
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const { plan } = req.body as { plan: ISubscriptionPlan };

  if (!userId) {
    sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
    return;
  }

  // Get plan details to determine amount
  const plans = SubscriptionService.getSubscriptionPlans();
  const planDetails = plans[plan];

  if (!planDetails) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Invalid subscription plan",
      data: null,
    });
    return;
  }

  console.log("req.user", req.user);
  console.log("req.body", req.body);
  console.log({ planDetails });

  const result = await SubscriptionService.initiateSubscriptionPayment({
    userId,
    plan,
    customerName: req.body?.customerName || "Customer",
    customerPhone: req.body?.customerPhone,
    customerEmail: req.user?.email || "",
    customerAddress: req.body?.customerAddress,
    customerCity: req.body?.customerCity,
    amount: planDetails.price,
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Payment initiated successfully",
    data: {
      checkout_url: result.checkout_url,
      transactionId: result.transactionId,
    },
  });
});

// Verify payment and create subscription
const verifyPayment = catchAsync(async (req: Request, res: Response) => {
  const { order_id } = req.query;
  const userId = req.user?.id;

  console.log("userId from verify payment controller", userId);

  if (!userId) {
    sendResponse(res, {
      statusCode: httpStatus.UNAUTHORIZED,
      success: false,
      message: "User not authenticated",
      data: null,
    });
    return;
  }

  if (!order_id || typeof order_id !== "string") {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "Order ID is required",
      data: null,
    });
    return;
  }

  const result = await SubscriptionService.verifySubscriptionPayment(
    order_id,
    userId
  );

  // Check if a user has previously cancelled - special handling
  if (result && result.status === "CANCELLED") {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message:
        result.message || "User previously cancelled - new payment required",
      data: {
        status: "CANCELLED",
        requiresNewPayment: true,
      },
    });
    return;
  }

  if (result && result.length > 0) {
    const isSuccess = result[0].bank_status === "Success";

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: isSuccess,
      message: isSuccess
        ? "Payment successful"
        : `Payment ${result[0].bank_status.toLowerCase()}`,
      data: {
        status: result[0].bank_status,
        transaction_id: order_id,
      },
    });
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: false,
      message: "Payment verification failed",
      data: null,
    });
  }
});

// Check if user is subscribed
const checkUserSubscription = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      sendResponse(res, {
        statusCode: httpStatus.UNAUTHORIZED,
        success: false,
        message: "User not authenticated",
        data: {
          isSubscribed: false,
          hasCancelled: false,
        },
      });
      return;
    }

    try {
      // Get subscription status from service
      const subscriptionStatus =
        await SubscriptionService.checkUserSubscription(userId);

      sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: subscriptionStatus.isSubscribed
          ? "User has an active subscription"
          : subscriptionStatus.hasCancelled
          ? "User has cancelled subscription"
          : "User has no active subscription",
        data: subscriptionStatus,
      });
    } catch (error: any) {
      sendResponse(res, {
        statusCode: error.statusCode || httpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: error.message || "Failed to check subscription status",
        data: {
          isSubscribed: false,
          hasCancelled: false,
        },
      });
    }
  }
);

export const SubscriptionController = {
  cancelUserSubscription,
  getSubscriptionPlans,
  initiatePayment,
  verifyPayment,
  checkUserSubscription,
};
