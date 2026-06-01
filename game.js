const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score-val");
const topScoreDisplay = document.getElementById("top-score-val");

// Game Variables
let score = 0;
let gameOver = false;
let isPaused = false;
let isNewRecord = false; 

// Create and Preload the Celebration Image
const celebrationImg = new Image();
celebrationImg.src = "king-nasir.jpg"; // <-- Keep this matching your image file name

// Load Top Score from browser storage
let topScore = parseInt(localStorage.getItem("arcadeTopScore")) || 0;
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

// --- NEW FEATURE: RETRY FUNCTION ---
// This resets the state completely to restart a fresh game
function retryGame() {
    score = 0;
    gameOver = false;
    isPaused = false;
    isNewRecord = false;
    
    // Reset HUD text
    scoreDisplay.textContent = score;
    
    // Reset object positions
    paddle.x = 175;
    paddle.dx = 0;
    
    target.x = Math.random() * (canvas.width - target.size);
    target.y = 0;
    target.speed = 3; // Reset speed difficulty back to baseline
    
    // Restart the animation loop engine
    updateGame();
}

// Listen for keyboard controls
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "Right") paddle.dx = paddle.speed;
    if (e.key === "ArrowLeft" || e.key === "Left") paddle.dx = -paddle.speed;

    // Handle P key (Only for pausing)
    if (e.key === "p" || e.key === "P") {
        if (!gameOver) {
            isPaused = !isPaused;
            if (!isPaused) updateGame();
        }
    }

    // Handle Spacebar (Pause during gameplay, Retry on Game Over)
    if (e.key === " ") {
        if (gameOver) {
            // Prevent spacebar from scrolling down the webpage window
            e.preventDefault(); 
            retryGame();
        } else {
            isPaused = !isPaused;
            if (!isPaused) updateGame();
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
    // --- GAME OVER STATE ---
    if (gameOver) {
        ctx.fillStyle = "#16213e";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (isNewRecord) {
            ctx.strokeStyle = "#ffdd67";
            ctx.lineWidth = 5;
            ctx.strokeRect(40, 60, 320, 320);
            ctx.drawImage(celebrationImg, 45, 65, 310, 310);

            ctx.fillStyle = "#ffdd67";
            ctx.font = "bold 22px Courier New";
            ctx.fillText("NEW RECORD DETECTED!", 75, 35);

            ctx.fillStyle = "#ffffff";
            ctx.font = "18px Courier New";
            ctx.fillText(`Crown the Champ: ${score}!`, 100, 415);
        } else {
            ctx.fillStyle = "#e94560";
            ctx.font = "30px Courier New";
            ctx.fillText("GAME OVER", 110, 200);
            
            ctx.fillStyle = "white";
            ctx.font = "18px Courier New";
            ctx.fillText(`Score: ${score}`, 155, 250);
        }

        // --- NEW VISUAL INSTRUCTION ---
        ctx.fillStyle = "#00fff5";
        ctx.font = "bold 16px Courier New";
        ctx.fillText("Press SPACEBAR to Play Again", 65, 460);
        
        return;
    }

    // --- PAUSE STATE ---
    if (isPaused) {
        ctx.fillStyle = "rgba(22, 33, 62, 0.5)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#ffdd67";
        ctx.font = "30px Courier New";
        ctx.fillText("PAUSED", 145, 250);
        return;
    }

    // --- NORMAL GAMEPLAY STATE ---
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Paddle
    paddle.x += paddle.dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width;
    ctx.fillStyle = "#00fff5";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    // Falling Target
    target.y += target.speed;
    ctx.fillStyle = "#e94560";
    ctx.fillRect(target.x, target.y, target.size, target.size);

    // Collision Detection
    if (
        target.y + target.size >= paddle.y &&
        target.x + target.size >= paddle.x &&
        target.x <= paddle.x + paddle.width
    ) {
        score++;
        scoreDisplay.textContent = score;
        resetTarget();
    }

    // Floor Collision / Trigger Game Over
    if (target.y > canvas.height) {
        gameOver = true;
        if (score > topScore) {
            isNewRecord = true;
            topScore = score;
            topScoreDisplay.textContent = topScore;
            localStorage.setItem("arcadeTopScore", topScore);
        }
    }

    requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();
