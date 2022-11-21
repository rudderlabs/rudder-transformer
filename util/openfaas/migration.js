const { default: axios } = require("axios");
const path = require("path");
const logger = require("../../logger");

const { setupUserTransformHandler } = require("../customTransformer");

async function getAllHandles() {
  return axios.get(
    new URL(
      path.join(process.env.CONFIG_BACKEND_URL, "/transformationHandles")
    ).toString()
  );
}

async function getTransformationByVersionId(versionId) {
  return axios.get(
    new URL(
      path.join(
        process.env.CONFIG_BACKEND_URL,
        `/transformation/getByVersionId?versionId=${versionId}`
      )
    ).toString()
  );
}

async function migrate(versionId) {
  const transformation = (await getTransformationByVersionId(versionId)).data;

  return setupUserTransformHandler(
    {
      code: transformation.code,
      language: transformation.language,
      workspaceId: transformation.workspaceId,
      versionId
    },
    [],
    true
  );
}

async function lambdaMigrationsHandler() {
  const handles = (await getAllHandles()).data.transformationHandles;

  const promises = [];

  handles.forEach(handle => {
    promises.push(migrate(handle.versionId));
  });

  return Promise.all(promises);
}

exports.lambdaMigrationsHandler = lambdaMigrationsHandler;
