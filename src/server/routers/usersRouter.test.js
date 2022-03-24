require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToMongoDB = require("../../database");
const User = require("../../database/models/User");
const app = require("../index");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToMongoDB(connectionString);
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.create({
    name: "user1",
    username: "username1",
    password: "$2b$10$KgrIhPGAY12Xy/NPdUdLzubUtsCe0VV42YqPj6mk.sb.8.blGOg7W",
    animes: [],
    image: "image.png",
  });

  await User.create({
    name: "edu",
    username: "eya",
    password: "$2b$10$.wm84Yvm6DreufDQIvz/JOSQfPb08Xu75U1yX/mxxpjm1UJv6t6OK",
    Animes: [],
    image:
      "https://firebasestorage.googleapis.com/v0/b/anime4me-71d29.appspot.com/o/1647807529873_UserPic_profilePic.jpeg?alt=media&token=17aeaaff-cec0-4c35-b7d7-6445b9b4f80f",
    _id: "62378c2be4f1bc27aa9f1433",
  });
});

afterEach(async () => {
  await User.deleteMany({});
});

describe("Given a /login endpoint", () => {
  describe("When it receives a POST request with a wrong username and password", () => {
    test("Then it should return a 401 status", async () => {
      const user = {
        name: "user1",
        username: "wrongUsername",
        password: "user1",
      };

      await request(app).post("/users/login").send(user).expect(401);
    });
  });

  describe("When it receives a POST request with a username and wrong password", () => {
    test("Then it should return a 401 status", async () => {
      const user = {
        username: "username1",
        password: "wrongPassword",
      };

      await request(app).post("/users/login").send(user).expect(401);
    });
  });
});

describe("When it receives a POST request with a repeated user", () => {
  test("Then it should return a 401 status and the new user", async () => {
    const user = {
      name: "user1",
      username: "username1",
      password: "",
    };

    await request(app).post("/users/register").send(user).expect(400);
  });
});

describe("When it receives a POST request with a repeated user", () => {
  test("Then it should return a 401 status and the new user", async () => {
    const user = {
      name: "user1",
      username: "username1",
    };

    await request(app).get("/users/user").send(user).expect(401);
  });
});

describe("When it send a GET request with a Token", () => {
  test("Then it should return a 200 status and the  user", async () => {
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZWR1IiwiaWQiOiI2MjM3OGMyYmU0ZjFiYzI3YWE5ZjE0MzMiLCJpYXQiOjE2NDgwNzY4Nzd9.sOHBDr-Y1otyrhrkymiCyUaWWG5Qa7fM_XU_ylv1A5E";

    const user = {
      actualUser: {
        Animes: [],
        id: "62378c2be4f1bc27aa9f1433",
        image:
          "https://firebasestorage.googleapis.com/v0/b/anime4me-71d29.appspot.com/o/1647807529873_UserPic_profilePic.jpeg?alt=media&token=17aeaaff-cec0-4c35-b7d7-6445b9b4f80f",
        name: "edu",
        password:
          "$2b$10$.wm84Yvm6DreufDQIvz/JOSQfPb08Xu75U1yX/mxxpjm1UJv6t6OK",
        username: "eya",
      },
    };

    const { body } = await request(app)
      .get("/users/user")
      .set("Authorization", `${token}`)
      .expect(200);

    expect(body).toMatchObject(user);
  });
});

describe("When it send a GET request with a Token", () => {
  test("Then it should return a 200 status and the  user", async () => {
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiZWR1IiwiaWQiOiI2MjM3OGMyYmU0ZjFiYzI3YWE5ZjE0MzMiLCJpYXQiOjE2NDgwNzY4Nzd9.sOHBDr-Y1otyrhrkymiCyUaWWG5Qa7fM_XU_ylv1A5E";

    const user = {};

    const { body } = await request(app)
      .get("/users/allusers")
      .set("Authorization", `${token}`)
      .expect(200);

    expect(body).toMatchObject(user);
  });
});

describe("When it receives a POST request with wrong password", () => {
  test("Then it should return a 401 status and the new user", async () => {
    const user = {
      name: "user1",
      username: "username1",
      password: "",
      img: "",
    };

    await request(app).post("/users/register").send(user).expect(400);
  });
});

describe("When it receives a POST request with wrong password", () => {
  test("Then it should return a 401 status and the new user", async () => {
    const user = {
      name: "user1",
      username: "username1",
      password: "1234",
      img: "",
    };

    await request(app).post("/users/register").send(user).expect(400);
  });
});

describe("When it receives a POST request with wrong endpoint", () => {
  test("Then it should return a 404 status with not found error", async () => {
    const { body } = await request(app).post("/users/regir").expect(404);

    expect(body).toHaveProperty("message", "Error 404. Endpoint not found");
  });
});
