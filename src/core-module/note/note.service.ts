import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Cache } from "cache-manager";

import { InsertNoteDTO, UpdateNoteDTO } from "./dto";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
//@Global() //can inject any where
export class NoteService {
	constructor(private prismaService: PrismaService, @Inject(CACHE_MANAGER) private cacheManager: Cache) {}
	async getAllNoteOfCurrentUser(userId: number) {
		const cachedData = await this.cacheManager.get(`note_${userId}`);
		if (cachedData) {
			console.log(`Getting data from cache!`);
			return cachedData;
		}
		const data = await this.prismaService.note.findMany({
			select: { id: true, title: true },
			where: {
				accountId: userId,
			},
		});
		await this.cacheManager.set(`note_${userId}`, data);
		return data;
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
