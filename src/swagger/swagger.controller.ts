import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from "@nestjs/common";
import { SwaggerService } from "./swagger.service";
import { CreateSwaggerDto } from "./dto/create-swagger.dto";
import { UpdateSwaggerDto } from "./dto/update-swagger.dto";

@Controller("swagger")
export class SwaggerController {
	constructor(private readonly swaggerService: SwaggerService) {}

	@Post()
	create(@Body() createSwaggerDto: CreateSwaggerDto) {
		return this.swaggerService.create(createSwaggerDto);
	}

	@Get()
	findAll() {
		return this.swaggerService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.swaggerService.findOne(+id);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() updateSwaggerDto: UpdateSwaggerDto
	) {
		return this.swaggerService.update(+id, updateSwaggerDto);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.swaggerService.remove(+id);
	}
}
