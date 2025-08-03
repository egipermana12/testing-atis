// helpers/loginHelper.js
const { By, until } = require("selenium-webdriver");

async function login(driver, url, userLogin) {
  await driver.get(url);

  await driver.findElement(By.id("user")).sendKeys(userLogin.username);
  await driver.findElement(By.id("password")).sendKeys(userLogin.password);

  const buttonLogin = await driver.findElement(By.id("bt_ok"));
  await buttonLogin.click();
}

async function logout(driver) {
  const logout = await driver.wait(
    until.elementLocated(By.css('a[href="index.php?Pg=LogOut"]')),
    10000,
  );

  await driver.wait(until.elementIsVisible(logout), 5000);

  await logout.click();
}

module.exports = {
  login,
  logout,
};
