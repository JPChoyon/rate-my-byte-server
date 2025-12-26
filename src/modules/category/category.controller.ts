import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { categoryServices } from "./category.service";
import pick from "../../utils/pick";

const createCategory = catchAsync(async (req, res) => {
  const result = await categoryServices.createCategoty(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Category created successfully",
    data: result,
  });
});
const getAllCategory = catchAsync(async (req, res) => {
  const paginateQuery = pick(req.query, ["page", "limit"]);
  const result = await categoryServices.getAllCategory(paginateQuery);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Category retrived successfully",
    data: result?.data,
    meta: result?.meta,
  });
});

export const categoryControllers = {
  createCategory,
  getAllCategory,
};
