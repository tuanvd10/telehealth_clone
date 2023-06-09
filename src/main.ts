import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TrimPipe } from "./pipes";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

async function bootstrap() {
	const app = await NestFactory.create(AppModule, {});
	// request handler sequence: Middleware/Guard-> Interceptors -> Pipes -> Route Handler -> Interceptors
	//app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
	//add middleware to using class validator
	app.useGlobalPipes(new TrimPipe(), new ValidationPipe());
	app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
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
