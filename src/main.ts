import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { TrimPipe } from "./common/TrimPipe";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	//add middleware to using class validator
	app.useGlobalPipes(new TrimPipe(), new ValidationPipe());
	await app.listen(3000);
}
bootstrap();
