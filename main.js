var canvas = document.getElementById("mainCanvas");
console.log(canvas);

var ctx = canvas.getContext("2d");
console.log(ctx);

const dpi = window.devicePixelRatio || 1;
console.log(dpi);

canvas.width = window.innerWidth * dpi;
canvas.height = window.innerHeight * dpi;
console.log("Canvas Width: " + canvas.width);
console.log("Canvas Height: " + canvas.height);

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";
console.log("Canvas Style Width: " + canvas.style.width);
console.log("Canvas Style Height: " + canvas.style.height);
