const fs = require("fs");
const path = require("path");

class ScreenshotPage {
  constructor(driver) {
    this.driver = driver;
    this.currentDir = path.resolve(__dirname, "../../screenshots/current");

    fs.mkdirSync(this.currentDir, { recursive: true });
  }

  async takeScreenshot(filename) {
    const filePath = path.join(this.currentDir, filename);
    const screenshot = await this.driver.takeScreenshot();

    fs.writeFileSync(filePath, screenshot, "base64");

    console.log(`Screenshot tersimpan: ${filePath}`);
    return filePath;
  }

  async takeElementScreenshot(selector, filename) {
    const { By, until } = require("selenium-webdriver");
    const element = await this.driver.wait(
      until.elementLocated(By.css(selector)),
      5000
    );

    await this.driver.wait(until.elementIsVisible(element), 5000);

    const screenshot = await element.takeScreenshot(true);
    const filePath = path.join(this.currentDir, filename);

    fs.writeFileSync(filePath, screenshot, "base64");

    console.log(`Screenshot elemen tersimpan: ${filePath}`);
    return filePath;
  }
}

module.exports = ScreenshotPage;