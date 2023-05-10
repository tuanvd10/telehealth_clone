import { Inject, Injectable, LoggerService } from "@nestjs/common";
import { SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from "cron";
import { WINSTON_MODULE_NEST_PROVIDER } from "nest-winston";

@Injectable()
export class TaskScheduleService {
	constructor(
		private schedulerRegistry: SchedulerRegistry,
		@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService
	) {}
	//Traditional define
	/* @Cron(CronExpression.EVERY_30_SECONDS, { name: "call_ervery_30_seconds" })
	handleCronEvery30Second() {
		//this.logger.debug("Called every 30 seconds");
		console.log("----------- Called every 30 seconds ------------");
	} */

	//Using dynamic api to manage job/interval/timeout
	//CRON TASK
	stopCronByName(name: string) {
		const job = this.schedulerRegistry.getCronJob(name);
		job.stop();
		return `${name} stopped manually, last run ${job.lastDate()}`;
	}
	startCronByName(name: string) {
		const job = this.schedulerRegistry.getCronJob(name);
		job.start();
		return `${name} start manually`;
	}
	addCronJob(name: string, time: string) {
		const isExist = this.schedulerRegistry.doesExist("cron", name);
		if (isExist) return `job- ${name} exist`;
		const job = new CronJob(`${time}`, () => {
			this.logger.log(`time (${time}) for job ${name} to run!`);
		});
		this.schedulerRegistry.addCronJob(name, job);
		job.start();
		return `job ${name} added and runtime is ${time}, it started automatically!`;
	}
	deleteCron(name: string) {
		this.schedulerRegistry.deleteCronJob(name);
		return `job ${name} deleted!`;
	}

	getCrons() {
		const jobs = this.schedulerRegistry.getCronJobs();
		const data = [];
		jobs.forEach((value, key, map) => {
			let next;
			try {
				next = value.nextDates().toJSDate();
			} catch (e) {
				next = "error: next fire date is in the past!";
			}
			data.push(`job: ${key} -> next: ${next}`);
		});
		this.logger.log(`data`, data);
		return data;
	}

	//INTERVAL
	addInterval(name: string, milliseconds: number) {
		const isExist = this.schedulerRegistry.doesExist("interval", name);
		if (isExist) return `Interval ${name} exist`;
		const callback = () => {
			this.logger.log(`Interval ${name} executing every ${milliseconds}ms!`);
		};
		const interval = setInterval(callback, milliseconds);
		this.schedulerRegistry.addInterval(name, interval);
		return `Interval ${name} added and be executed every ${milliseconds}ms automatically!`;
	}
	deleteInterval(name: string) {
		this.schedulerRegistry.deleteInterval(name);
		return `Interval ${name} deleted!`;
	}

	getIntervals() {
		const data = [];
		const intervals = this.schedulerRegistry.getIntervals();
		intervals.forEach((key) => data.push(`Interval: ${key}`));
		return data;
	}
}
