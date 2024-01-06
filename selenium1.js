// Demo

// Required packages: { node } { selenium-webdriver } { chromedriver } 

const webdriver = require('selenium-webdriver');
require("chromedriver");

(async()=>{

const driver = await new webdriver.Builder().forBrowser("chrome").build();

await driver.get("https://www.nmc.org.in/information-desk/indian-medical-register/");

await driver.findElement(webdriver.By.xpath('//a[@href="#registrationNumber"]')).click();

await driver. manage(). setTimeouts( { implicit: 1000 } );

await driver.findElement(webdriver.By.xpath('//input[@id="doct_regdNo"]')).sendKeys('12345');

await driver.findElement(webdriver.By.xpath('//button[@id="doctor_regdno_details"]')).click();

await driver. manage(). setTimeouts( { implicit: 5000 } );

const heading = await driver.findElement(webdriver.By.xpath('//table[@class="table table-bordered no-footer dataTable"]')).findElement(webdriver.By.xpath('thead')).findElement(webdriver.By.xpath('tr')).findElements(webdriver.By.xpath('th'));

for(var n of heading )
{
     var result  = await n.getText();
     console.log(result)
}

console.log("----------------------------------------------------------------------------------");

const body = await driver.findElement(webdriver.By.xpath('//table[@class="table table-bordered no-footer dataTable"]')).findElement(webdriver.By.xpath('tbody')).findElements(webdriver.By.xpath('tr'));

for(var n of body )
{

    const list =  await n.findElements(webdriver.By.xpath('td'));

    list.forEach(async (x)=>{

        ans = await x.getText()
        console.log(ans)
    
    });
    console.log("----------------------------------------------------------------------------------");
    
}

//driver.close();

})()
