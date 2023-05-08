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
import { MyJwtGuard, RolesGuard, PermissionsGuard } from "../../guard";
import { NoteService } from "./note.service";
import { CurrentAccount, RequirePermissions, Roles } from "../../auth/decorators";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";
import { Permission, Role } from "../../utils";

@UseGuards(MyJwtGuard, RolesGuard, PermissionsGuard)
//@UseGuards(RolesGuard)
@Controller("notes")
export class NoteController {
	constructor(private noteService: NoteService) {}
	@Get("/v0/all")
	@Roles(Role.Admin)
	getAllNoteOfCurrentUser(@CurrentAccount("id") userId: number) {
		return this.noteService.getAllNoteOfCurrentUser(userId);
	}
	@Get("/v0/:id/detail")
	getDetailNoteById(@CurrentAccount("id") userId: number, @Param("id", ParseIntPipe) noteId: number) {
		//throw new HttpException("testt", HttpStatus.BAD_REQUEST);
		return this.noteService.getDetailNoteById(userId, noteId);
	}

	@Post("/v0/new")
	@Roles(Role.Admin)
	@RequirePermissions(Permission.CREATE)
	insertNewNote(@CurrentAccount("id") userId: number, @Body() noteData: InsertNoteDTO) {
		return this.noteService.insertNewNote(userId, noteData);
	}
	@Roles(Role.Admin)
	@RequirePermissions(Permission.CREATE)
	@Patch("/v0/:id/update") //edit
	updateNoteById(@Param("id", ParseIntPipe) noteId: number, @Body() noteData: UpdateNoteDTO) {
		return this.noteService.updateNoteById(noteId, noteData);
	}
	@Roles(Role.Admin)
	@RequirePermissions(Permission.REMOVE)
	@Delete("/v0/:id/delete")
	removeNoteById(@CurrentAccount("id") userId: number, @Param("id", ParseIntPipe) noteId: number) {
		return this.noteService.removeNoteById(userId, noteId);
	}
}
