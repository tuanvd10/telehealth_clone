import {
	Body,
	Controller,
	Delete,
	Get,
	HttpException,
	HttpStatus,
	Param,
	ParseIntPipe,
	Patch,
	Post,
	UseGuards,
} from "@nestjs/common";
import { MyJwtGuard, RolesGuard } from "../../guard";
import { NoteService } from "./note.service";
import { CurrentAccount, Roles } from "../../auth/decorators";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";
import { Role } from "../../utils";

@UseGuards(MyJwtGuard, RolesGuard)
//@UseGuards(RolesGuard)
@Controller("notes")
export class NoteController {
	constructor(private noteService: NoteService) {}
	@Get("v0/all")
	@Roles(Role.Admin)
	getAllNoteOfCurrentUser(@CurrentAccount("id") userId: number) {
		return this.noteService.getAllNoteOfCurrentUser(userId);
	}
	@Roles(Role.Admin, Role.Test)
	@Get("/v0/:id/detail")
	getDetailNoteById(@CurrentAccount("id") userId: number, @Param("id", ParseIntPipe) noteId: number) {
		throw new HttpException("testt", HttpStatus.BAD_REQUEST);
		return this.noteService.getDetailNoteById(userId, noteId);
	}

	@Post("/v0/new")
	insertNewNote(@CurrentAccount("id") userId: number, @Body() noteData: InsertNoteDTO) {
		return this.noteService.insertNewNote(userId, noteData);
	}

	@Patch("/v0/:id/update") //edit
	updateNoteById(@Param("id", ParseIntPipe) noteId: number, @Body() noteData: UpdateNoteDTO) {
		return this.noteService.updateNoteById(noteId, noteData);
	}

	@Delete("/v0/:id/delete")
	removeNoteById(@CurrentAccount("id") userId: number, @Param("id", ParseIntPipe) noteId: number) {
		return this.noteService.removeNoteById(userId, noteId);
	}
}
