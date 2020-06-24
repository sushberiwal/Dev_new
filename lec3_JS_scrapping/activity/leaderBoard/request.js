
let request = require("request");
let cheerio = require("cheerio");

let fs = require("fs");
let eachMatchHandler = require("./getLeaderBoard.js");

//get html of main page
request("https://www.espncricinfo.com/series/_/id/8039/season/2019/icc-cricket-world-cup" , dataReceiver);
function dataReceiver(err , res , html  ){
    if(err==null && res.statusCode == 200){
    parseFile(html);
    }
    else if(res.statusCode == 404){
        console.log(res.statusCode);
        console.log("Page not Found");
    }
    else{
        console.log(err);
        console.log(res); 
    }

}
function parseFile(html){
    let $ = cheerio.load(html);
    let list = $("ul.list-unstyled.mb-0");
    fs.writeFileSync("list.html" , list);

    let a = $("li.widget-items.cta-link a").attr("href");

    let fullLink = "https://www.espncricinfo.com/"+a;
    
    //get html of all matches page
    request(fullLink , matchPageHandler);
}
function matchPageHandler(err , res , html){
    if(err==null && res.statusCode == 200){
        parseMatchFile(html);
        }
        else if(res.statusCode == 404){
            console.log(res.statusCode);
            console.log("Page not Found");
        }
        else{
            console.log(err);
            console.log(res); 
        }
    
}
function parseMatchFile(html){
    // let $ = cheerio.load(html);
    // fs.writeFileSync("matchFile.html" , html);
    let $ = cheerio.load(html);
    let cards = $(".col-md-8.col-16");
    // console.log(cards.length);
    // fs.writeFileSync("cards.html" , cards);

    // let count=1;
    for(let i=0 ; i<cards.length ; i++){
    //     let venue = $(cards[i]).find(".small.mb-0.match-description").text();
    //     let result = $(cards[i]).find(".extra-small.mb-0.match-description.match-description-bottom").text();
        let allLinks = $(cards[i]).find(".match-cta-container a");
        let link = "https://www.espncricinfo.com/"+$(allLinks[0]).attr("href");
        // console.log("-------------------------------------");
        eachMatchHandler(link);
        // console.log("-------------------------------------");
        //     let match = {
    //         venue : venue,
    //         result : result,    
    //         link : link
    //     }
    //     console.log( count++);
        // console.log( link)
    }
    // let allLinks = $(cards[0]).find(".match-cta-container a");
    // let link = "https://www.espncricinfo.com/"+$(allLinks[0]).attr("href");
    // request(link , scoreCardHandler);
}

// function scoreCardHandler(err , res , html){
//     if(err == null && res.statusCode == 200){
//         scoreCardParse(html);
//     }
//     else if(res.statusCode == 404){
//         console.log(res.statusCode);
//         console.log("Page not Found");
//     }
//     else{
//         console.log(err);
//         console.log(res); 
//     }
// }
// function scoreCardParse(html){
//     let $ = cheerio.load(html);
//     let batsmanInfo  = $(".table.batsman tbody tr");
//     fs.writeFileSync("scoreCard.html" , batsmanInfo);

//     for(let i=0 ; i<batsmanInfo.length ; i++){
//         let batsmanName = $(batsmanInfo[i]).find(".batsman-cell.text-truncate.out").text();
//         let runs= $(batsmanInfo[i]).find(".font-weight-bold").text();
        
//         if(batsmanName != '' && runs != ''){

//             let batsman = {
//                 BatsmanName : batsmanName,
//                 runs : runs
//             }
//             console.log(batsman);
//         }
//     }
// }



