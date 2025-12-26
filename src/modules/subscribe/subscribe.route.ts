import express from 'express';
import { SubscriptionController } from './subscribe.controller';
import auth from '../../middlewares/auth';
import { UserRole } from "../../../generated/prisma";

const router = express.Router();

// Check user subscription status
router.get(
  '/',
  auth(UserRole.USER, UserRole.PREMIUM),
  SubscriptionController.checkUserSubscription
);

// Get available subscription plans
router.get(
  '/plans',
  SubscriptionController.getSubscriptionPlans
);

// Initiate subscription payment
router.post(
  '/payment/initiate',
  auth(UserRole.USER, UserRole.PREMIUM),
  SubscriptionController.initiatePayment
);

// Verify subscription payment
router.get(
  '/payment/verify',
  auth(UserRole.USER, UserRole.PREMIUM),
  SubscriptionController.verifyPayment
);

// Cancel subscription
router.patch(
  '/cancel',
  auth(UserRole.USER, UserRole.PREMIUM),
  SubscriptionController.cancelUserSubscription
);

export const subscribeRoute = router;
