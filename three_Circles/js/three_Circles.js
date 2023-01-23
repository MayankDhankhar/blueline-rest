const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");

const initialPosition = 50;
const verticalGap = 110;
let initialPositions = [];
const radius = 50;
const color = ["green","red","blue"];
let i = 0;

function resetPositions() {
    initialPositions = [
        {x: initialPosition, y: initialPosition},
        {x: initialPosition, y: initialPosition + verticalGap},
        {x: initialPosition, y: initialPosition + verticalGap * 2}
    ];
}

function drawCircles() {
    initialPositions.forEach((pos, i) => {
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = color[i];
        ctx.fill();
    });
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircles();
    initialPositions[i].x += 1;
    if (initialPositions[i].x >= canvas.width - radius) {
        // initialPositions[i].x = 50;
        i = (i+1) % 3;
        if (i === 0) {
            initialPositions = [
                {x: initialPosition, y: initialPosition},
                {x: initialPosition, y: 160},
                {x: initialPosition, y: 270}
            ];
        }
    }
    requestAnimationFrame(animate);
}

resetPositions();
animate();