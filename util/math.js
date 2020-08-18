const addCode = `export default function add(a, b) { return a + b; };"This is awesome!";`;

const subCode = `
    import add from './add';
    export { add };
    export function sub(a, b) {
      return add(a, -b);
    };
  `;

module.exports = { addCode, subCode };
