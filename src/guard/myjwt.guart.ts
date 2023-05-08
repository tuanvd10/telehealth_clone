import { UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

export class MyJwtGuard extends AuthGuard("jwt") {
	handleRequest(err: any, user: any, info: any) {
		// You can throw an exception based on either "info" or "err" arguments
		//console.log("MyJwtGuard: handleRequest");

		if (info || err) {
			//if (!user) throw new UnauthorizedException("no user");
			const errorData = info || err;
			//console.log("MyJwtGuard: handleRequest error", errorData);

			if (errorData instanceof TokenExpiredError) {
				throw new UnauthorizedException("Token expired");
			} else if (errorData instanceof JsonWebTokenError) {
				throw new UnauthorizedException("Invalid token");
			} else {
				throw errorData;
			}
		}
		return user;
	}
}
