require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToMongoDB = require("../../database");
const Anime = require("../../database/models/Anime");
const app = require("../index");

let mongoServer;
jest.mock("firebase/storage", () => ({
  getStorage: () => ({}),
  ref: () => ({}),
  getDownloadURL: () => Promise.resolve("image.jpg"),
  uploadBytes: () => Promise.resolve(),
}));

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
  await Anime.create({
    name: "uwu",
    autor: "awa",
    image: "xd",
    _id: "62378c2be4f1bc27aa9f1433",
  });

  await Anime.create({
    name: "uwu",
    autor: "awa",
    image: "xd",
  });
});

afterEach(async () => {
  await Anime.deleteMany({});
});

describe("When it send a GET anime request ", () => {
  test("Then it should return a 200 status and the anime", async () => {
    const anime = {
      name: "uwu",
      autor: "awa",
      image: "xd",
    };

    const id = "62378c2be4f1bc27aa9f1433";

    const { body } = await request(app).get(`/animes/${id}`).expect(200);

    expect(body).toMatchObject(anime);
  });
});

describe("When it send a GET anime request ", () => {
  test("Then it should return a 200 status and the anime", async () => {
    const error = {};

    const id = "62378c2be4f1bc2313f1433";

    const { body } = await request(app).get(`/animes/${id}`).expect(404);

    expect(body).toMatchObject(error);
  });
});

describe("When it send a GET anime request ", () => {
  test("Then it should return a 200 status and the anime", async () => {
    const error = {
      error: true,
      message:
        'Cast to ObjectId failed for value "ew3243dn121nd" (type string) at path "_id" for model "Anime"',
    };

    const id = "ew3243dn121nd";

    const { body } = await request(app).get(`/animes/${id}`).expect(404);

    expect(body).toMatchObject(error);
  });
});
