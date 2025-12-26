import { Request, Response } from "express";
import { RevenueService } from "./revenue.service";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const getRevenue = catchAsync(async (req: Request, res: Response) => {
  const filters = req.query;
  const result = await RevenueService.getRevenue(filters);
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Revenue data retrieved successfully",
    data: result
  });
});

export const RevenueController = {
  getRevenue
}; 