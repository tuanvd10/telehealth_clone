import { IsNotEmpty, IsString } from "class-validator";

//define type of authentication request
export class AuthDTO {
	@IsString()
	@IsNotEmpty()
	username: string;

	@IsString()
	@IsNotEmpty()
	//@IsStrongPassword()
	password: string;
}
