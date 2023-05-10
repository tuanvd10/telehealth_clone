import { Module, NestModule, MiddlewareConsumer, Logger } from "@nestjs/common";
import { CacheModule, CacheStore } from "@nestjs/cache-manager";
import { redisStore } from "cache-manager-redis-store";
import { ScheduleModule } from "@nestjs/schedule";
//import { RedisClientOptions } from "redis";
import { ConfigModule, ConfigService } from "@nestjs/config"; //read data from .env file automatically
import { WinstonModule } from "nest-winston";
import * as winston from "winston";
import * as winstonDailyRotateFile from "winston-daily-rotate-file";

import { LoggerMiddleware, LoggingInterceptor } from "./middlewares";
import { AuthModule } from "./auth/auth.module";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AccountModule } from "./core-module/account/account.module";
import { AccountSessionModule } from "./core-module/account-session/account-session.module";
import { NoteModule } from "./core-module/note/note.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SwaggerModule } from "./swagger/swagger.module";
import { TaskScheduleModule } from "./task-schedule/task-schedule.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { AllExceptionsFilter } from "./utils";
import { EventEmitterModule } from "@nestjs/event-emitter";

const winstonPrintFunction = ({ level, context, timestamp, message, stack, trace }) => {
	let text: any; // = info.context || (info.stack && info.stack[0]) || "";
	if (level.includes("error")) {
		text = (stack && stack[0]) || trace;
		if (text instanceof Error) {
			//console.log(text);
			text = text.stack;
		}
	} else {
		text = context;
	}
	//console.log(level, text);
	return `[${timestamp}] [${level}] ${message} ${JSON.stringify(text)}`;
};

const winstonTransports = {
	console: new winston.transports.Console({
		level: "debug",
		format: winston.format.combine(
			winston.format.errors({ stack: true }), // <-- use errors format
			winston.format.colorize({
				colors: {
					error: "red",
					warn: "yellow",
					info: "green",
					debug: "blue",
				},
			}),
			winston.format.timestamp({
				format: "YYYY-MM-DD HH:mm:ss",
			}),
			winston.format.printf(winstonPrintFunction)
			//winston.format.align()
		),
	}),
	combinedFile: (logLevel: "debug" | "info" | "error") =>
		new winstonDailyRotateFile({
			dirname: "logs",
			filename: "combined",
			extension: ".log",
			level: logLevel,
			maxFiles: "30d", //30 day
			maxSize: "30m",
		}),
	errorFile: new winstonDailyRotateFile({
		dirname: "logs",
		filename: "error",
		extension: ".log",
		level: "error",
	}),
};

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
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
		WinstonModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				// options
				exitOnError: false,
				format: winston.format.combine(
					winston.format.errors({ stack: true }), // <-- use errors format
					winston.format.timestamp({
						format: "YYYY-MM-DD HH:mm:ss",
					}),
					winston.format.printf(winstonPrintFunction)
					//winston.format.align()
				),
				transports: [winstonTransports.console, winstonTransports.combinedFile(configService.get("LOG_LEVEL"))],
			}),
			inject: [ConfigService],
		}),
		ScheduleModule.forRoot(),
		TaskScheduleModule,
		EventEmitterModule.forRoot({
			global: true,
			wildcard: false, // set this to `true` to use wildcards
			delimiter: ".", // the delimiter used to segment namespaces
			newListener: false, // set this to `true` if you want to emit the newListener event
			removeListener: false, // set this to `true` if you want to emit the removeListener event
			maxListeners: 10, // the maximum amount of listeners that can be assigned to an event
			verboseMemoryLeak: false, // show event name in memory leak message when more than maximum amount of listeners is assigned
			ignoreErrors: false, // disable throwing uncaughtException if an error event is emitted and it has no listeners
		}),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
		{
			provide: APP_FILTER,
			useClass: AllExceptionsFilter,
		},
	],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		//register middleware
		consumer.apply(LoggerMiddleware).forRoutes("*");
	}
}
