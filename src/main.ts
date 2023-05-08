import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TrimPipe } from "./pipes";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./utils";
import { LoggingInterceptor } from "./middlewares";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {});
	// request handler sequence: Middleware/Guard-> Interceptors -> Pipes -> Route Handler -> Interceptors
	app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
	//add middleware to using class validator
	app.useGlobalPipes(new TrimPipe(), new ValidationPipe());
	app.useGlobalInterceptors(new LoggingInterceptor());
	const config = new DocumentBuilder()
		.setTitle("Median")
		.setDescription("The Median API description")
		.setVersion("0.1")
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup("apidocument", app, document);
	await app.listen(process.env.PORT || 3000, "0.0.0.0");
}
bootstrap();
