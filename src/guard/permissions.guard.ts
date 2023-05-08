import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { PERMISSION_KEY } from "../auth/decorators";
import { Permission } from "../utils";

@Injectable()
export class PermissionsGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredPermissions = this.reflector.getAllAndOverride<Permission[]>(PERMISSION_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (!requiredPermissions) {
			return true;
		}
		const { user } = context.switchToHttp().getRequest();

		if (!requiredPermissions.some((permisison) => user.permisison?.name === permisison))
			throw new UnauthorizedException("No permission");
		return true;
	}
}
