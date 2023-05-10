import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	LoggerService,
	Inject,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
	) {}

	catch(exception: any, host: ArgumentsHost): void {
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;
		const ctx = host.switchToHttp();

		this.logger.error(
			httpAdapter.getRequestMethod(ctx.getRequest()) + httpAdapter.getRequestUrl(ctx.getRequest()),
			exception
		);

		const httpStatus =
			exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			message: exception.response?.message || exception.message || "FAILED",
			error: exception.response?.error || null,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
