import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "@prisma/client";

//connect to DB
@Injectable()
export class PrismaService extends PrismaClient {
	constructor(config: ConfigService) {
		//
		super({
			datasources: {
				db: {
					url: config.get("DATABASE_URL"),
				},
			},
			log: ["query", "info", "warn", "error"],
		});
	}
	cleanDatabase() {
		//using transaction
		return this.$transaction([this.note.deleteMany(), this.accountSession.deleteMany(), this.account.deleteMany()]);
	}
}
