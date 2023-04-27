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
					//url: "mysql://root:Conandoyle!3@localhost:3306/teleheath_clone?schema=public",
					url: config.get("DATABASE_URL"),
				},
			},
		});
	}
}
