import { Module } from "@nestjs/common";
import { NoteController } from "./note.controller";
import { NoteService } from "./note.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Module({
	imports: [],
	controllers: [NoteController],
	providers: [NoteService, JwtService, ConfigService],
})
export class NoteModule {}
