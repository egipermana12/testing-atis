const { By, until } = require("selenium-webdriver");

async function pilihPemakai(driver) {
    await driver.sleep(500);

    const btnPilihPemakai = await driver.findElement(
        By.id("fmnama_pemakai_button"),
    );
    btnPilihPemakai.click();

    await driver.sleep(500);
    await driver.wait(until.elementLocated(By.id("PegawaiPilih_Form")), 5000);

    //checkbox
    await driver.sleep(500);
    const crpegawai = await driver.findElement(By.id("PegawaiPilih_cb0"));

    // Scroll ke elemen jika perlu
    await driver.sleep(500);
    await driver.executeScript(
        "arguments[0].scrollIntoView(false);",
        crpegawai,
    );

    // Centang jika belum dicentang
    const isSelected = await crpegawai.isSelected();
    if (!isSelected) {
        await crpegawai.click(); // klik untuk mencentang
    }

    await driver.sleep(1000);
    await driver.executeScript("PegawaiPilih.windowSave();");
}

module.exports = {
    pilihPemakai,
};
