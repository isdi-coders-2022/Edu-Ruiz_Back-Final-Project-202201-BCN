const { MongoMemoryServer } = require("mongodb-memory-server");
const { default: mongoose } = require("mongoose");
const request = require("supertest");
const databaseConnect = require("../../database");
const Anime = require("../../database/models/Anime");
const app = require("../index");

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const connectionString = mongo.getUri();

  await databaseConnect(connectionString);
});

beforeEach(async () => {
  await Anime.create({
    name: "One Piece",
    autor: "tupac sakur",
    image: "image.png",
  });
  await Anime.create({
    name: "Naruto",
    autor: "eminem",
    image: "image.png",
  });
});

afterEach(async () => {
  await Anime.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

describe("Given a /animes endpoint", () => {
  describe("When it receives GET request", () => {
    test("Then it should respond with 200 and 2 tuits", async () => {
      const expectedLength = 2;
      const { body } = await request(app).get("/animes/").expect(200);

      expect(body.animes).toHaveLength(expectedLength);
    });
  });
});
