const _ = require("./lodash-es-core");

const addCode = `export default function add(a, b) { return a + b; };"This is awesome!";`;

const subCode = `
    import add from './add';
    export { add };

    const INCREMENT_VALUE = 1;
    export function sub(a, b) {
      return add(a, -b);
    };
    export function logging(...args) {
      console.log("NONOONONON");
      console.log(...args);
    };
    
    export function increment(a) {
      return a+INCREMENT_VALUE;
    }
  `;
console.log(_.max([4, 2, 8, 6]));

module.exports = { addCode, subCode };
