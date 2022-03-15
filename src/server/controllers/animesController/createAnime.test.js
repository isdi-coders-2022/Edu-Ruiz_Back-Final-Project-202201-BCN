const fs = require("fs");
const Anime = require("../../../database/models/Anime");
const { createAnime } = require("./animesController");

jest.mock("../../../database/models/Anime");

jest.mock("firebase/storage", () => ({
  getStorage: () => "holaa",
  ref: () => {},
  getDownloadURL: async () => "download.url",
  uploadBytes: async () => {},
}));

describe("Given a createAnime controller", () => {
  describe("When it's instantiated with a new videogame in the body and an image in the file, and has an error on fs.rename", () => {
    test("Then it should should call next with an error", async () => {
      const newAnime = {
        name: "Hola",
        autor: "test",
      };

      const newFile = {
        fieldname: "image",
        originalname: "hola.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const req = {
        body: newAnime,
        file: newFile,
      };
      const next = jest.fn();

      jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
        callback("error", null);
      });

      await createAnime(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with file and no videogame on body", () => {
    test("Then it should call next with an error", async () => {
      const newFile = {
        fieldname: "image",
        originalname: "hola.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const req = {
        file: newFile,
      };

      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      jest.spyOn(fs, "unlink").mockImplementation((path, callback) => {
        callback();
      });

      await createAnime(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it has an error when renaming the file", () => {
    test("Then it should call the next method with an error", async () => {
      const newAnime = {
        name: "Hola",
        autor: "test",
      };
      const newFile = {
        fieldname: "image",
        originalname: "hola.jpeg",
        encoding: "7bit",
        mimetype: "image/jpeg",
        destination: "uploads/",
        filename: "93ec034d18753a982e662bc2fdf9a584",
        path: "uploads/93ec034d18753a982e662bc2fdf9a584",
        size: 8750,
      };

      const req = {
        body: newAnime,
        file: newFile,
      };
      const next = jest.fn();

      jest
        .spyOn(fs, "rename")
        .mockImplementation((oldpath, newpath, callback) => {
          callback("error");
        });

      await createAnime(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("When it's instantiated with a new videogame in the body and an image as file", () => {
  test("Then it should call json with the new videogame and the firebase url as image property", async () => {
    const newAnime = {
      name: "Hola",
      autor: "test",
    };
    const newFile = {
      fieldname: "image",
      originalname: "hola.jpeg",
      encoding: "7bit",
      mimetype: "image/jpeg",
      destination: "public/animes/",
      filename: "93ec034d18753a982e662bc2fdf9a584",
      path: "public/animes/93ec034d18753a982e662bc2fdf9a584",
      size: 8750,
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest
      .spyOn(fs, "rename")
      .mockImplementation((oldpath, newpath, callback) => {
        callback();
      });

    const req = {
      body: newAnime,
      file: newFile,
    };
    const next = jest.fn();
    Anime.create = jest.fn().mockResolvedValue("Hola");

    jest.spyOn(fs, "readFile").mockImplementation((file, callback) => {
      callback(null, newFile);
    });

    await createAnime(req, res, next);

    expect(res.json).toHaveBeenCalled();
  });
});
