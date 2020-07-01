// npm install selenium-webdriver
// npm install chrome webdriver

require("chromedriver");

let swd = require("selenium-webdriver");
const { pw, id } = require("../../../credentials");

//build browser
let bldr = new swd.Builder();
//build a tab
let driver = bldr.forBrowser("chrome").build();


async function fn() {
    try {

        let openedPromise = driver.get("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
        await openedPromise;
        let setTime = driver.manage().setTimeouts({ implicit: 10000 });
        await setTime;
        let emailPromise = driver.findElement(swd.By.css("#input-1"));
        let passPromise = driver.findElement(swd.By.css("#input-2"));
        //paraller promises
        let bothPromise = Promise.all([emailPromise, passPromise]);
        let bothArr = await bothPromise;
        let idPromise = bothArr[0].sendKeys(id);
        let pwPromise = bothArr[1].sendKeys(pw);    
        let bothKeysEntered = Promise.all([idPromise, pwPromise]);
        await bothKeysEntered;
        let loginButtonP = driver.findElement(swd.By.css("button.auth-button"));
        await loginButtonP;
        let clickP = loginButtonP.click();
        await clickP;

    }
    catch (err) {
        console.log(err);
    }
}

fn();
