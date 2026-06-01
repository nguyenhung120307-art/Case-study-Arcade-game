const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score-val");
const topScoreDisplay = document.getElementById("top-score-val");

// Game Variables
let score = 0;
let gameOver = false;
let isPaused = false; // Tracks if the game is paused

// Load Top Score from browser storage (default to 0 if it doesn't exist yet)
let topScore = localStorage.getItem("arcadeTopScore") || 0;
topScoreDisplay.textContent = topScore;

// Player Paddle Properties
const paddle = {
    x: 175,
    y: 460,
    width: 70,
    height: 15,
    speed: 7,
    dx: 0 
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
    // Movement
    if (e.key === "ArrowRight" || e.key === "Right") paddle.dx = paddle.speed;
    if (e.key === "ArrowLeft" || e.key === "Left") paddle.dx = -paddle.speed;

    // Pause functionality toggled with 'P' or 'Spacebar'
    if (e.key === "p" || e.key === "P" || e.key === " ") {
        if (!gameOver) {
            isPaused = !isPaused;
            if (!isPaused) {
                // If we unpaused, kickstart the loop back up
                updateGame();
            }
        }
    }
});

document.addEventListener("keyup", (e) => {
    if (["ArrowRight", "Right", "ArrowLeft", "Left"].includes(e.key)) {
        paddle.dx = 0;
    }
});

function resetTarget() {
    target.x = Math.random() * (canvas.width - target.size);
    target.y = 0;
    target.speed += 0.2; 
}

// The Core Game Loop
function updateGame() {
    // 1. If Game Over, show screen and update high scores
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Courier New";
        ctx.fillText("GAME OVER", 110, 250);
        
        // Check if current score beat the historical top score
        if (score > topScore) {
            topScore = score;
            topScoreDisplay.textContent = topScore;
            localStorage.setItem("arcadeTopScore", topScore); // Save to browser
        }
        return;
    }

    // 2. If Paused, overlay a menu and halt the animation loop
    if (isPaused) {
        ctx.fillStyle = "rgba(22, 33, 62, 0.5)"; // Semi-transparent overlay
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#ffdd67";
        ctx.font = "30px Courier New";
        ctx.fillText("PAUSED", 145, 250);
        return; // Stops running requestAnimationFrame, freezing the state
    }

    // 3. Clear the canvas frame
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 4. Move & Draw Paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    
    ctx.fillStyle = "#00fff5";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // 5. Move & Draw Falling Target
    target.y += target.speed;
    ctx.fillStyle = "#e94560";
    ctx.fillRect(target.x, target.y, target.size, target.size);

    // 6. Collision Detection (Catch)
    if (
        target.y + target.size >= paddle.y &&
        target.x + target.size >= paddle.x &&
        target.x <= paddle.x + paddle.width
    ) {
        score++;
        scoreDisplay.textContent = score;
        resetTarget();
    }

    // 7. Miss Condition (Hit floor)
    if (target.y > canvas.height) {
        gameOver = true;
    }

    // Continue the loop
    requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();
updateGame();
