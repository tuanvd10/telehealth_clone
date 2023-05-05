import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TrimPipe } from "./common/TrimPipe";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AllExceptionsFilter } from "./utils";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
	//add middleware to using class validator
	app.useGlobalPipes(new TrimPipe(), new ValidationPipe());

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
