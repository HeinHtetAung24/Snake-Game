const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");

let foodX, foodY;
let snakeX = 5 , snakeY = 10;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let gameOver = false;
let setIntervalId;
let score = 0;

// Getting high score from local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerHTML = `High-Score: ${highScore}`;

const changeFoodPosition = () => {
    // Passing a random 0 - 30 value as food position, it should be 1 - 30
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    // Clearing time interval and reloading the page on game over
    clearInterval(setIntervalId);
    alert("Game over! Press OK to replay...");
    location.reload();
}

const changeSnakeDirection = (e) => {
    // Changing velocity value base on key press
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    }
}

controls.forEach(key => {
    // Calling changeSnakeDirection on each key click and passing key dataset value as an object
    key.addEventListener("click",() => changeSnakeDirection({ key: key.dataset.key }))
})

let initGame = () => {
    // If the game is over, return and call handleGameOver function
    if(gameOver) return handleGameOver();

    // Creating a food div and inserting it in the playboard element
    let htmlMark = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Change food position after snake eats it
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();
        snakeBody.push([foodX, foodY]); // pushing food position to the snake body
        score++; // Increase score by one

        highScore = score >= highScore ? score : highScore;
        // Setting high score value to local storage with high-score name
        localStorage.setItem("high-score", highScore); 
        scoreElement.innerHTML = `Score: ${score}`;
        highScoreElement.innerHTML = `High Score: ${highScore}`;
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        // Shifting forward the value of the elements in the snake body by one
        snakeBody[i] = snakeBody[i - 1];
    }

    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Updating the snake head position based on current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Checking snake head collide with the wall, if so setting gameOver true
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        gameOver = true;
    }

    // Creating a snake head 
    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake body
        htmlMark += `<div class="snakeHead" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    
    playBoard.innerHTML = htmlMark;
};

changeFoodPosition();

// The head will move after every 125 milisec. 125 is the speed of the snake 
setIntervalId = setInterval(initGame, 125);

document.addEventListener("keydown", changeSnakeDirection)