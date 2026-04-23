// External module imports
import express, { Router } from "express";

// Internal module imports
import { ROLE } from "../../../constants/roles";
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import deckRouter from "./deckRoutes";
import { getUserDetails } from "../controllers/userController";

const userRouter: Router = express.Router();

userRouter.use("/:userId/decks", deckRouter);

// Only admins can view detailed user information
userRouter.get(
    "/:userId",
    authenticate(true),
    isAuthorized(true, {
        hasRole: [ROLE.ADMIN]
    }),
    getUserDetails
);

export default userRouter;