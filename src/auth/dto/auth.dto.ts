import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

//define type of authentication request
export class AuthDTO {
	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "login name",
		type: String,
		example: "test",
	})
	username: string;

	@IsString()
	@IsNotEmpty()
	@ApiProperty({
		description: "pw",
		type: String,
		example: "test",
	})
	//@IsStrongPassword()
	password: string;
}
