import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { CacheModule, CacheStore } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { ScheduleModule } from "@nestjs/schedule";
//import { RedisClientOptions } from "redis";
import { ConfigModule, ConfigService } from "@nestjs/config"; //read data from .env file automatically

import { LoggerMiddleware } from "./middlewares";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountModule } from "./core-module/account/account.module";
import { AccountSessionModule } from "./core-module/account-session/account-session.module";
import { NoteModule } from "./core-module/note/note.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SwaggerModule } from "./swagger/swagger.module";
import { TaskScheduleModule } from "./task-schedule/task-schedule.module";

//console.log(process.env);

@Module({
	imports: [
		ConfigModule,
		AuthModule,
		AccountModule,
		AccountSessionModule,
		NoteModule,
		PrismaModule,
		SwaggerModule,
		CacheModule.registerAsync({
			isGlobal: true,
			imports: [ConfigModule],
			useFactory: async (configService: ConfigService) => ({
				store: (await redisStore({
					ttl: Number(configService.get("CACHE_TTL")),
					//url: configService.get("REDIS_URL"),
					database: Number(configService.get("REDIS_DATABASE_INDEX")),
					username: configService.get("REDIS_USERNAME"),
					password: configService.get("REDIS_PASSWORD"),
					socket: {
						host: configService.get("REDIS_HOSTNAME"),
						port: configService.get("REDIS_PORT"),
					},
				})) as unknown as CacheStore,
			}),
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),
		TaskScheduleModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//register middleware
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
