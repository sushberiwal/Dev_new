let pp = require("puppeteer");
const { id, pw } = require("../../credentials");


async function fn() {

    //headless browser
    let browser = await pp.launch({
        headless: false,
        defaultViewport: false,
        args: ["--start-maximized"]
        // slowMo: 50
    });

    let allTabs = await browser.pages();
    let tab = allTabs[0];
    await tab.goto("https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login");
    await tab.type("#input-1", id);
    await tab.type("#input-2", pw);
    await Promise.all([
        tab.waitForNavigation({ waitUntil: "networkidle0" }),
        tab.click("button.auth-button")
    ])
    await tab.click('a[data-analytics="NavBarProfileDropDown"]')
    await Promise.all([
        tab.waitForNavigation({ waitUntil: "networkidle0" }),
        tab.click("a[data-analytics='NavBarProfileDropDownAdministration']")
    ])
    let liArr = await tab.$$("ul.nav-tabs li");
    await liArr[1].click();
    // let challengePageLink = await tab.url();
    await openAllTabs(tab , browser);


    //my code for going to every page and adding moderator
    // await addAllModerators(tab,browser);

}

async function addAllModerators(tab,browser){
    while(true){
        await openAllTabs(tab, browser);
        let nextPageLink = await getNextPageLink(tab);
        if(nextPageLink==null){
            return;
        }
        await tab.goto(nextPageLink);
    }
}
async function getNextPageLink(tab){
    await tab.waitForSelector(".pagination li a", { visible: true });
    let paginationListPromise = await tab.$$(".pagination li a");
    // console.log(paginationListPromise);
    let allPagesLinksPromise = [];
    for(let i=0 ; i<paginationListPromise.length ; i++){
        let link = tab.evaluate(function (elem) {
            return elem.getAttribute("href")
        }, paginationListPromise[i]);
        allPagesLinksPromise.push(link);
    }
    let allLinks = await Promise.all(allPagesLinksPromise);
    if(allLinks[allLinks.length-2] == null){
        return null;
    }
    else{
        return `https://www.hackerrank.com${allLinks[allLinks.length-2]}`;
    }
}

async function openAllTabs(tab, browser) {
    await tab.waitForSelector(".backbone.block-center", { visible: true });
    //find all question elements
    let allQues = await tab.$$(".backbone.block-center");

    let allLinksPromise = [];
    //find all links from questions
    for (let i = 0; i < allQues.length; i++) {

        let link = tab.evaluate(function (elem) {
            return elem.getAttribute("href")
        }, allQues[i]);
        allLinksPromise.push(link);
    }

    let allLinks = await Promise.all(allLinksPromise);

    let completeLinks = allLinks.map(function (link) {
        return `https://www.hackerrank.com${link}`;
    })

    let allModeratorAddPromise = [];
    for (let i = 0; i < completeLinks.length; i++) {
        let newTab = await browser.newPage();
        let modAdderPromise = moderatorAdderSinglePage(newTab, completeLinks[i])
        allModeratorAddPromise.push(modAdderPromise);
    }
    await Promise.all(allModeratorAddPromise);
    //till here moderators are added for first page
    //now proceed for rest of the pages recursively
    let paginationListPromise = await tab.$$(".pagination li");
    let nextPage = paginationListPromise[paginationListPromise.length-2];
    let isDisabled = await tab.evaluate(function(element){return element.getAttribute("class")} , nextPage);
    if(isDisabled == "Disabled"){
        return;
    }
    await Promise.all([ tab.waitForNavigation({waitUntil:"networkidle0"}) , nextPage.click()]);
    await openAllTabs(tab , browser);

    

}

function moderatorAdderSinglePage(newTab, link) {

    return new Promise(function (resolve, reject) {
        newTab.goto(link, { waitUntil: "networkidle0" })
            .then(function () {
                let waitForModeratorPromise = newTab.waitForSelector("li[data-tab='moderators']", { visible: true });
                return waitForModeratorPromise;
            }).then(function () {
                //click on moderator tab
                //navigation wait
                let navigatorPromise = Promise.all([newTab.click("li[data-tab='moderators']"), newTab.waitForNavigation({ waitUntil: "networkidle0" })]);
                return navigatorPromise;
            }).then(function () {
                //wait for selector
                let waitForModePromise = newTab.waitForSelector("#moderator", { visible: true });
                return waitForModePromise;
            }).then(function () {
                //select text field on moderator
                //type moderator name
                let keyEnteredPromise = newTab.type("#moderator", "abcdef");
                return keyEnteredPromise;
            }).then(function () {
                //press enter
                let waitForEnterPromise = newTab.keyboard.press("Enter");
                return waitForEnterPromise;
            }).then(function () {
                //save changes
                let savePromise = newTab.click(".save-challenge.btn.btn-green");
                return savePromise;
            }).then(function () {
                //close tab
                let closeTabPromise = newTab.close();
                return closeTabPromise;
            }).then(function () {
                console.log("succesfully added moderator");
                resolve();
            })
            .catch(function (err) {
                console.log(err);
                reject(err);
            })

    })
}

fn();