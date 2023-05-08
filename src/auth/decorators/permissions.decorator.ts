import { SetMetadata } from "@nestjs/common";
import { Permission } from "../../utils";

export const PERMISSION_KEY = "permissions";
export const RequirePermissions = (...permissions: Permission[]) => SetMetadata(PERMISSION_KEY, permissions);
