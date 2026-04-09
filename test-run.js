const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const html = fs.readFileSync("/home/sir/Desktop/herr-ibrahim-alassal/cv_website/index.html", "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously" });
setTimeout(() => {
  console.log("preview length:", dom.window.document.getElementById("cv-preview").innerHTML.length);
  if (dom.window.document.getElementById("cv-preview").innerHTML.length === 0) {
     console.log("Error! Preview is empty.");
  }
}, 1000);
