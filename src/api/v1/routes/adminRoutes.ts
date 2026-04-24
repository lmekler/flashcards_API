// External module imports
import express from "express";

// Internal module imports
import authenticate from "../middleware/authenticate";
import isAuthorized from "../middleware/authorize";
import { ROLE } from "../../../constants/roles";
import { setCustomClaims } from "../controllers/adminController";

const adminRouter: express.Router = express.Router();

// Only admins can set custom claims
adminRouter.post(
    "/setCustomClaims",
    authenticate(true),
    isAuthorized(true, {
        hasRole: [ROLE.ADMIN]
    }),
    setCustomClaims
);

export default adminRouter;