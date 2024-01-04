
import webdriver from 'selenium-webdriver';
require("chromedriver");

const verifyDoctorRegisterNumber = async (year, number) => {
  let flag = 0;
  const driver = await new webdriver.Builder().forBrowser("chrome").build();

  await driver.get(
    "https://www.nmc.org.in/information-desk/indian-medical-register/"
  );

  await driver
    .findElement(webdriver.By.xpath('//a[@href="#registrationNumber"]'))
    .click();

  await driver.manage().setTimeouts({ implicit: 1000 });

  await driver
    .findElement(webdriver.By.xpath('//input[@id="doct_regdNo"]'))
    .sendKeys(number);

  await driver
    .findElement(webdriver.By.xpath('//button[@id="doctor_regdno_details"]'))
    .click();

  await driver.manage().setTimeouts({ implicit: 5000 });

  const body = await driver
    .findElement(
      webdriver.By.xpath(
        '//table[@class="table table-bordered no-footer dataTable"]'
      )
    )
    .findElement(webdriver.By.xpath("tbody"))
    .findElements(webdriver.By.xpath("tr"));

  for (var n of body) {
    const list = await n.findElements(webdriver.By.xpath("td"));

    const date = await list[1].getText();

    if (date === year) {
      flag++;
      list.forEach(async (x) => {
        ans = await x.getText();

        console.log(ans);
      });
      break;
    }
  }

  if (flag == 0) {
    console.log("false");
  }

  return flag
  //driver.close();
};

export { verifyDoctorRegisterNumber };
