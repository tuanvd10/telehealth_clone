import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountModule } from "./account/account.module";
import { AccountSessionModule } from "./account-session/account-session.module";
import { NoteModule } from "./note/note.module";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config"; //read data from .env file automatically
import { SwaggerModule } from "./swagger/swagger.module";

@Module({
	imports: [
		ConfigModule,
		AuthModule,
		AccountModule,
		AccountSessionModule,
		NoteModule,
		PrismaModule,
		SwaggerModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
