const fs = require("fs-extra");
const os = require("os");
const path = require("path");
const shell = require("shelljs");
const dockerCli = require("./docker-cli");

const FUNCTION_REPOSITORY = "rudderlabs/user-functions-test";

const resourcesBasePath = path.join(__dirname, "..", "resources", "openfaas");
const buildsFolderPrefix = "openfaas-builds-";

async function buildContext(code) {
  const buildDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), buildsFolderPrefix)
  );
  const funcDir = path.join(buildDir, "function");

  await fs.promises.mkdir(funcDir);
  await fs.copy(resourcesBasePath, buildDir);

  await fs.promises.writeFile(path.join(funcDir, "__init__.py"), "");
  await fs.promises.writeFile(path.join(funcDir, "handler.py"), code);

  console.log("Done building context at: ", buildDir);
  return buildDir;
}

async function dockerizeAndPush(buildDir, transformationName) {
  shell.cd(buildDir);

  const tagName = transformationName
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-");
  const imageName = `${FUNCTION_REPOSITORY}:${tagName}`;

  await dockerCli.buildImage(".", "-t", imageName);
  await dockerCli.pushImage(imageName);
}

async function faasDeploymentHandler(transformationName, code) {
  const buildDir = await buildContext(code);
  await dockerizeAndPush(buildDir, transformationName);
  // fs.rmdir(buildDir, { recursive: true, force: true });
}


exports.faasDeploymentHandler = faasDeploymentHandler;
