let fs = require("fs");
const { Console } = require("console");
let files = ["../f1.txt" , "../f2.txt" , "../f3.txt" , "../f4.txt"];


console.log("before");
function readFiles(idx){
    if(idx == files.length){
        return;
    }
    fs.readFile(files[idx] , function(err , data){
        console.log("Data :" + data);
    })
    readFiles(idx+1);
}
readFiles(0);

console.log("after");