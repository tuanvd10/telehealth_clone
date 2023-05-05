import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";

import { LoggerMiddleware } from "./middlewares";

import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountModule } from "./core-module/account/account.module";
import { AccountSessionModule } from "./core-module/account-session/account-session.module";
import { NoteModule } from "./core-module/note/note.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config"; //read data from .env file automatically
import { SwaggerModule } from "./swagger/swagger.module";

@Module({
	imports: [ConfigModule, AuthModule, AccountModule, AccountSessionModule, NoteModule, PrismaModule, SwaggerModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//register middleware
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
