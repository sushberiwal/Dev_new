
let fs = require("fs");

let content = fs.readFileSync( "./file.txt"  , callBack );

function callBack(err , content){
    return content;
}

console.log(content.toString());

