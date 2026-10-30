console.log("Tugas Pertemuan 11 - Debora Sidabutar");
console.log("-------------------------------------");

const { Builder } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");
const assert = require("assert");

const LoginPage = require("../page/LoginPage");
const ScreenshotPage = require("../page/ScreenshotPage");
const VisualRegressionHelper = require("../../utilities/VisualRegressionHelper");

describe("SauceDemo Login Automation - POM", function () {
  this.timeout(60000);

  let driver;
  let loginPage;
  let screenshotPage;
  let visualRegression;

  beforeEach(async function () {
    const options = new chrome.Options();

    driver = await new Builder()
      .forBrowser("chrome")
      .setChromeOptions(options)
      .build();

    await driver.manage().window().setRect({
      width: 1365,
      height: 900,
      x: 0,
      y: 0,
    });

    loginPage = new LoginPage(driver);
    screenshotPage = new ScreenshotPage(driver);
    visualRegression = new VisualRegressionHelper();

    await loginPage.open();
  });

  afterEach(async function () {
    if (driver) {
      await driver.quit();
    }
  });

  it("Positive - should login successfully with standard_user", async function () {
    await loginPage.login("standard_user", "secret_sauce");

    await driver.wait(async function () {
      return (await loginPage.getCurrentUrl()).includes("/inventory.html");
    }, 10000);

    assert.ok(
      (await loginPage.getCurrentUrl()).includes("/inventory.html"),
      "Seharusnya berhasil masuk ke halaman inventory"
    );

    assert.strictEqual(
      await loginPage.getPageTitle(),
      "Products",
      "Judul halaman seharusnya Products"
    );

    await driver.sleep(1000);
    await screenshotPage.takeScreenshot("login-success.png");

    const result = visualRegression.compareImages("login-success.png");

    assert.ok(
      result.match,
      `Visual regression gagal: perbedaan ${result.percentage}%`
    );
  });

  it("Negative - should reject locked_out_user", async function () {
    await loginPage.login("locked_out_user", "secret_sauce");

    const errorMessage = await loginPage.getErrorMessage();

    assert.ok(
      errorMessage.toLowerCase().includes("locked out"),
      "Pesan error seharusnya menjelaskan bahwa user terkunci"
    );

    assert.ok(
      !(await loginPage.getCurrentUrl()).includes("/inventory.html"),
      "User yang terkunci tidak boleh masuk ke halaman inventory"
    );

    await driver.sleep(1000);
    await screenshotPage.takeScreenshot("login-locked.png");

    const result = visualRegression.compareImages("login-locked.png");

    assert.ok(
      result.match,
      `Visual regression gagal: perbedaan ${result.percentage}%`
    );
  });
});