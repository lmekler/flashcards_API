import { ROLES } from "../../../constants/roles";

export interface AuthorizationOptions {
    hasRole?: Array<typeof ROLES.ADMIN | typeof ROLES.USER>;
}