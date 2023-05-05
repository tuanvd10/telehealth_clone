import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from "@nestjs/common";
import { Observable, TimeoutError } from "rxjs";
import { catchError, map, tap, timeout } from "rxjs/operators";
import { createSuccessHttpResonse, formatTime } from "../utils";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		const request = context.switchToHttp().getRequest();
		const now = Date.now();
		const { ip, method, path: url } = request;
		const params = { ...request.body, ...request.query };
		const userAgent = request.get("user-agent") || "";
		return next.handle().pipe(
			timeout(10000),
			catchError((err) => {
				if (err instanceof TimeoutError) {
					throw new RequestTimeoutException();
				} else throw err;
			}),
			tap((dataResponse: any) => {
				const response = context.switchToHttp().getResponse();
				const { statusCode } = response;
				const diff = Date.now() - now;
				console.log(
					`${formatTime(now)} ${method} ${url} ${statusCode} ${diff}ms ${userAgent} ${ip} ${JSON.stringify(
						params
					)} ${JSON.stringify(dataResponse)}`
				);
			}),
			map((data: any) => createSuccessHttpResonse(data))
		);
	}
}
