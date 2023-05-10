import { Module } from "@nestjs/common";
import { TaskScheduleService } from "./task-schedule.service";
import { TaskScheduleController } from "./task-schedule.controller";

@Module({
	providers: [TaskScheduleService],
	controllers: [TaskScheduleController],
})
export class TaskScheduleModule {}
