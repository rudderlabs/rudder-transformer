const { exec } = require("child_process");

if (process.env.ENABLE_FUNCTIONS !== "false") {
  exec(
    "npm install isolated-vm@^2.0.1 node-cache@^4.2.1 node-fetch@^2.6.0 --no-save",
    (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    }
  );
}
