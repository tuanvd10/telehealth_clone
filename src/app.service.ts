import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
import { listeners } from "process";

@Injectable()
export class AppService {
	constructor(
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
		private eventEmitter: EventEmitter2
	) {}
	getHello() {
		this.logger.error("error", [{ a: 1 }, { b: 2 }]);
		this.logger.warn("warn", [{ a: 1 }, { b: 2 }]);
		this.logger.log("fhfghf", [{ a: 1 }, { b: 2 }]);
		this.logger.debug("debug", [{ a: 1 }, { b: 2 }]);
		//throw new BadRequestException("bad request");
		this.eventEmitter.emit("app.new_visitor", "new visitor");
		this.eventEmitter.emit("app.welcome", "new visitor");
		return "Hello World!";
	}
}
