// npm install selenium-webdriver
//npm install chromedriver
require("chromedriver");
let swd = require("selenium-webdriver");
// build browser
let bldr = new swd.Builder();
// build a tab
let driver = bldr.forBrowser("chrome").build();
// pending 
const challenges = require("./challenges");
const { id, pw } = require("../../credentials");
async function fn() {
    try {
        let GWillBeOpendP = driver.get("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
        await GWillBeOpendP;
        let addImpWaitP = driver.manage().setTimeouts({ implicit: 10000, pageLoad: 10000 });
        await addImpWaitP;
        let emailPromise = driver.findElement(swd.By.css("#input-1"));
        let passwordPromise = driver.findElement(swd.By.css("#input-2"));
        // parallely run promises
        let bothElemP = Promise.all([emailPromise, passwordPromise]);
        let beArr = await bothElemP;
        let EWillBeEP = beArr[0].sendKeys(id);
        let passwordEnteredP = beArr[1].sendKeys(pw);
        let bothKeysWillBeEnteredP = Promise.all([EWillBeEP, passwordEnteredP]);
        await bothKeysWillBeEnteredP;
        await navigatorfn("button.auth-button");
        let adminBtn = await driver.findElement(swd.By.css('a[data-analytics="NavBarProfileDropDown"]'));
        let actions = driver.actions({ async: true });
        await actions.move({ origin: adminBtn }).click().perform();
        await navigatorfn("a[data-analytics='NavBarProfileDropDownAdministration']");
        // Performs release event on target element
        await waitForLoader();
        let liArr = await driver.findElements(swd.By.css("ul.nav-tabs li"));
        await liArr[1].click();
        let challengePageLink = await driver.getCurrentUrl()

        for (let i = 0; i < challenges.length; i++) {
            await driver.get(challengePageLink);
            await createChallenge(challenges[i]);
        }

    } catch (err) {
        console.log(err);
    }
}
fn();
async function waitForLoader() {
    // wait
    let loader = (await driver).findElement(swd.By.css("#ajax-msg"));
    await driver.wait(swd.until.elementIsNotVisible(loader));
}
async function createChallenge(challenge) {
    let createChBtn = await driver.findElement(swd.By.css(".btn.btn-green.backbone.pull-right"));
    await createChBtn.click();
    let suffix = ".CodeMirror textarea";
    let parent = ".CodeMirror div";
    let selectors = ["#name",
        "#preview",
        `#problem_statement-container ${suffix}`,
        `#input_format-container ${suffix}`,
        `#constraints-container ${suffix}`,
        `#output_format-container ${suffix}`,
        "#tags_tag"
    ]
    let allElementsP = selectors.map(function (selector) {
        return driver.findElement(swd.By.css(selector));
    })
    let allElements = await Promise.all(allElementsP);
    await allElements[0].sendKeys(challenge["Challenge Name"]);
    await allElements[1].sendKeys(challenge["Description"]);
    await enterData(allElements[2], `#problem_statement-container ${parent}`, challenge["Problem Statement"]);
    await enterData(allElements[3], `#input_format-container ${parent}`, challenge["Input Format"]);
    await enterData(allElements[4], `#constraints-container ${parent}`, challenge["Constraints"]);
    await enterData(allElements[5], `#output_format-container ${parent}`, challenge["Output Format"]);
    await allElements[6].sendKeys(challenge["Tags"]);
    await allElements[6].sendKeys(swd.Key.ENTER);
    await navigatorfn(".save-challenge.btn.btn-green");
}

async function enterData(element, parentSel, content) {
    //resize
    let parent = await driver.findElement(swd.By.css(parentSel));
    await driver.executeScript("arguments[0].style.height=`${10}px`", parent);
    await element.sendKeys(content);
}

async function navigatorfn(selector) {
    // logic
    try {
        let elemP = driver.findElement(swd.By.css(selector));
        let elem = await elemP;
        let clickP = elem.click();
        await clickP;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}