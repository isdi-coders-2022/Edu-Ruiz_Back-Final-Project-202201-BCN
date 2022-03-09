const Anime = require("../../../database/models/Anime");
const { getAllAnimes } = require("./animesController");

jest.mock("../../../database/models/Anime");
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
