import { BadRequestException, Inject, Injectable, LoggerService } from "@nestjs/common";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class AppService {
	constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}
	getHello() {
		this.logger.error("error", [{ a: 1 }, { b: 2 }]);
		this.logger.warn("warn", [{ a: 1 }, { b: 2 }]);
		this.logger.log("fhfghf", [{ a: 1 }, { b: 2 }]);
		this.logger.debug("debug", [{ a: 1 }, { b: 2 }]);
		//throw new BadRequestException("bad request");
		return { mes: "Hello World!" };
	}
}
