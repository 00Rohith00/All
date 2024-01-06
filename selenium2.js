import chrome from 'chromedriver';
import {Builder , By} from 'selenium-webdriver';

const verifyDoctorRegisterNumber = async (year, number,medicalCouncil) => {
    let flag = 0;
  
    const driver = await new Builder().forBrowser("chrome").build();
  
    await driver.get("https://www.nmc.org.in/information-desk/indian-medical-register/");
  
    await driver.findElement(By.xpath('//a[@href="#registrationNumber"]')).click();
  
    await driver.manage().setTimeouts({ implicit: 1000 });
  
    await driver.findElement(By.xpath('//input[@id="doct_regdNo"]')).sendKeys(number);
  
    await driver.findElement(By.xpath('//button[@id="doctor_regdno_details"]')).click();
  
    await driver.manage().setTimeouts({ implicit: 5000 });
  
    const body = await driver.findElement(By.xpath('//table[@class="table table-bordered no-footer dataTable"]')).findElement(By.xpath("tbody")).findElements(By.xpath("tr"));
  
    for (var n of body)
     {
            const list = await n.findElements(By.xpath("td"));
    
            const period = await list[1].getText();
    
            const state = await list[3].getText();
    
            if (period === year  && state === medicalCouncil) 
            {
                flag++;
                list.forEach(async (x) => {
                    var ans = await x.getText();
                    console.log(ans);
                });
                break;
            }
      }
     if (flag == 0) { console.log("false"); }
  
     return flag
  
     //driver.close();
};

verifyDoctorRegisterNumber("1960" , "12345", "Madras Medical Council")

export { verifyDoctorRegisterNumber };


