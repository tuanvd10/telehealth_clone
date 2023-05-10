import { Controller, Get, Inject, LoggerService } from "@nestjs/common";
import { AppService } from "./app.service";
import { EventEmitter2, OnEvent } from "@nestjs/event-emitter";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";
@Controller()
export class AppController {
	constructor(
		private readonly appService: AppService,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService,
		private eventEmitter: EventEmitter2
	) {
		eventEmitter.addListener("app.welcome", (data) => {
			this.logger.log("welcome event", `Welcome ${data}`);
		});
	}

	@Get()
	getHello() {
		return this.appService.getHello();
	}

	@OnEvent("app.new_visitor")
	handleOrderCreatedEvent(payload: any) {
		// handle and process "OrderCreatedEvent" event
		this.logger.log("event fired: ", payload);
	}
}
