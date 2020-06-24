let fs = require("fs");

//we dont pass callback in promises
let promiseData = fs.promises.readFile("./f1.txt");

//start => pending

console.log(promiseData);


    //when promise resolves to data
    promiseData.then(function(data){
        console.log("Inside then");
        console.log(data);
    })

    //when promise resolve to error
    promiseData.catch(function(err){
        console.log("Inside catch");
        console.log(err);
    })


    //tries chechking promiseData after 2 seconds
    //if promise is resolved then we will get buffer data
    // else pending promise will be received
    setTimeout(function(){
        console.log(promiseData);
    } , 2000);

