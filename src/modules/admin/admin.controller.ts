import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { adminServices } from "./admin.service";

const getAdminCredentials = catchAsync(async (req, res) => {
  console.log({ req: req.body });
  const result = await adminServices.getAdminCredentials();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin credentials retrived successfully",
    data: result,
  });
});
const makeAdmin = catchAsync(async (req, res) => {
  const result = await adminServices.makeAdmin(req.body);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const adminControllers = {
  getAdminCredentials,
  makeAdmin,
};
