import { ROLE } from "../../../constants/roles";

export interface AuthorizationOptions {
    hasRole?: Array<typeof ROLE.ADMIN | typeof ROLE.USER>;
}