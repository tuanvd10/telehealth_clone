import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: any, host: ArgumentsHost): void {
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;
		console.log(exception);
		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			message: exception.response?.message || exception.message || "Something wrong",
			error: exception.response?.error || null,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
