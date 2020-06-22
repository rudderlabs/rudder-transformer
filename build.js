const { exec } = require("child_process");
const logger = require("./logger");

if (process.env.ENABLE_FUNCTIONS !== "false") {
  exec(
    "npm install isolated-vm@^2.0.1 node-cache@^4.2.1 node-fetch@^2.6.0 --no-save",
    (error, stdout, stderr) => {
      if (error) {
        logger.error(`exec error: ${error}`);
        return;
      }
      logger.debug(`stdout: ${stdout}`);
      logger.error(`stderr: ${stderr}`);
    }
  );
}
