import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDTO } from "./dto";
import { JwtService } from "@nestjs/jwt";

//import * as argon from "argon2"; //using to hash password, like passwordhash
import * as passwordHash from "password-hash";
import { ConfigService } from "@nestjs/config";
import { createSuccessHttpResonse } from "../common/HttpResponse";
@Injectable()
export class AuthService {
	constructor(
		private prismaService: PrismaService,
		private jwtService: JwtService,
		private configService: ConfigService
	) {}

	async register(authDto: AuthDTO) {
		//throw new Error("Method not implemented.");
		//const hashPw = await argon.hash(authDto.password);
		const hashPw = passwordHash.generate(authDto.password, {
			algorithm: "sha256",
		});
		//insert into database
		try {
			const account = await this.prismaService.account.create({
				data: {
					username: authDto.username,
					password: hashPw,
				},
				select: {
					//which field return
					id: true,
					username: true,
					createdAt: true,
				},
			});
			return createSuccessHttpResonse(account);
		} catch (error) {
			if (error.code === "P2002")
				throw new ForbiddenException("Error when credentials");
			else throw new ForbiddenException("Unknow error");
		}
	}
	async login(authDto: AuthDTO) {
		const user = await this.prismaService.account.findUnique({
			where: { username: authDto.username },
		});
		if (!user) throw new ForbiddenException("User or pw not correct");
		//else if (!(await argon.verify(user.password, authDto.password)))
		else if (!passwordHash.verify(authDto.password, user.password))
			throw new ForbiddenException("User or pw not correct");
		delete user.password; //remove file in object, not affect to DB
		const jwtToken = await this.signJwtToken({
			id: user.id,
			createdAt: user.createdAt,
		});
		return createSuccessHttpResonse({
			token: jwtToken,
		});
	}
	logout() {
		throw new Error("Method not implemented.");
	}

	doAfterCreated() {
		console.log("doAfterCreated");
	}
	private async signJwtToken(payload: any) {
		return await this.jwtService.signAsync(payload, {
			expiresIn: this.configService.get("JET_EXPRIED_IN") || "1m",
			secret: this.configService.get("JWT_SECRET"),
		});
	}
}
