const LOGIN_LOCATORS = {
  url: "https://www.saucedemo.com/",

  usernameInput: {
    type: "id",
    value: "user-name",
  },

  passwordInput: {
    type: "id",
    value: "password",
  },

  loginButton: {
    type: "id",
    value: "login-button",
  },

  errorMessage: {
    type: "css",
    value: '[data-test="error"]',
  },

  pageTitle: {
    type: "className",
    value: "title",
  },
};

module.exports = LOGIN_LOCATORS;