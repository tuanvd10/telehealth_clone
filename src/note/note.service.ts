import { Injectable } from "@nestjs/common";
import { InsertNoteDTO, UpdateNoteDTO } from "./dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
//@Global() //can inject any where
export class NoteService {
	constructor(private prismaService: PrismaService) {}
	async getAllNoteOfCurrentUser(userId: number) {
		return await this.prismaService.note.findMany({
			select: { id: true, title: true },
			where: {
				accountId: userId,
			},
		});
	}

	async getDetailNoteById(userId: number, noteId: number) {
		return await this.prismaService.note.findFirst({
			//select: { id: true, title: true },
			where: {
				id: noteId,
				accountId: userId,
			},
		});
	}

	async insertNewNote(userId: number, noteData: InsertNoteDTO) {
		const note = await this.prismaService.note.create({
			data: {
				...noteData,
				accountId: userId,
			},
		});
		return note;
	}

	async updateNoteById(noteId: number, noteData: UpdateNoteDTO) {
		const note = await this.prismaService.note.updateMany({
			where: { id: noteId },
			data: {
				...noteData,
			},
		});
		return note;
	}

	async removeNoteById(userId: number, noteId: number) {
		return await this.prismaService.note.deleteMany({
			where: {
				id: noteId,
				accountId: userId,
			},
		});
	}
}
