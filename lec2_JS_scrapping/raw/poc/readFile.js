let fs = require("fs");

//npm install cheerio
//import cheerio module
let cheerio = require("cheerio");

let html = fs.readFileSync("../facts/index.html" , "utf-8");

let $ = cheerio.load(html);

// let h1 = $("h1");

// let h1KaData = h1.text();
// console.log(h1KaData);

let a = $("a");

console.log(a);
