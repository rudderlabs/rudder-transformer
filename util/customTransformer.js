const ivm = require("isolated-vm");
var { getTransformationCode } = require("../util/customTransforrmationsStore");

async function runUserTransform(events, code) {
  // TODO: Decide on the right value for memory limit
  const isolate = new ivm.Isolate({ memoryLimit: 8 });
  const context = await isolate.createContext();
  const customScript = await isolate.compileScript(code + "");
  customScript.run(context).catch(err => console.log(err));
  const fnRef = await context.global.get("transform");
  const sharedMessagesList = new ivm.ExternalCopy(events).copyInto({
    transferIn: true
  });
  const res = await fnRef.apply(context.global.derefInto(), [
    sharedMessagesList
  ]);
  isolate.dispose();
  return res;
}

async function userTransformHandler(events) {
  const destination = events[0].destination;
  const versionId =
    destination.Transformations &&
    destination.Transformations[0] &&
    destination.Transformations[0].VersionID;
  if (versionId) {
    try {
      const res = await getTransformationCode(versionId);
      if (res) {
        const tr = await runUserTransform(events, res.code);
        return JSON.parse(tr);
      }
    } catch (error) {
      // TODO: Handle error cases: Throw error or send unmodified events
      console.log(error);
      throw error;
    }
  }
  return events;
}

exports.userTransformHandler = userTransformHandler;
