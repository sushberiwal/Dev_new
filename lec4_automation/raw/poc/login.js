// npm install selenium-webdriver
// npm install chrome webdriver

require("chromedriver");

let swd = require("selenium-webdriver");
const { pw, id } = require("../../../credentials");
let gCodeArr , gInputBox , gCodeInputBox;
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
    let pwPromise = driver.findElement(swd.By.css("#input-2"));
    let bothPromise = Promise.all([emailPromise,pwPromise]);
    return bothPromise;
}).then(function (bothArr){
          let idPromise =  bothArr[0].sendKeys(id);
          let pwPromise = bothArr[1].sendKeys(pw);
          return Promise.all([idPromise , pwPromise]);
}).then(function(){
   let loginButtonP = navigator("button.auth-button");
   return loginButtonP;
}).then(function(){
    let ipButtonP = navigator(".card-content #base-card-1-link");
   return ipButtonP;
}).then(function(){
      let moduleElementP = navigator("a[data-attr1='warmup']");
      return moduleElementP;
}).then(function(){
    let allQsP = driver.findElements(swd.By.css(".js-track-click.challenge-list-item"));
    return allQsP;
}).then(function(allQs){
    let hrefArr = [];
    for(let i=0 ; i<allQs.length ; i++){
        let hrefp = allQs[i].getAttribute("href");
        //pushed pending promise and eventually result will come
        hrefArr.push(hrefp);
    }
    //all href promise array
    let allHrefParr = Promise.all(hrefArr);
    return allHrefParr;
}).then(function(hrefArr){
    let quesP = questionSubmitter(hrefArr[0]);
    return quesP;
})
openedPromise.catch(function(err){
    console.log(err);
});
function navigator(selector){
    let promise = new Promise(function (resolve , reject){
        let loginBtnP = driver.findElement(swd.By.css(selector));
        loginBtnP.then(function(loginBtn){
            let clickP = loginBtn.click();
            return clickP;
        }).then(function(){
            resolve();
        }).catch(function (err){
            console.log(err);
            reject(err);
        })
    })
    return promise;
}
function questionSubmitter(qlink) {
    return new Promise(function (resolve, reject) {
        let qpP = driver.get(qlink);
        qpP.then(function () {
            let editorialWillBECLickedP = navigator(
                "a[data-attr2='Editorial']");
            return editorialWillBECLickedP;
        }).then(function () {
            let handleLockP = handleLockBtn();
            return handleLockP;
        }).then(function () {
            // code find
            let codep = getCode();
            return codep;
            // copy 
            // code paste
        }).then(function (code) {
            // console.log(code);
            pasteCode(code);
        })
            .then(function () {
                console.log("Reached editorial page");
                resolve();
            }).catch(function (err) {
                reject(err);
            })
    });
}

function pasteCode(code){
    return new Promise(function(resolve , reject){
        //click on problem tab
        let goToProblemTabP =  navigator("a[data-attr2='Problem']");

        //check custom input box
        goToProblemTabP.then(function(){
            let inputCheckedP = navigator(".custom-input-checkbox");
            return inputCheckedP;
        }).then(function(){
            let inputBoxP = driver.findElement(swd.By.css(".custominput"));
            return inputBoxP;
        }).then(function(inputBox){
            //send keys to custom input box
            gInputBox = inputBox;
            let codeSendP = inputBox.sendKeys(code);
            return codeSendP;
        }).then(function(){
            //Ctrl A
            let ctrlAP = gInputBox.sendKeys(swd.Key.CONTROL + "a");
            return ctrlAP;
        }).then(function(){
            //Ctrl X
            let ctrlXP = gInputBox.sendKeys(swd.Key.CONTROL + "x");
            return ctrlXP;
        }).then(function(){
            let codeBoxP = driver.findElement(swd.By.css(".inputarea"));
            return codeBoxP;
        }).then(function(codeInputBox){
            gCodeInputBox = codeInputBox;
            let ctrlAP = codeInputBox.sendKeys(swd.Key.CONTROL+"a");
            return ctrlAP;
        }).then(function(){
            let ctrlVP = gCodeInputBox.sendKeys(swd.Key.CONTROL+"v");
            return ctrlVP;
        }).then(function(){
            let sumbitBtnP = navigator(".btn.btn-primary.hr-monaco-submit");
            return sumbitBtnP
        })
        .then(function(){
            console.log("Code Submitted");
            resolve();
        }).catch(function(err){
            console.log(err);
            reject(err);
        })        
    })
}

function handleLockBtn( ){
    return new Promise(function (resolve , reject){
        let lockBtnP = driver.findElement(swd.By.css("button.ui-btn.ui-btn-normal.ui-btn-primary .ui-content.align-icon-right"));
        lockBtnP.then(function(lockBtn){
            let actions = driver.actions({async : true});
            let elemPressedP = actions.move({origin : lockBtn}).click().perform();

            return elemPressedP;
        }).then(function(){
            resolve();
        }).catch(function(err){
            console.log("Lock btn not found");
            resolve();
        })
    })
}


function getCode() {
    return new Promise(function (resolve, reject) {
        let h3P = driver.findElements(swd.By.css(".hackdown-content h3"));
        let highlightsP = driver.findElements(swd.By.css(".hackdown-content .highlight"));
        let bArrP = Promise.all([h3P, highlightsP]);
        bArrP
            .then(
                function (bArr) {
                    let h3Arr = bArr[0];
                    let highlightsCodeArr = bArr[1];
                    gCodeArr = highlightsCodeArr;
                    let tPArr = [];

                    for (let i = 0; i < h3Arr.length; i++) {
                        let textP = h3Arr[i].getText();
                        tPArr.push(textP);
                    }
                    let alltEextPArr = Promise.all(tPArr);
                    return alltEextPArr
                }).then(
                    function (allLangArr) {
                        console.log(allLangArr);
                        let index = allLangArr.indexOf("C++");
                        let codePromise = gCodeArr[index].getText();
                        return codePromise;
                        // filter out -> C++
                    }).then(function (code) {
                        resolve(code);
                    }).catch(function (err) {
                        reject(err);
                    })
    })
}





