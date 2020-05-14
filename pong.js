let canvas;
let canvasContext;

let ballX = 300;
let ballY = 400;
let ballSpeedX = 8;
let ballSpeedY = 3;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const PADDLE2_SPEED = 6;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');
    canvasContext.font = "26px Verdana";

    const framesPerSecond = 60;
    setInterval(function () {
        moveEverything();
        drawEverything()
    }, 1000 / framesPerSecond);

    showingWinScreen = true;
    canvas.addEventListener('mousedown', handleMouseClick);
    canvas.addEventListener('mousemove',
        function (evt) {
            const mousePos = calculateMousePos(evt);
            paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
        })

};

function computerMovement() {
    const paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += PADDLE2_SPEED;
    } else if (paddle2YCenter > ballY + 35) {
        paddle2Y -= PADDLE2_SPEED;
    }
}

function moveEverything() {
    if (showingWinScreen) {
        return;
    }

    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    checkRightSide();
    checkLeftSide();

    // if ball hits top or bottom of canvas
    if (ballY > canvas.height || ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function checkRightSide() {
    // if ball goes off to the right side
    if (ballX > canvas.width - PADDLE_WIDTH) {
        if (ballY > (paddle2Y - 5) && ballY < (paddle2Y + PADDLE_HEIGHT + 5)) {
            ballSpeedX = -ballSpeedX;

            const deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * .35;
        } else {
            player1Score++;
            ballReset();
        }
    }
}

function checkLeftSide() {
    // if ball goes off to the left side
    if (ballX < PADDLE_WIDTH) {
        if (ballY > paddle1Y && ballY < (paddle1Y + PADDLE_HEIGHT)) {
            ballSpeedX = -ballSpeedX;

            const deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * .35;

        } else {
            player2Score++;
            ballReset();
        }
    }
}

function drawNet() {
    for (let i = 0; i < canvas.height; i += 40) {
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
    }
}

function drawEverything() {
    colorRect(0, 0, canvas.width, canvas.height, 'black');

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';
        if (player1Score >= WINNING_SCORE) {
            canvasContext.fillText("Left player won!", 280, 200);
        } else if (player2Score >= WINNING_SCORE) {
            canvasContext.fillText("Right player won!", 280, 200);
        }
        canvasContext.fillText("Click to continue", 285, 500);
        return;
    }

    drawNet();

    colorRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    colorRect(canvas.width - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT, 'white');
    colorCircle(ballX, ballY, 7, 'white');

    canvasContext.fillStyle = 'blue';
    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillStyle = 'red';
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

function calculateMousePos(evt) {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseX = evt.clientX - rect.left - root.scrollLeft;
    const mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };
}

function ballReset() {
    if (player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballSpeedY = 0;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function handleMouseClick() {
    if (showingWinScreen) {
        player1Score = player2Score = 0;
        showingWinScreen = false;
    }
}