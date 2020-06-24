// npm install selenium-webdriver
// npm install chrome webdriver

require("chromedriver");

let swd = require("selenium-webdriver");
const { pw, id } = require("../../../credentials");


//build browser
let bldr = new swd.Builder();

//build a tab
let driver = bldr.forBrowser("chrome").build();

let openedPromise = driver.get("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
openedPromise.then(function(){
    return driver.manage().setTimeouts({implicit:10000});
}).then(function(){
    console.log("HomePage Opened");
    let emailPromise = driver.findElement(swd.By.css("#input-1"));
    return emailPromise;
}).then(function (emailElement){
    return emailElement.sendKeys(id);
}).then(function(){
    let pwPromise = driver.findElement(swd.By.css("#input-2"));
    return pwPromise;
}).then(function(pwElement){
    return pwElement.sendKeys(pw);
}).then(function(){
    let loginButtonP = driver.findElement(swd.By.css("button.auth-button"));
    return loginButtonP;
}).then(function(loginElement){
    return loginElement.click();
}).then(function(){
    return driver.findElement(swd.By.css(".card-content #base-card-1-link"));
}).then(function(ipElement){
    return ipElement.click();
}).then(function(){
    console.log("Reached IP Module");
})

openedPromise.catch(function(err){
    console.log(err);
});

