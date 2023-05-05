import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { AuthorizationGuard, MyJwtGuard } from "../../guard";
import { NoteService } from "./note.service";
import { CurrentAccount } from "../../auth/decorators";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";

@UseGuards(AuthorizationGuard)
@Controller("notes")
export class NoteController {
	constructor(private noteService: NoteService) {}
	@Get("v0/all")
	getAllNoteOfCurrentUser(@CurrentAccount("id") userId: number) {
		return this.noteService.getAllNoteOfCurrentUser(userId);
	}

	@Get("/v0/:id/detail")
	getDetailNoteById(@CurrentAccount("id") userId: number, @Param("id", ParseIntPipe) noteId: number) {
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
