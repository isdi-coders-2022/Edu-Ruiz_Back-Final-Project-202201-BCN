const debug = require("debug")("anime4me: server");
const chalk = require("chalk");

const startServer = (app, port) =>
  new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      debug(chalk.bold.green(`Server listening on http://localhost:${port}/`));
      resolve();
    });

    server.on("error", (error) => {
      debug(chalk.bold.red(`The server has an error ${error}`));
      reject(error);
    });
  });

module.exports = startServer;
