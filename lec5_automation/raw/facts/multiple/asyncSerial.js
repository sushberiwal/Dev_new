let fs = require("fs");
console.log("before");

fs.readFile("./f1.txt" , function(err , data){
    console.log("f1 ka data : " + data);
    fs.readFile("./f2.txt" , function(err , data){
        console.log("f2 ka data : " + data);
        fs.readFile("./f3.txt" , function(err , data){
            console.log("f3 ka data : " + data);
        })
    })
})

console.log("after");