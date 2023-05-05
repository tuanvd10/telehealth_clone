import { Controller, Get, Req, UseGuards } from "@nestjs/common";
//import { AuthGuard } from "@nestjs/passport";
//import { Request } from "express";
import { MyJwtGuard } from "../guard";
import { Account } from "@prisma/client";
import { CurrentAccount } from "../auth/decorators";

@Controller("account")
//@UseGuards(AuthGuard("jwt")) //need guard to check token
@UseGuards(MyJwtGuard)
export class AccountController {
	@Get("/v0/current")
	getCurrentUserInfo(@CurrentAccount() currentUser: Account) {
		return currentUser;
	}
}
