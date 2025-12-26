import catchAsync from "../../utils/catchAsync";
import { RatingService } from "./rating.service";
import sendResponse from "../../utils/sendResponse";
import status from "http-status";

const createRatingIntoDB = catchAsync(async (req, res) => {
  const result = await RatingService.createRatingIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Rating created successfully",
    data: result,
  });
});

const getAllRating = catchAsync(async (req, res) => {
  const result = await RatingService.getAllRating();

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Rating get successfully",
    data: result,
  });
});
const getSingleRating = catchAsync(async (req, res) => {
  const { ratingId } = req.params;
  const result = await RatingService.getSingleRating(ratingId);

  sendResponse(res, {
    success: true,
    statusCode: status.OK,
    message: "Rating get id successfully",
    data: result,
  });
});

export const ratingController = {
  createRatingIntoDB,
  getAllRating,
  getSingleRating,
};
