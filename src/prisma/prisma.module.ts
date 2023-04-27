import { Module, Global } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { ConfigService } from "@nestjs/config";

@Global() //this module is global => can be used any where
@Module({
	providers: [PrismaService, ConfigService],
	exports: [PrismaService], //for other modules can use this service
})
export class PrismaModule {}
