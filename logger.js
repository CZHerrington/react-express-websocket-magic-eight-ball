const morgan = require("morgan");
const chalk = require("chalk");

// initialize morgan
morgan.token("colorful-method", (req, res, arg) => {
  const method = req.method.toLowerCase();
  return chalk.white(method);
});
morgan.token("colorful-status", (req, res, arg) => {
    const status = res.statusCode;
    // get status color
    const color = (status >= 500 || status === 404) ? "red"
      : (status >= 400) ? "yellow"
        : (status >= 300) ? "cyan"
            : (status >= 200)
                ? "yellow"
                : "white"
    const string = chalk[color](status);
    String.toString(null);
    return string;
});

const behaviors = {
  dev: morgan(":remote-user :colorful-method :url :colorful-status :response-time ms - :res[content-length]"),
  prod: morgan("combined")
};

function logger(env) {
  const environment = env || process.env.ENVIRONMENT || "dev";
  return behaviors[environment];
}

module.exports = logger;
