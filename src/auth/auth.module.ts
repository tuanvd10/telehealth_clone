import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "../prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./strategy";

@Module({
	imports: [PrismaModule, JwtModule.register({})],
	controllers: [AuthController],
	providers: [AuthService, ConfigService, JwtStrategy],
})
export class AuthModule {}
