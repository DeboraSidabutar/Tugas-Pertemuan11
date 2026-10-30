const { By, until } = require("selenium-webdriver");
const locators = require("../locator/LoginPage.locator");

class LoginPage {
  constructor(driver) {
    this.driver = driver;
  }

  getBy(locator) {
    switch (locator.type) {
      case "id":
        return By.id(locator.value);
      case "css":
        return By.css(locator.value);
      case "className":
        return By.className(locator.value);
      case "xpath":
        return By.xpath(locator.value);
      default:
        throw new Error(`Tipe locator tidak didukung: ${locator.type}`);
    }
  }

  async open() {
    await this.driver.get(locators.url);
    await this.driver.wait(
      until.elementLocated(this.getBy(locators.usernameInput)),
      10000
    );
  }

  async login(username, password) {
    await this.driver.findElement(this.getBy(locators.usernameInput))
      .sendKeys(username);

    await this.driver.findElement(this.getBy(locators.passwordInput))
      .sendKeys(password);

    await this.driver.findElement(this.getBy(locators.loginButton))
      .click();
  }

  async getErrorMessage() {
    const errorElement = await this.driver.wait(
      until.elementLocated(this.getBy(locators.errorMessage)),
      5000
    );

    return await errorElement.getText();
  }

  async getPageTitle() {
    const titleElement = await this.driver.wait(
      until.elementLocated(this.getBy(locators.pageTitle)),
      5000
    );

    return await titleElement.getText();
  }

  async getCurrentUrl() {
    return await this.driver.getCurrentUrl();
  }
}

module.exports = LoginPage;