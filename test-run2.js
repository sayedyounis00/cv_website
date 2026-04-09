const fs = require('fs');
const jsdom = require("jsdom");
const { JSDOM, VirtualConsole } = jsdom;
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (error) => {
  console.error("JSDOM Error:", error);
});
virtualConsole.sendTo(console);

const html = fs.readFileSync("/home/sir/Desktop/herr-ibrahim-alassal/cv_website/index.html", "utf8");
const dom = new JSDOM(html, { runScripts: "dangerously", virtualConsole });
setTimeout(() => {
  console.log("preview HTML length:", dom.window.document.getElementById("cv-preview").innerHTML.length);
}, 1000);
