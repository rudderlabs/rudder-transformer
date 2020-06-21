module.exports = {
  extends: ["airbnb-base", "prettier"],
  plugins: ["prettier"],
  env: {
    commonjs: true,
    browser: false,
    es6: true,
    node: true
  },
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018
  },
  rules: {
    "prettier/prettier": "error",
    "no-console": "error"
    // "no-unused-vars": [1, { vars: "local", args: "none" }],
    // "no-var": "off",
    // "vars-on-top": "off",
    // "func-names": "off",
    // "no-plusplus": "off",
    // "prefer-destructuring": "off",
    // camelcase: "off",
    // eqeqeq: "off",
    // "no-undef": "off",
    // "no-param-reassign": "off",
    // "block-scoped-var": "off",
    // "prefer-template": "off",
    // "import/no-dynamic-require": "off",
    // "global-require": "off",
    // "no-nested-ternary": "off"
  }
};
