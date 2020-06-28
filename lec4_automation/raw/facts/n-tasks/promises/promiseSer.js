let fs = require("fs");

let files = ["../f1.txt" , "../f2.txt" , "../f3.txt" , "../f4.txt"];


function readFiles(idx){
    if(idx ==files.length){
        return;
    }

    let readFileP = fs.promises.readFile(files[idx]);
    readFileP.then(function(data){
        console.log(data.toString());
        readFiles(idx+1);
    }).catch(function(err){
        console.log(err);
        return;
    })
}



readFiles(0);