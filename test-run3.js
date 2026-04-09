const fs = require('fs');
const html = fs.readFileSync("/home/sir/Desktop/herr-ibrahim-alassal/cv_website/index.html", "utf8");
const match = html.match(/<script>([\s\S]*?)<\/script>/);
let jsCode = match[1];

let domEls = {};

global.document = {
  getElementById: (id) => {
    if (!domEls[id]) domEls[id] = { innerHTML: '', textContent: '', value: '', style: {}, focus: () => {}, querySelectorAll: () => [], classList: { add: () => {}, remove: () => {} } };
    return domEls[id];
  },
  createElement: (tag) => {
    return { innerHTML: '', textContent: '', style: {}, classList: { toggle: () => {} }, value: '', appendChild: () => {}, querySelector: () => ({ classList: { toggle: () => {} }}) };
  },
  addEventListener: () => {},
  querySelectorAll: () => []
};
global.window = { print: () => {} };

jsCode = jsCode.replace('document.addEventListener("DOMContentLoaded", init);', '');

try {
  eval(jsCode);
  init();
  console.log("preview length:", document.getElementById("cv-preview").innerHTML.length);
} catch (e) {
  console.error("Runtime Error:", e);
}
