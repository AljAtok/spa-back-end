import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../src/app.module";

describe("NestJS Migration Test", () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("/ (GET) should return 404 for root", () => {
    return request(app.getHttpServer()).get("/").expect(404);
  });

  it("/api/auth/login (POST) should require body", () => {
    return request(app.getHttpServer()).post("/api/auth/login").expect(400);
  });
});
