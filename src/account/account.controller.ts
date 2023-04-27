import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";
import { createSuccessHttpResonse } from "../common/HttpResponse";

@Controller("account")
@UseGuards(AuthGuard("jwt")) //need guard to check token
export class AccountController {
	@Get("/v0/current")
	getCurrentUserInfo(@Req() request: Request) {
		return createSuccessHttpResonse(request.user);
	}
}
