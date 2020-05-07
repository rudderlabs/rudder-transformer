module.exports = {
  extends: ["airbnb", "prettier"],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": ["error"],
    "no-unused-vars": [2, { vars: "local", args: "none" }],
    "no-console": 2
  }
};
