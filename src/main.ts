import "./style.scss";
import { sleep } from "./utils/delay";
import { ICoordinate } from "./intefaces";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const points: ICoordinate[] = [];
const padding = 20;

let hull: ICoordinate[] = [];
let leftMost;
let currentApex;
let index = 0;
let nextApex;
let checking;

function initialize() {
    for (let i = 0; i < 60; i++) {
        let x = Math.floor(Math.random() * (canvas.width - padding - padding) + padding);
        let y = Math.floor(Math.random() * (canvas.height - padding - padding) + padding);
        points.push({ x, y });
    };

    for (let i = 0; i < points.length; i++) {
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(points[i].x, points[i].y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    };

    evaluate();
}

async function evaluate() {
    await sleep(1000);
    points.sort((a, b) => a.x - b.x);
    leftMost = points[0];
    drawFirstApex(leftMost.x, leftMost.y);
    currentApex = leftMost;
    hull.push(currentApex);
    nextApex = points[1];
    index = 2;
    checking = points[index];

    do {
        checking = points[index];

        let a: ICoordinate = {
            x: nextApex.x - currentApex.x,
            y: nextApex.y - currentApex.y,
        };

        let b: ICoordinate = {
            x: checking.x - currentApex.x,
            y: checking.y - currentApex.y,
        };

        // Only z component is required from the cross product
        const z = a.x * b.y - a.y * b.x;
        if (z < 0) nextApex = checking;

        await sleep(30);
        drawComparissonStrokes(currentApex, checking);
        index++;

        if (index === points.length) {
            if (nextApex === leftMost) {
                hull.push(nextApex);
                drawHull(hull);
                return;
            }

            hull.push(nextApex);
            drawHull(hull);
            currentApex = nextApex;
            nextApex = leftMost;
            index = 0;
        }
    } while (index <= points.length);
};

function drawFirstApex(x: number, y: number) {
    ctx.beginPath();
    ctx.fillStyle = "#ff3232";
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
};

async function drawComparissonStrokes(
    currentApex: ICoordinate,
    nextApex: ICoordinate,
    color: string = "rgb(255,255,255, .1)"
) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.moveTo(currentApex.x, currentApex.y);
    ctx.lineTo(nextApex.x, nextApex.y);
    ctx.stroke();
};

function drawHull(hull: ICoordinate[]) {
    for (let i = 0; i < hull.length; i++) {
        ctx.beginPath();
        ctx.strokeStyle = "#0095fffa";
        ctx.lineWidth = 4;
        ctx.moveTo(hull[i].x, hull[i].y);
        if (hull[i + 1]) ctx.lineTo(hull[i + 1].x, hull[i + 1].y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.fillStyle = "#ff3232";
        ctx.arc(hull[i].x, hull[i].y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }
};

canvas.width = window.innerWidth / 1.2;
canvas.height = window.innerHeight / 1.2;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth / 1.1;
    canvas.height = window.innerHeight / 1.1;
});

initialize();
