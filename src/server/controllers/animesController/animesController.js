const debug = require("debug")("anime4me: animeController");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require("firebase/storage");
const path = require("path");
const fs = require("fs");

const chalk = require("chalk");
const Anime = require("../../../database/models/Anime");

const firebaseConfig = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
};

const fireBaseApp = initializeApp(firebaseConfig);
const storage = getStorage(fireBaseApp);

const createAnime = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      const { name, autor } = req.body;
      const oldFileName = path.join("public/animes/", req.file.filename);
      const newFileName = path.join("public/animes/", req.file.originalname);
      fs.rename(oldFileName, newFileName, (error) => {
        if (error) {
          next(error);
          resolve();
        }
      });
      fs.readFile(newFileName, async (error, file) => {
        if (error) {
          next(error);
        } else {
          const storageRef = ref(
            storage,
            `${Date.now()}_${req.file.originalname}`
          );
          await uploadBytes(storageRef, file);
          const firebaseFileURL = await getDownloadURL(storageRef);
          const newAnime = await Anime.create({
            name,
            autor,
            image: firebaseFileURL,
          });
          debug(chalk.cyanBright(`Anime created with name: ${newAnime.name}`));
          res.status(201);
          res.json(newAnime);
          resolve();
        }
      });
    } catch (error) {
      fs.unlink(path.join("public/animes/", req.file.filename), () => {
        error.code = 400;
        next(error);
        resolve();
      });
    }
  });

const getAllAnimes = async (req, res) => {
  const animes = await Anime.find();
  res.json({ animes });
};

const getAnime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const anime = await Anime.findById(id);
    if (anime) {
      res.status(200).json({ anime });
      debug(`Requested anime: ${anime}`);
    } else {
      const error = new Error("No se ha encontrado ningun anime");
      error.code = 404;
      next(error);
      debug(chalk.red(`Error: ${error.message}`));
    }
  } catch (error) {
    error.message = "can't find anime";
    next(error);
  }
};

const deleteAnime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Anime.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    error.message = "can't delete anime";
    next(error);
  }
};

const updateAnime = async (req, res, next) => {
  try {
    const anime = req.params;
    const animeToUpdate = req.body;
    const animeUpdated = await Anime.findByIdAndUpdate(anime.id, animeToUpdate);
    res.status(200).json(animeUpdated);
  } catch (error) {
    next(new Error("can't update this anime"));
  }
};

module.exports = {
  getAllAnimes,
  deleteAnime,
  createAnime,
  updateAnime,
  getAnime,
};
