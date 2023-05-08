import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";
import { Observable, TimeoutError } from "rxjs";
import { catchError, map, tap, timeout } from "rxjs/operators";
import { createSuccessHttpResonse, formatTime } from "../utils";

// catch any errors thrown by pipes, controllers, or services can be read in the catchError operator of an interceptor.
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const now = Date.now();
		const { ip, method, path: url } = request;
		const params = { ...request.body, ...request.query, ...request.params, user: request.user };
		const userAgent = request.get("user-agent") || "";
		const timeFormated = formatTime(now);
		return next.handle().pipe(
			timeout(10000),
			catchError((error) => {
				const errCode = error.status;
				const diff = Date.now() - now;
				console.log(
					`${timeFormated} ${method} ${url} ${errCode} ${diff}ms ${userAgent} ${ip} ${JSON.stringify(params)}`
				);
				if (error instanceof TimeoutError) {
					throw new RequestTimeoutException();
				} else throw error;
			}),
			tap((dataResponse: any) => {
				const response = context.switchToHttp().getResponse();
				const { statusCode } = response;
				const diff = Date.now() - now;
				console.log(
					`${timeFormated} ${method} ${url} ${statusCode} ${diff}ms ${userAgent} ${ip} ${JSON.stringify(
						params
					)} ${JSON.stringify(dataResponse)}`
				);
			}),
			map((data: any) => createSuccessHttpResonse(data))
		);
	}
}
