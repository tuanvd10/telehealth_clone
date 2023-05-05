import { IsOptional, IsString } from "class-validator";

export class UpdateNoteDTO {
	//? meaning in case no data passing => keep old value (not update to null)

	@IsString()
	@IsOptional()
	title?: string;

	@IsString()
	@IsOptional()
	description: string;

	@IsString()
	@IsOptional()
	url?: string;
}
