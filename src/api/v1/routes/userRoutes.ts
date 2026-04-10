import express, { Router } from "express";
import { getUserDetails } from "../controllers/userController";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import deckRouter from "./deckRoutes";

const userRouter: Router = express.Router();

userRouter.use("/:userId/decks", deckRouter);

// Only admins can view detailed user information
userRouter.get(
    "/:userId",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    getUserDetails
);

export default userRouter;