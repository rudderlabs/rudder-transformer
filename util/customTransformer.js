var jsonQ = require("jsonq");
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
  return res;
}

async function userTransformHandler(jsonQobj) {
  const rl_destination = jsonQobj.find("rl_message").value()[0].rl_destination;
  const versionId =
    rl_destination.Transformations &&
    rl_destination.Transformations[0] &&
    rl_destination.Transformations[0].VersionID;
  if (versionId) {
    try {
      const res = await getTransformationCode(versionId);
      if (res) {
        const tr = await runUserTransform(jsonQobj.value()[0], res.code);
        return jsonQ(tr);
      }
    } catch (error) {
      // TODO: Handle error cases: Throw error or send unmodified events
      console.log(error);
      throw error;
    }
  }
  return jsonQobj;
}

exports.userTransformHandler = userTransformHandler;
