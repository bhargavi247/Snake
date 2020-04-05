const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
ctx.fillStyle='black';
ctx.fillRect(0,0,canvas.width,canvas.height);
//we want to start with a horizontal snake. So y coordinate will remain same, x will redice by 10px everytime
let snake = [{ x: 300, y: 300 }, { x: 280, y: 300 }, { x: 260, y: 300 }, { x: 240, y: 300 }, { x: 220, y: 300 }];

const GAME_SPEED = 100;
// When set to true the snake is changing direction
let changingDirection = false;
// Apple x-coordinate
let appleX;
// Apple y-coordinate
let appleY;
// Horizontal velocity
let dx = 20;
// Vertical velocity
let dy = 0;

function drawSnakePart(snakePart) {
    ctx.fillStyle = '#55ddf2'; 
    ctx.strokestyle = 'darkgreen';
    ctx.fillRect(snakePart.x, snakePart.y, 20, 20); 
    ctx.strokeRect(snakePart.x, snakePart.y, 20, 20);
};

function drawSnake() { 
    snake.forEach(drawSnakePart); 
};

function createApple() {
    var max = (500 / 20);
    // Generate a random number the food x-coordinate
    appleX = 20*(Math.floor(Math.random()*max));
    // Generate a random number for the food y-coordinate
    appleY = 20 * (Math.floor(Math.random() * max));

    // if the new food location is where the snake currently is, generate a new food location
    snake.forEach(function isFoodOnSnake(part) {
        if (part.x == appleX && part.y == appleY){
            createApple();
        } 
    });
}

function drawApple() {
    ctx.fillStyle = '#f763b0';
    ctx.strokestyle = '#f763b0';
    ctx.fillRect(appleX, appleY, 20, 20);
    ctx.strokeRect(appleX, appleY, 20, 20);
}

function erasePrevSteps() {
    //  Select the colour to fill the drawing
    ctx.fillStyle = 'black';
    // Draw a "filled" rectangle to cover the entire canvas
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw a "border" around the entire canvas
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

// Start game
main();
// Create the first food location
createApple();
// Call changeDirection whenever a key is pressed
document.addEventListener("keydown", changeDirection);

function main() {
    // If the game ended return early to stop game
    if (didGameEnd()) {
        return;
    }

    setTimeout(function onTick() {
        changingDirection = false;
        erasePrevSteps();
        drawApple();
        advanceSnake();
        drawSnake();

        // Call game again
        main();
    }, GAME_SPEED)
}

//horizontal movement
//one step right = increase x coordinate of every part by 20px
//one step left = decrease x coordinate of every part by 20px

function advanceSnake() {
    // Create the new Snake's head
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    // Add the new head to the beginning of snake body
    snake.unshift(head);

    const AteFood = snake[0].x === appleX && snake[0].y === appleY;
    if (AteFood) {
        // Increase score
        //score += 10;
        // Display score on screen
        //document.getElementById('score').innerHTML = score;
        // Generate new apple location
        createApple();
    } 
    else {
        // Remove the last part of snake body
        snake.pop();
    }
}

//returns true if the head of the snake touched any part of the snake or if it touched the wall
function didGameEnd() {
    for (let i = 4; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        } 
    }

    const hitLeftWall = snake[0].x < 0;
    const hitRightWall = snake[0].x > myCanvas.width - 20;
    const hitToptWall = snake[0].y < 0;
    const hitBottomWall = snake[0].y > myCanvas.height - 20;

    return hitLeftWall || hitRightWall || hitToptWall || hitBottomWall;
}

function changeDirection(event) {
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    /**
     * Prevent the snake from reversing
     * Example scenario:
     * Snake is moving to the right. User presses down and immediately left
     * and the snake immediately changes direction without taking a step down first
     */
    if (changingDirection){
        return;
    } 
    changingDirection = true;

    const keyPressed = event.keyCode;

    const goingUp = dy === -20;
    const goingDown = dy === 20;
    const goingRight = dx === 20;
    const goingLeft = dx === -20;

    if (keyPressed === LEFT_KEY && !goingRight) {
        dx = -20;
        dy = 0;
    }
    if (keyPressed === UP_KEY && !goingDown) {
        dx = 0;
        dy = -20;
    }
    if (keyPressed === RIGHT_KEY && !goingLeft) {
        dx = 20;
        dy = 0;
    }
    if (keyPressed === DOWN_KEY && !goingUp) {
        dx = 0;
        dy = 20;
    }
}