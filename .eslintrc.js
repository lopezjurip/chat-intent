module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 2017,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true,
    },
  },
  "env": {
    "node": true,
    "browser": true,
    "es6": true,
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "prettier",
    "prettier/react",
  ],
  "plugins": [
    "react",
    "prettier",
  ],
  "rules": {
    "prettier/prettier": ["error", {
      "trailingComma": "es5",
    }],
  },
};
