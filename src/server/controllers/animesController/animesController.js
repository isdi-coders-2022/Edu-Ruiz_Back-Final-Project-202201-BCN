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
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Anime = require("../../../database/models/Anime");
const User = require("../../../database/models/User");

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

const getUser = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const actualUser = await User.findById(id);
  res.status(200).json({ actualUser });
};

const getAllUsers = async (req, res) => {
  const headerAuth = req.header("Authorization");
  const token = headerAuth.replace("Bearer ", "");
  const { id } = jwt.verify(token, process.env.JWT_SECRET);

  const usersData = await User.find();
  const actualUser = await User.findById(id);
  const users = usersData.filter((user) => user.id !== actualUser.id);
  res.status(200).json({ users });
};

const userLogin = async (req, res, next) => {
  const { username, password } = req.body;
  const findUser = await User.findOne({ username });

  if (!findUser) {
    const error = new Error("User not found");
    error.code = 401;
    return next(error);
  }

  const rightPassword = await bcrypt.compare(password, findUser.password);

  if (!rightPassword) {
    const error = new Error("Invalid password");
    error.code = 401;
    return next(error);
  }

  const UserData = {
    name: findUser.name,
    id: findUser.id,
  };

  const token = jwt.sign(UserData, process.env.JWT_SECRET);
  return res.json({ token });
};

const userRegister = async (req, res, next) => {
  const { username, password, name, animes } = req.body;
  try {
    const encryptedPassword = await bcrypt.hash(password, +process.env.SALT);
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      const error = new Error(`Username ${username} already exists!`);
      error.code = 400;
      next(error);
      return;
    }
    const oldFileName = path.join("public/users/", req.file.filename);
    const newFileName = path.join("public/users/", req.file.originalname);
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
          `${Date.now()}_UserPic_${req.file.originalname}`
        );
        await uploadBytes(storageRef, file);
        const firebaseFileURL = await getDownloadURL(storageRef);
        const newUser = await User.create({
          username,
          password: encryptedPassword,
          name,
          image: firebaseFileURL,
          animes,
        });
        debug(
          chalk.cyanBright(`User created with username: ${newUser.username}`)
        );
        res.status(201);
        res.json({
          message: `User registered with username: ${newUser.username}`,
        });
      }
    });
  } catch (error) {
    fs.unlink(path.join("public/users/", req.file.filename), () => {
      error.code = 400;
      next(error);
    });
  }
};

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
  const { id } = req.params;
  try {
    const anime = await Anime.findById(id);
    if (anime) {
      res.status(200).json(anime);
      debug(`Requested anime: ${anime.name}`);
    } else {
      const error = new Error("can't find anime");
      error.code = 404;
      next(error);
      debug(chalk.red(`Error: ${error.message}`));
    }
  } catch (error) {
    error.code = 404;
    debug(chalk.red(`Error: ${error.message}`));
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

const updateAnime = async (req, res, next) =>
  new Promise((resolve) => {
    try {
      if (req.file) {
        const anime = req.body;
        const { id } = req.params;

        const oldFileName = path.join("public/animes/", req.file.filename);
        const newFileName = path.join("public/animes/", req.body.name);
        fs.rename(oldFileName, newFileName, (error) => {
          if (error) {
            next(error);
            resolve();
          }
        });

        fs.readFile(newFileName, async (error, file) => {
          if (error) {
            next(error);
            resolve();
          } else {
            const storageRef = ref(storage, anime.name);
            await uploadBytes(storageRef, file);

            const firebaseFileURL = await getDownloadURL(storageRef);
            anime.image = firebaseFileURL;
            const updatedAnime = await Anime.findByIdAndUpdate(id, anime, {
              new: true,
            });

            res.status(200).json(updatedAnime);
            resolve();
          }
        });
      } else {
        (async () => {
          const anime = req.body;
          const { id } = req.params;

          const updatedAnime = await Anime.findByIdAndUpdate(id, anime, {
            new: true,
          });

          res.status(200).json(updatedAnime);
          resolve();
        })();
      }
    } catch (error) {
      fs.unlink(path.join("public/animes/", req.file.filename), () => {
        error.code = 400;
        next(error);
        resolve();
      });
      error.message = "Error, can't create the player";
      error.code = 400;
      next(error);
      resolve();
    }
  });

module.exports = {
  getAllAnimes,
  deleteAnime,
  createAnime,
  updateAnime,
  getAnime,
  getUser,
  getAllUsers,
  userLogin,
  userRegister,
};
