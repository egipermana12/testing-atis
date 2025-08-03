require("module-alias/register");
require("dotenv").config();
const { Builder, By, until } = require("selenium-webdriver");
const { login, logout } = require("@helpers/loginHelper");
const { handleMenuUtama, handlePengamananPM } = require("@helpers/handleMenu");
const { pilihPemakai } = require("@helpers/pengamanan47/handleFormBaru");
const { expect } = require("chai");

async function loopTesting(driver, searching, error, step = 0) {
  const url = process.env.URL;
  const user = process.env.USER;
  const password = process.env.PASS;

  const userLogin = {
    username: user,
    password: password,
  };

  await driver.get(url);

  //login
  await driver.sleep(500);
  await login(driver, url, userLogin);

  //pastikan halaman muncul
  await driver.sleep(500);
  await handleMenuUtama(driver);

  //link halaman P&M
  await driver.sleep(500);
  await handlePengamananPM(driver);

  //cari barang NIBAR
  await driver.sleep(500);
  await driver.findElement(By.id("fmFiltNibar")).sendKeys(searching.nibar);

  //tombol tampilkan
  await driver.sleep(500);
  const btnTampil = await driver.findElement(By.id("btTampil"));
  await btnTampil.click();

  //checkbox
  await driver.sleep(500);
  const cbnibar = await driver.findElement(By.id("pengamananPeralatan_cb0"));

  // Scroll ke elemen jika perlu
  await driver.sleep(500);
  await driver.executeScript("arguments[0].scrollIntoView(false);", cbnibar);

  // Centang jika belum dicentang
  const isSelected = await cbnibar.isSelected();
  if (!isSelected) {
    await cbnibar.click(); // klik untuk mencentang
  }

  //tekan tombol baru
  await driver.sleep(500);
  const btnBaru = await driver.findElement(
    By.css('a[href="javascript:pengamananPeralatan.formBaru()"]'),
  );
  await driver.sleep(500);
  await driver.executeScript("arguments[0].click();", btnBaru);

  await driver.wait(until.elementLocated(By.id("formSimpanBaru")), 5000);

  //step
  switch (step) {
    case 1:
      await pilihPemakai(driver);
      break;
    default:
      break;
  }

  //tekan tombol simpan
  await driver.sleep(500);
  const btnSimpan = await driver.findElement(By.id("btSimpan"));
  btnSimpan.click();

  await driver.wait(until.alertIsPresent(), 5000);

  // switch ke alert
  const alert = await driver.switchTo().alert();

  // ambil teks dari alert
  const alertText = await alert.getText();

  // expect teksnya sesuai
  expect(alertText).to.equal(error);

  await driver.sleep(2000);

  // tutup alert
  await alert.accept();

  //btn batal
  await driver.sleep(500);
  const btnBatal = await driver.findElement(By.id("btBatal"));
  btnBatal.click();

  //handle logout
  await driver.sleep(500);
  await logout(driver);
}

describe("Form Validation Tests", function () {
  this.timeout(30000); // Biar cukup waktu buat load halaman & captcha

  let driver;

  before(async () => {
    driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
  });

  after(async () => {
    await driver.quit();
  });

  it("should show error nama pemakai kosong", async () => {
    const searching = {
      nibar: "1021",
    };

    const error = "Nama Pemakai belum diisi!";

    await loopTesting(driver, searching, error);
  });

  it("should show error Status Pemakai kosong", async () => {
    const searching = {
      nibar: "1021",
    };

    const error = "Status Pemakai belum diisi!";

    await loopTesting(driver, searching, error, 1);
  });
});
