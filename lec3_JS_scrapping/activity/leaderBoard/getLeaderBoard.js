let request = require("request");
let cheerio = require("cheerio");
let fs = require("fs");
let path = require("path");
let count=0;
let leaderBoard = [];
function eachMatchHandler(url){
    count++;
    request(url , dataReceiver);
}



function dataReceiver(err , res , html  ){
    if(err==null && res.statusCode == 200){
        count--;
        parseFile(html);
        if(count==0){
            console.table(leaderBoard);
        }
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
            // console.log( teamName + " highlights ");
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
                    addToLeaderBoard(batsmanName , runs , teamName);
                    // console.log(` ${batsmanName} of ${teamName} scored ${runs} runs in ${balls} balls with a SR of ${strikeRate} and then ${summary}` );
                }
            }
        }
    }
}


function addToLeaderBoard(pName , runs , tName){
    
    runs = Number(runs);
    for(let i=0 ; i<leaderBoard.length ; i++){
        let entry = leaderBoard[i];
        if(entry.name == pName && entry.team == tName){
            entry.runs += runs;
            return;
        }
    }
        let entry = {
            name: pName , 
            runs: runs,
            team: tName
        }
        leaderBoard.push(entry);
    
}

function createTeamDirectory(teamName , batsmanName, runs , balls , strikeRate){
    
    let teamPath = path.join(__dirname , teamName);
    let isTeamPresent = fs.existsSync(teamPath);
    if( isTeamPresent == false){
        fs.mkdirSync(teamPath);
    }

    let filePath = path.join(__dirname , teamName , batsmanName + ".json");
    let isPlayerPresent = fs.existsSync(filePath);
    if(isPlayerPresent == false){
        fs.openSync(filePath, 'w')
        //add data -> runs , balls , strikeRate
        let entries = [];
        let newObj = {
            Runs : runs,
            Balls : balls,
            SR : strikeRate
        };
        entries.push(newObj);
        let stringObj = JSON.stringify(entries);
        fs.writeFileSync(filePath , stringObj);
    }    
    else{
        //append data -> runs , balls , strikeRate
        let content = fs.readFileSync(filePath , "utf-8");

        //now parse it to convert in [object object] form
        let entries = JSON.parse(content);
        
        let newObj = {
            Runs : runs,
            Balls : balls,
            SR : strikeRate
        };

        //push new object in entries(parsed data)
        entries.push(newObj);

        //convert it back to string before pushing
        let stringObj = JSON.stringify(entries);
        
        //replace file with modified file
        fs.writeFileSync(filePath , stringObj);
    }

}

module.exports = eachMatchHandler;