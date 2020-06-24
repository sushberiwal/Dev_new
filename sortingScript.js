let fs = require("fs");
let path = "D:/Users/Sushant/Downloads";
fs.readdir( path , cb);

function cb(err , content){
    if(err){
        console.log(err);
    }
    else{
        content.forEach(function (file) {
            let ext = file.split(".").pop()
            if(ext == txt){
               
            }
            else if(ext ==jpeg || ext == jpg){

            }
            else if(ext == exe){

            }
            else if(ext == pdf){

            }
            else{

            }
        });
}
}