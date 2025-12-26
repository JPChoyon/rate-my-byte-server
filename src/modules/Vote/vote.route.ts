import { Router } from "express";
import { voteControllers } from "./vote.controller";


const route = Router();

route.get("/", voteControllers.getAllVote);
route.get("/:id", voteControllers.getSingleVote);
route.post("/", voteControllers.createVote);
export const voteRoutes = route;
