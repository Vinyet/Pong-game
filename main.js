var canvas;
var canvasContext;
var score = 0;
var scoreContainer;
var start = false;
var gameOverContainer;

function restart() {
	location.reload();
}

function activate() {
	start = true;
	return start;
}

function deactivate() {
	if (start === true) {
		start = false;
		return start;
	} else if (start === false) {
		start = true;
		return start;
	}
}

window.onload = function() {
	canvas = document.getElementById("gameCanvas");
	canvasContext = canvas.getContext('2d');
	scoreContainer = document.getElementById("score");
	displayScore = document.createElement('p');
	displayScore.innerText = 0;
	scoreContainer.append(displayScore);
	gameOverContainer = document.getElementsByClassName('game-over-container')[0];

	var framesPerSecond = 60;
	setInterval(function() {
		drawGame();
		if (start === true) {
			move();
			canvas.addEventListener('mousemove', calculateMousePos);
			collision(ball, leftPaddle, rightPaddle);
		}
	}, 1000/framesPerSecond);

	var leftPaddle = {
		x: 0,
		y: (canvas.height/2) - 50,
		width: 12,
		height: 150,
		color: "yellow",
		score: 0
	}
	
	var rightPaddle = {
		x: canvas.width - 10,
		y: (canvas.height/2) - 50,
		width: 12,
		height: 150,
		color: "yellow",
		score: 0
	}

	var ball = {
		x: canvas.width/2,
		y: canvas.height/2,
		radius: 10,
		color: "white",
		speed: 5,
		velocityX: 5, 
		velocityY: 5,
	}

	function drawGame() {
		canvasContext.clearRect(0, 0, canvas.width, canvas.height);
		drawRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height, leftPaddle.color);
		drawRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height, rightPaddle.color); 
		drawCircle(ball.x, ball.y, ball.radius, ball.color);
	}

	function drawRect(x, y, w, h, color) {
		canvasContext.fillStyle = color;
		canvasContext.fillRect(x, y, w, h);
	}

	function drawCircle(x, y, r, color) {
		canvasContext.fillStyle = color;
		canvasContext.beginPath(); 
		canvasContext.arc(x, y, r, 0, Math.PI*2, false);
		canvasContext.fill();
		canvasContext.closePath();
	}

	function move() {
		ball.x += ball.velocityX; 
		ball.y += ball.velocityY; 
		if ( (ball.y + ball.radius > canvas.height ) || (ball.y - ball.radius < 0) ) {
			ball.velocityY =- ball.velocityY;
		} else if ( (ball.x + ball.radius > canvas.width ) || (ball.x - ball.radius < 0)) {
			ball.velocityX =- ball.velocityX;
		}
	}

	function calculateMousePos(e) {
		var rect = canvas.getBoundingClientRect(); 
		leftPaddle.y = e.clientY - rect.top - leftPaddle.height/2; 
		rightPaddle.y = e.clientY - rect.top - rightPaddle.height/2;
	}

	function collision(ball) {
		leftPaddle.top = Math.floor(leftPaddle.y);
		leftPaddle.bottom = Math.floor(leftPaddle.y + leftPaddle.height);
		leftPaddle.left = Math.floor(leftPaddle.x);
		leftPaddle.right = Math.floor(leftPaddle.x + leftPaddle.width);
		rightPaddle.top = Math.floor(rightPaddle.y);
		rightPaddle.bottom = Math.floor(rightPaddle.y + rightPaddle.height);
		rightPaddle.left = Math.floor(rightPaddle.x);
		rightPaddle.right = Math.floor(rightPaddle.x + rightPaddle.width);
		ball.top = ball.y - ball.radius;
		ball.bottom = ball.y + ball.radius;
		ball.left = ball.x - ball.radius;
		ball.right = ball.x + ball.radius;
		if (ball.left < -3 || ball.right > canvas.width) {
			alert('¡Game over! Más suerte la próxima vez.');
			location.reload();
		} else if ((leftPaddle.top > ball.bottom || leftPaddle.right < ball.left || leftPaddle.bottom < ball.top || leftPaddle.left > ball.right) && (rightPaddle.top > ball.bottom || rightPaddle.right < ball.left || rightPaddle.bottom < ball.top || rightPaddle.left > ball.right)) {
			return false;
		} else {
			ball.velocityX = -ball.velocityX;
			ball.velocityY = -ball.velocityY;
			score ++;
			displayScore.innerText = score;
		}
	}
}