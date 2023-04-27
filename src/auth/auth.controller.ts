import { Body, Controller, Post, Put, Req, UsePipes } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDTO } from "./dto";

@Controller("auth")
export class AuthController {
	//auto create auth serice when create controller
	constructor(private authService: AuthService) {
		authService.doAfterCreated();
	}

	@Post("/v0/register") //register new user
	//register(@Req() request: Request) {
	async register(@Body() authDto: AuthDTO) {
		//body need to an DTO and validate here, using class-validator
		//const params = { ...request.body, ...request.query, ...request.params };
		return await this.authService.register(authDto);
	}
	@Post("/v0/login") //login user
	login(@Body() authDto: AuthDTO) {
		return this.authService.login(authDto);
	}
	@Put("/v0/logout") //logout user
	logout() {
		return this.authService.logout();
	}
}
