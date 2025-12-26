import status from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { voteServices } from "./vote.service";

// --------create vote----------
const createVote = catchAsync(async (req, res) => {
  const result = await voteServices.createVote(req.body);
  sendResponse(res, {
    statusCode: status.CREATED,
    success: true,
    message: "Vote created successfully",
    data: result,
  });
});
// ----------get all vote
const getAllVote = catchAsync(async (req, res) => {
  const result = await voteServices.getAllVote();
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "vote retrived successfully",
    data: result,
  });
});
// -------get single vote-----------

const getSingleVote=catchAsync(async(req,res)=>{
  const {id}=req.params;
  const result=await voteServices.getSingleVote(id);
  sendResponse(res, {
    statusCode: status.OK,
    success: true,
    message: "vote id retrived successfully",
    data: result,
  });
})
export const voteControllers = {
  createVote,
  getAllVote,
  getSingleVote
};
