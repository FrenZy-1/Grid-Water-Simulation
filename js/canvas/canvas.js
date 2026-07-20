var canvas = document.getElementById("mainCanvas");
var ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;

canvas.width = Math.floor(window.innerWidth * dpr);
canvas.height = Math.floor(window.innerHeight * dpr);

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

export { canvas, ctx };
