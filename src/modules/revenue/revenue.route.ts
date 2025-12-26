import express from 'express';
import { RevenueController } from './revenue.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../../../generated/prisma';

const router = express.Router();

router.get(
  '/',
  // auth(UserRole.ADMIN),
  RevenueController.getRevenue
);

export const revenueRoute = router; 