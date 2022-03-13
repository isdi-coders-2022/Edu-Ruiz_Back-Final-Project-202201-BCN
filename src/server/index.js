const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { notFoundError, generalError } = require("./middlewares/errors");
const animesRouter = require("./routers/animesRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.static("public"));
app.use(helmet());

app.use("/animes", animesRouter);

app.use(generalError);
app.use(notFoundError);

module.exports = app;
