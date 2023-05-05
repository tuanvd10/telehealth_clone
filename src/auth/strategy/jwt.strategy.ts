import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { PrismaService } from "../../prisma/prisma.service";

//management user must send with token
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
	constructor(private configService: ConfigService, private prismaService: PrismaService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get("JWT_SECRET"),
		});
	}
	async validate(payload: any) {
		//payload: data decoded
		const user = await this.prismaService.account.findUnique({
			where: { id: payload.id },
		});
		delete user.password;
		return user; //add to request.user = payload
	}
}
