import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	use(request: Request, response: Response, next: NextFunction) {
		const { ip, method, path: url } = request;
		const params = { ...request.body, ...request.query };
		const userAgent = request.get("user-agent") || "";
		response.on("finish", () => {
			const { statusCode } = response;
			console.log(
				`${method} ${url} ${statusCode} - ${userAgent} ${ip} ${JSON.stringify(
					params
				)}`
			);
			//response not include data return here
		});

		next();
	}
}
