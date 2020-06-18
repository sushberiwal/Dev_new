
let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");

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

    for(let i=0 ; i<cards.length ; i++){
        let venue = $(cards[i]).find(".small.mb-0.match-description").text();
        let result = $(cards[i]).find(".extra-small.mb-0.match-description.match-description-bottom").text();
        let allLinks = $(cards[i]).find(".match-cta-container a");
        let link = "https://www.espncricinfo.com/"+$(allLinks[0]).attr("href");

        let match = {
            venue : venue,
            result : result,    
            link : link
        }
        
        console.log( match);
    }

    
}

