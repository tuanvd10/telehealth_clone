import {
	Body,
	Controller,
	Delete,
	FileTypeValidator,
	Get,
	HttpException,
	HttpStatus,
	MaxFileSizeValidator,
	Param,
	ParseFilePipe,
	ParseFilePipeBuilder,
	ParseIntPipe,
	Patch,
	Post,
	UploadedFile,
	UploadedFiles,
	UseFilters,
	UseGuards,
	UseInterceptors,
} from "@nestjs/common";
import { FileFieldsInterceptor, FileInterceptor } from "@nestjs/platform-express";

import { mkdirSync } from "fs";

import { MyJwtGuard, RolesGuard, PermissionsGuard } from "../../guard";
import { NoteService } from "./note.service";
import { CurrentAccount, RequirePermissions, Roles } from "../../auth/decorators";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";
import { Permission, Role } from "../../utils";
import { diskStorage } from "multer";

@UseGuards(MyJwtGuard, RolesGuard, PermissionsGuard)
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

	@Post("upload")
	@UseInterceptors(
		FileInterceptor("document", {
			dest: "./upload/note/",
			storage: diskStorage({
				destination: function (req, file, cb) {
					const dest = `./uploads/note/${req.user["id"]}`;
					mkdirSync(dest, { recursive: true });
					//create folder if not exist
					cb(null, dest);
				},
				filename: function (req, file, callback) {
					const filenames = file.originalname.split(".");
					const newFileName = filenames[0] + new Date().getTime() + "." + filenames[1];
					callback(null, newFileName);
				},
			}),
		})
	)
	//@UseFilters(DeleteFileOnErrorFilter)
	uploadFile(
		@UploadedFile(
			new ParseFilePipeBuilder()
				.addFileTypeValidator({
					fileType: new RegExp(
						"/^(application/vnd.openxmlformats-officedocument.wordprocessingml.document | image/jpeg)$/"
					), //using mimetype
				})
				.addMaxSizeValidator({ maxSize: 1000 * 1000 }) //as byte
				.build({
					errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
				})
		)
		fieldData: Express.Multer.File,
		@Body() data: any
	) {
		console.log(fieldData);
		console.log(data);
		throw new Error("dfhgkfdhgkjfdghkdjf");
		return "Upload success";
	}

	@Post("upload/multi")
	@UseInterceptors(
		FileFieldsInterceptor([
			{ name: "avatar", maxCount: 1 },
			{ name: "background", maxCount: 1 },
		])
	)
	uploadFileMulti(@UploadedFiles() files: { avatar?: Express.Multer.File[]; background?: Express.Multer.File[] }) {
		console.log(files);
		return "Upload success";
	}
}
