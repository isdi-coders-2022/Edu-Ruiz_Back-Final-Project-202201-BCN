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

const createAnime = async (req, res, next) => {
  const { name, autor } = req.body;
  try {
    const nameAnimeExists = await Anime.findOne({ name });
    if (nameAnimeExists) {
      const error = new Error(`Anime already exists!`);
      error.code = 400;
      next(error);
      return;
    }
    const oldFileName = path.join("public", req.file.filename);
    const newFileName = path.join("public", req.file.originalname);
    fs.rename(oldFileName, newFileName, (error) => {
      if (error) {
        next(error);
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
        res.json({
          message: `Anime created with name: ${newAnime.name}`,
        });
      }
    });
  } catch (error) {
    fs.unlink(path.join("uploads", req.file.filename), () => {
      error.code = 400;
      next(error);
    });
  }
};

const getAllAnimes = async (req, res) => {
  const animes = await Anime.find();
  res.json({ animes });
};

const deleteAnime = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await Anime.findByIdAndDelete(id);
    res.status(200).json(deleted);
  } catch (error) {
    error.message = "cant delete anime";
    next(error);
  }
};

module.exports = { getAllAnimes, deleteAnime, createAnime };
