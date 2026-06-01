const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score-val");

// Game Variables
let score = 0;
let gameOver = false;

// Player Paddle Properties
const paddle = {
    x: 175,
    y: 460,
    width: 70,
    height: 15,
    speed: 7,
    dx: 0 // Direction multiplier
};

// Falling Target Properties
const target = {
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20,
    speed: 3
};

// Listen for keyboard controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Right") paddle.dx = paddle.speed;
    if (e.key === "ArrowLeft" || e.key === "Left") paddle.dx = -paddle.speed;
});

document.addEventListener("keyup", (e) => {
    if (["ArrowRight", "Right", "ArrowLeft", "Left"].includes(e.key)) {
        paddle.dx = 0;
    }
});

// Reset target back to top
function resetTarget() {
    target.x = Math.random() * (canvas.width - target.size);
    target.y = 0;
    target.speed += 0.2; // Slowly increase difficulty
}

// The Core Game Loop
function updateGame() {
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Courier New";
        ctx.fillText("GAME OVER", 110, 250);
        return;
    }

    // 1. Clear the canvas frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Move & Draw Paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    
    ctx.fillStyle = "#00fff5";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // 3. Move & Draw Falling Target
    target.y += target.speed;
    ctx.fillStyle = "#e94560";
    ctx.fillRect(target.x, target.y, target.size, target.size);

    // 4. Collision Detection (Did the paddle catch it?)
    if (
        target.y + target.size >= paddle.y &&
        target.x + target.size >= paddle.x &&
        target.x <= paddle.x + paddle.width
    ) {
        score++;
        scoreDisplay.textContent = score;
        resetTarget();
    }

    // 5. Miss Condition (Did it hit the floor?)
    if (target.y > canvas.height) {
        gameOver = true;
    }

    // Request the browser to run this loop again for the next frame
    requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();