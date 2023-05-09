import { Body, Controller, Delete, Get, Post, Put, UseGuards } from "@nestjs/common";
import { MyJwtGuard, PermissionsGuard, RolesGuard } from "src/guard";
import { TaskScheduleService } from "./task-schedule.service";
import { Role } from "src/utils";
import { Roles } from "src/auth/decorators";

@UseGuards(MyJwtGuard, RolesGuard, PermissionsGuard)
@Controller("task-schedule")
export class TaskScheduleController {
	constructor(private taskScheduleService: TaskScheduleService) {}
	@Get("/cron/all")
	getAllCronTask() {
		return this.taskScheduleService.getCrons();
	}
	@Put("/cron/stop")
	@Roles(Role.Admin)
	stopCronByName(@Body("name") name: string): string {
		return this.taskScheduleService.stopCronByName(name);
	}
	@Put("/cron/start")
	@Roles(Role.Admin)
	startCronByName(@Body("name") name: string) {
		return this.taskScheduleService.startCronByName(name);
	}
	@Post("/cron/new")
	@Roles(Role.Admin)
	addCronJob(@Body("name") name: string, @Body("time") time: string) {
		return this.taskScheduleService.addCronJob(name, time);
	}
	@Delete("/cron/delete")
	@Roles(Role.Admin)
	deleteCron(@Body("name") name: string) {
		return this.taskScheduleService.deleteCron(name);
	}
}
