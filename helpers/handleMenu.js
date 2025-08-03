const { By, until } = require("selenium-webdriver");

async function handleMenuUtama(driver) {
  const permen47 = await driver.findElement(
    By.css('a[href="pages.php?Pg=pemeliharaan_daftar"]')
  );
  await driver.executeScript("arguments[0].click();", permen47);
}

async function handlePengamananPM(driver) {
  // Tunggu dropdown utama (PENGAMANAN)
  const dropdownTrigger = await driver.findElement(
    By.css(".dropdown > span > a")
  );

  // Hover ke dropdown untuk menampilkan isinya
  await driver
    .actions({ bridge: true })
    .move({ origin: dropdownTrigger })
    .perform();
  await driver.sleep(500); // waktu jeda agar dropdown muncul

  // Tunggu hingga link 'P & M' tersedia
  const pnmLink = await driver.wait(
    until.elementLocated(By.css('a[href="pages.php?Pg=pengamananPeralatan"]')),
    5000
  );

  // Gunakan executeScript agar klik berhasil meski dropdown overlay
  await driver.executeScript("arguments[0].click();", pnmLink);
}

module.exports = {
  handleMenuUtama,
  handlePengamananPM,
};
