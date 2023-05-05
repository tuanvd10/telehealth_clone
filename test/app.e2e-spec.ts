import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { AllExceptionsFilter } from "../src/utils";
import { TrimPipe } from "../src/pipes";
import { LoggingInterceptor } from "../src/middlewares";
import { HttpAdapterHost } from "@nestjs/core";
import { PrismaService } from "../src/prisma/prisma.service";
import * as pactum from "pactum";

//create database for test
//before test => cleanup data
//call api like postman
describe("AppController (e2e)", () => {
	let app: INestApplication;
	let prismaService: PrismaService;
	//setup 1 time
	beforeAll(async () => {
		const appModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();
		app = appModule.createNestApplication();
		app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));
		app.useGlobalPipes(new TrimPipe(), new ValidationPipe());
		app.useGlobalInterceptors(new LoggingInterceptor());
		await app.init();
		await app.listen(process.env.PORT || 3002);
		prismaService = app.get(PrismaService);
		await prismaService.cleanDatabase();
		pactum.request.setBaseUrl(`http://localhost:${process.env.PORT || 3002}`);
	});
	//test case in here
	//need create new database for test
	//set up for every request
	beforeEach(async () => {});
	it("/ (GET)", () => {
		return request(app.getHttpServer())
			.get("/")
			.expect(200)
			.expect((data) => data.body.data === "Hello World!");
	});

	describe("Test Authen tication (e2e)", () => {
		describe("Test Register (e2e)", () => {
			it("Register ok", () => {
				return pactum
					.spec()
					.post(`/auth/v0/register`)
					.withBody({ username: "test_01", password: "123456123" })
					.expectStatus(201);
			});
			it("Register failed with invalid param", () => {
				return pactum
					.spec()
					.post(`/auth/v0/register`)
					.withBody({ username: "test_02", password: " " })
					.expectStatus(400);
			});
		});
		describe("Test Login (e2e)", () => {
			it("login success", () => {
				return pactum
					.spec()
					.post(`/auth/v0/login`)
					.withBody({ username: "test_01", password: "123456123" })
					.expectStatus(201)
					.stores("accessToken", "data.token");
			});
			it("login failed", () => {
				return pactum
					.spec()
					.post(`/auth/v0/login`)
					.withBody({ username: "test_01", password: "12313" })
					.expectStatus(403);
			});
		});

		describe("Test User (e2e)", () => {
			it("Get Current user's detail", () => {
				return pactum
					.spec()
					.get(`/account/v0/current`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.expectStatus(200);
			});
		});

		describe("Test Note (e2e)", () => {
			it("Add new note 1", () => {
				return pactum
					.spec()
					.post(`/notes/v0/new`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.withBody({
						title: "title test 1",
						description: "des 1",
						url: "url 1",
					})
					.expectStatus(201);
			});
			it("Add new note 2", () => {
				return pactum
					.spec()
					.post(`/notes/v0/new`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.withBody({
						title: "title test 2",
						description: "des 2",
						url: "url 2",
					})
					.expectStatus(201);
			});
			it("Get all note", () => {
				return pactum
					.spec()
					.get(`/notes/v0/all`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.expectStatus(200)
					.stores("noteId", "data[0].id");
			});
			it("Get note detail", () => {
				return pactum
					.spec()
					.get(`/notes/v0/$S{noteId}/detail`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.expectStatus(200);
			});
			it("Add new note 3", () => {
				return pactum
					.spec()
					.post(`/notes/v0/new`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.withBody({
						title: "title test 3",
						description: "des 3",
						url: "url 3",
					})
					.expectStatus(201);
			});
			it("Remove note", () => {
				return pactum
					.spec()
					.delete(`/notes/v0/$S{noteId}/delete`)
					.withHeaders({
						Authorization: "Bearer $S{accessToken}",
					})
					.expectStatus(200);
			});
		});
	});

	//close app
	afterAll(async () => {
		if (prismaService) await prismaService.cleanDatabase();
		app.close();
	});
});
