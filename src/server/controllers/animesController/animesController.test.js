const Anime = require("../../../database/models/Anime");
const { getAllAnimes, deleteAnime } = require("./animesController");

jest.mock("../../../database/models/Anime");

const mockAnimeDelete = jest.spyOn(Anime, "findByIdAndDelete");
const mockAnimeGet = jest.spyOn(Anime, "find");

describe("Given an getAllAnimes controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a response", () => {
    test("Then it should call method json with a list of animes of the received response", async () => {
      const res = {
        json: jest.fn(),
      };
      const animes = [
        {
          id: "01010101010101",
          name: "One Piece",
          autor: "tupac sakur",
        },
      ];
      Anime.find = jest.fn().mockResolvedValue(animes);
      await getAllAnimes(null, res);
      expect(Anime.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ animes });
    });
  });
});

describe("Given a deleteAnime controller", () => {
  describe("When it receives a response with status 200 and object with id 3", () => {
    test("Then it should delete the review with id 3", async () => {
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const id = "3";
      const req = {};
      req.params = { id };
      const status = 200;
      const expectedDeletedReview = { id: "3" };
      const next = jest.fn();
      mockAnimeDelete.mockResolvedValue(expectedDeletedReview);

      await deleteAnime(req, res, next);

      expect(res.status).toHaveBeenCalledWith(status);
      expect(res.json).toHaveBeenCalledWith({ id });
    });
  });

  describe("When it receives a response", () => {
    test("Then it should call function next with message 'cant delete animes'", async () => {
      const error = new Error();
      mockAnimeGet.mockImplementation(() => Promise.reject(error));
      const expectedErrorMessage = "can't delete anime";
      const expectedError = new Error(expectedErrorMessage);

      const next = jest.fn();

      await deleteAnime(null, null, next);

      expect(next).toHaveBeenCalledWith(expectedError);
    });
  });
});
