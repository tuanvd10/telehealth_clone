import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthorizationGuard implements CanActivate {
	constructor(private jwtService: JwtService, private configService: ConfigService) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const token = this.extractTokenFromHeader(request);
		if (!token) {
			throw new UnauthorizedException("No token");
		}
		try {
			const payload = await this.jwtService.verifyAsync(token, {
				secret: this.configService.get("JWT_SECRET"),
			});
			// We're assigning the payload to the request object here
			// so that we can access it in our route handlers
			//console.log("AuthorizationGuard: ", payload);
			request["user"] = payload;
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}

	private extractTokenFromHeader(request: Request): string | undefined {
		const [type, token] = request.headers.authorization?.split(" ") ?? [];
		//console.log(request.headers);
		return type === "Bearer" ? token : undefined;
	}
}
