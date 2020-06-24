let cheerio = require("cheerio");
let request = require("request");

let fs = require("fs");

let url = "https://www.espncricinfo.com/series/8039/scorecard/1144529/england-vs-australia-2nd-semi-final-icc-cricket-world-cup-2019";
request(url , dataReceiver);

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
    let wts = $(".summary span").text();
    let wtName = wts.split("won").shift().trim();

    let innings = $(".match-scorecard-page .card.content-block.match-scorecard-table .Collapsible");

    for(let i=0 ; i<innings.length ; i++){

        let teamName = $(innings[i]).find("h5").text();
        teamName = teamName.split("Innings").shift().trim();
        
        if(wtName == teamName){
            console.log( teamName + " highlights ");
            let batsmanDetails = $(innings[i]).find("table.table.batsman tbody tr");
            for(let i=0 ; i<batsmanDetails.length ; i++){
                
                let columnDetails = $(batsmanDetails[i]).find("td");
        
                if( $(columnDetails[0]).hasClass("batsman-cell") ){
                    let batsmanName = $(columnDetails[0]).text();
                    let summary = $(columnDetails[1]).text();
                    let runs = $(columnDetails[2]).text();
                    let balls = $(columnDetails[3]).text();
                    let strikeRate = $(columnDetails[7]).text();
                    // createTeamDirectory(teamName , batsmanName , runs , balls , strikeRate);
                    // createPlayerFile(batsmanName);
                    console.log(` ${batsmanName} of ${teamName} scored ${runs} runs in ${balls} balls with a SR of ${strikeRate} and then ${summary}` );
                }
            }
        }
    }

}

