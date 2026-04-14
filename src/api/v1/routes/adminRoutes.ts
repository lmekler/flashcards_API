// External module imports
import express from "express";

// Internal module imports
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { setCustomClaims } from "../controllers/adminController";

const adminRouter: express.Router = express.Router();

// Only admins can set custom claims
adminRouter.post(
    "/setCustomClaims",
    authenticate,
    isAuthorized({ hasRole: ["admin"] }),
    setCustomClaims
);

export default adminRouter;