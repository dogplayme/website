var tools = {
	isArrayInArrayOrNot: function(small, big){
		if (small.length != big[0].length){
			return false;
		}
		for (var i in big){
			var flag = true;
			for (var j in small){
				flag = (small[j] == big[i][j] ? true : false) && flag;
			}
			if (flag){
				return true;
			}
		}
		return false;	
	},
	randomArea: function(min, max){
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random()*(max-min)+min);
	},
	getMutipleFloor: function(number, mutiple){
		return (Math.floor(number/mutiple))*mutiple;
	}

}
var EventUtil={
	addHandler:function(element,type,handler){ 
		if(element.addEventListener){ 
			element.addEventListener(type,handler,false);  
		}else if(element.attachEvent){                    
			element.attachEvent("on"+type,handler);
		}else{
			element["on"+type]=handler;         
		}
	}, 
	getEvent:function(event){  
		return event?event:window.event;
	},
	preventDefault:function(event){   
		if(event.preventDefault){
			event.preventDefault(); 
		}else{
			event.returnValue=false;
		}
	},
	getCharCode:function(event){   
		if(typeof event.charCode=="number"){
			return event.charCode;
		}else{
			return event.keyCode;
		}
	}
}

function Snake(){
	this.manager = {
		"canvas": {
			"width": 0,
			"computedWidth": 0
		},
		"food": {
			"x": 0,
			"y": 0,
			"width": 1,
			"computedWidth":0,
			"color": "black"
		},
		"snake": {
			"body": [],
			"direction": [],
			"currentDirection": 39,
			"color": "black",
			"width": 1,
			"computedWidth":0
		},
		"wall": {
			"color": "black",
			"width": 1,
			"computedWidth":0,
			"body": []
		},
		"game": {
			"score": 0,
			"perPixel": 10,
			"speed": 50,
			"speedPlusTime": 3,
			"mutiple": 0.85,
			"isWallExisted": false,
			"isFoodChangeable": false,
			"foodChangeSpeed": 3000,
			"isDirectionChangeable": true
		}
	};

	if (typeof this.initialGame != "function"){
		Snake.prototype.initialGame = function(drawingElement){
			var perPixel = this.manager.game.perPixel;
			this.manager.canvas.width = drawingElement.getAttribute("width");
			this.manager.canvas.computedWidth = this.manager.canvas.width / perPixel;
			this.manager.food.computedWidth = this.manager.food.width * perPixel;
			this.manager.snake.computedWidth = this.manager.snake.width * perPixel;
			this.manager.wall.computedWidth = this.manager.wall.width * perPixel;
			this.manager.game.isWallExisted = Boolean(parseInt(localStorage.getItem("isWallExisted")));
			this.manager.game.isFoodChangeable = Boolean(parseInt(localStorage.getItem("isFoodChangeable")));
			this.manager.game.speed = parseInt(localStorage.getItem("speed"));
			perPixel = null;

		}
	}
	if (typeof this.buildWall != "function"){
		Snake.prototype.buildWall = function(context){
			context.save();
			context.strokeStyle = this.manager.wall.color;
			context.lineWidth = this.manager.wall.computedWidth;
			context.strokeRect(this.manager.wall.computedWidth/2, this.manager.wall.computedWidth/2, this.manager.canvas.width-this.manager.wall.computedWidth, this.manager.canvas.width-this.manager.wall.computedWidth);
			context.stroke();
			context.restore();
		}
	}
	if (typeof this.updateFood != "function"){
		Snake.prototype.updateFood = function(){
			var foodPosition = [],
				snakePosition = this.manager.snake.body,
				wall = this.manager.wall,
				canvas = this.manager.canvas,
				food = this.manager.food
			;
			do {
				foodPosition = [];
				foodPosition.push(tools.getMutipleFloor(tools.randomArea(wall.computedWidth, canvas.width-1-wall.computedWidth), food.computedWidth));
				foodPosition.push(tools.getMutipleFloor(tools.randomArea(wall.computedWidth, canvas.width-1-wall.computedWidth), food.computedWidth));			
			} while (tools.isArrayInArrayOrNot(foodPosition, snakePosition));
			food.x = foodPosition[0];
			food.y = foodPosition[1];
			foodPosition =
			snakePosition = 
			wall = 
			canvas = 
			food = null;
			
		}
	}
	if (typeof this.deliverFood != "function"){
		Snake.prototype.deliverFood = function(context){
			var food = this.manager.food;
			context.save();
			context.beginPath();
			context.fillStyle = food.color;
			context.rect(food.x, food.y, food.computedWidth, food.computedWidth);
			context.fill();
			context.stroke();
			context.restore();
			food = null;
		}
	}
	if (typeof this.dropSnake != "function"){
		Snake.prototype.dropSnake = function(bodyLength, context){
			var canvas = this.manager.canvas,
				game = this.manager.game,
				snake = this.manager.snake
			;
			for(var i=0; i<bodyLength; i++){
				var position = [tools.getMutipleFloor(canvas.width/2, snake.computedWidth)-(i*snake.computedWidth), tools.getMutipleFloor(canvas.width/2, snake.computedWidth)]
				this.manager.snake.body.push(position);
				this.manager.snake.direction.push(snake.currentDirection);
			}
			this.showSnake(context);
		}
	}
	if (typeof this.updateSnake != "function"){
		Snake.prototype.updateSnake = function(scoreElement){
			function mixtureDirectionAndBody(direction, bodyArray){
				var temp;
				switch (direction){
					case 38:
						temp = bodyArray.pop() - snake.computedWidth;
						bodyArray.push(temp);
						break;
					case 39:
						temp = bodyArray.shift() + snake.computedWidth;
						bodyArray.unshift(temp);
						break;
					case 40:
						temp = bodyArray.pop() + snake.computedWidth;
						bodyArray.push(temp);
						break;
					case 37:
						temp = bodyArray.shift() - snake.computedWidth;
						bodyArray.unshift(temp);
						break;
				}
					
			}
			var snake = this.manager.snake,
				nextHead = snake.body[0].concat()
			;
			mixtureDirectionAndBody(snake.currentDirection, nextHead);
			if ((nextHead[0] == this.manager.food.x) && (nextHead[1] == this.manager.food.y)){
				snake.body.unshift(nextHead);
				snake.direction.unshift(snake.currentDirection);
				this.manager.game.score += 1;
				this.updateScore(scoreElement);
				if (this.manager.game.isFoodChangeable){
					clearInterval(foodTimer);
					var that = this;
					foodTimer = setInterval(function(){
						that.updateFood();
					}, that.manager.game.foodChangeSpeed);
				}
				
				return true;
			} 
			snake.direction.pop();
			snake.direction.unshift(snake.currentDirection);
			for (var i in snake.direction){
				mixtureDirectionAndBody(snake.direction[i], snake.body[i]);
				if (!this.manager.game.isWallExisted){
					var wall = this.manager.wall,
						canvas = this.manager.canvas
					;
					if (snake.body[i][0]<wall.computedWidth){
						snake.body[i][0] = canvas.width-wall.computedWidth;
					} else if (snake.body[i][0]>=canvas.width-wall.computedWidth){
						snake.body[i][0] = wall.computedWidth;
					}
					if (snake.body[i][1]<wall.computedWidth){
						snake.body[i][1] = canvas.width-wall.computedWidth;
					} else if (snake.body[i][1]>=canvas.width-wall.computedWidth){
						snake.body[i][1] = wall.computedWidth;
					}
					wall =
					canvas = null;
				}
			}	

			snake = 
			nextHead = null;
		}
	}
	if (typeof this.showSnake != "function"){
		Snake.prototype.showSnake = function(context){
			var snake = this.manager.snake;
			context.save();
			context.beginPath();
			context.fillStyle = snake.color;
			for (var i in snake.body){
				context.rect(snake.body[i][0], snake.body[i][1], snake.computedWidth, snake.computedWidth);
			}
			context.fill();
			context.stroke();
			context.restore();
			snake = null;
		}
	}
	if (typeof this.checkAccident != "function"){
		Snake.prototype.checkAccident = function(){
			var selfWithoutHead = this.manager.snake.body.concat(),
				head = selfWithoutHead.shift()
			;
			if (tools.isArrayInArrayOrNot(head, selfWithoutHead)){
				return true;
			}
			if (this.manager.game.isWallExisted){
				var wall = this.manager.wall,
					canvas = this.manager.canvas,
					isHitedWall = (function(){
						if (head[0]<wall.computedWidth){
							return true;
						}
						if (head[0]>canvas.width-1-wall.computedWidth){
							return true;
						}
						if (head[1]<wall.width){
							return true;
						}
						if (head[1]>canvas.width-1-wall.computedWidth){
							return true;
						}
						return false;
					})();
				if (isHitedWall){
					return true;
				}
			}
			return false;
		}
	}
	if (typeof this.addChangeDirectionHandle != "function"){
		Snake.prototype.addChangeDirectionHandle = function(){
			var that = this;
			EventUtil.addHandler(document, "keydown", function(event){
				if (that.manager.game.isDirectionChangeable){
					that.manager.game.isDirectionChangeable = false;
					event = EventUtil.getEvent(event);
					that.manager.snake.currentDirection = (function(keyCode){
						switch(keyCode){
							case 37:
								EventUtil.preventDefault(event);
								return that.manager.snake.currentDirection==39?39:37;
							case 38:
								EventUtil.preventDefault(event);
								return that.manager.snake.currentDirection==40?40:38;
							case 39:
								EventUtil.preventDefault(event);
								return that.manager.snake.currentDirection==37?37:39;
							case 40:
								EventUtil.preventDefault(event);
								return that.manager.snake.currentDirection==38?38:40;
						}
					})(event.keyCode);
				}
				
			})
		}
	}
	if (typeof this.go != "function"){
		Snake.prototype.go = function(context, scoreElement){
			var that = this,
				wall = this.manager.wall,
				canvas = this.manager.canvas;
				if (this.manager.game.isFoodChangeable){
					foodTimer = setInterval(function(){
						that.updateFood();
					}, that.manager.game.foodChangeSpeed);
				}
			var	timerMain = setInterval(function(){
					that.manager.game.isDirectionChangeable = true;
					context.clearRect(wall.computedWidth, wall.computedWidth, canvas.width-wall.computedWidth*2, canvas.width-wall.computedWidth*2);
					that.deliverFood(context);
					if (that.updateSnake(scoreElement)){
						that.updateFood();
					}
					that.showSnake(context);
					if (that.checkAccident()){
						clearInterval(timerMain);
						if (that.manager.game.isFoodChangeable){
							clearInterval(foodTimer);
						}
						if (that.manager.game.score > localStorage.getItem("highestScore")) {
							localStorage.setItem("highestScore", that.manager.game.score);
						}
						setTimeout(function(){location.reload();}, 1500);
					}
			}, this.manager.game.speed);	
		}
	}
	if (typeof this.updateScore != "function"){
		Snake.prototype.updateScore = function(scoreElement){
			scoreElement.innerText = this.manager.game.score;	
		}
	}
	if (typeof this.checkScore != "function"){
		Snake.prototype.checkScore = function(){
			if (this.manager.game.score != 0 && this.manager.game.score % this.manager.game.speedPlusTime == 0){
				this.manager.game.isSpeedPlus = true;
				return true;
			}
		}
	}
	if (typeof this.updateSpeed != "function"){
		Snake.prototype.updateSpeed = function(){
			this.manager.game.speed *= this.manager.game.mutiple;
		}
	}

}

window.onload = function(){
	function initialSetting(){
		if (document.getElementsByName("isWallExisted")[0].checked){
			localStorage.setItem("isWallExisted", document.getElementsByName("isWallExisted")[0].value);
		} else {
			localStorage.setItem("isWallExisted", document.getElementsByName("isWallExisted")[1].value);
		}
		if (document.getElementsByName("isFoodChangeable")[0].checked){
			localStorage.setItem("isFoodChangeable", document.getElementsByName("isFoodChangeable")[0].value);
		} else {
			localStorage.setItem("isFoodChangeable", document.getElementsByName("isFoodChangeable")[1].value);
		}
		if (document.getElementsByName("speed")[0].checked){
			localStorage.setItem("speed", document.getElementsByName("speed")[0].value);
		} else {
			localStorage.setItem("speed", document.getElementsByName("speed")[1].value);
		}
	}
	document.getElementById("highestScore").innerText = localStorage.getItem("highestScore") ? localStorage.getItem("highestScore") : 0;
	var go = document.getElementById("go");
	go.focus();
	EventUtil.addHandler(go, "click", function(){
		document.getElementsByClassName("setting")[0].style.visibility = "hidden";
		initialSetting();
		var drawing = document.getElementById("drawing");
		if (drawing.getContext){
			var snake = new Snake(),
				context = drawing.getContext("2d"),
				score = document.getElementById("score")
			;
			snake.initialGame(drawing);
			snake.buildWall(context);
			snake.dropSnake(8, context);
			snake.updateFood();
			snake.deliverFood(context);
			snake.addChangeDirectionHandle();
			snake.updateScore(score);
			snake.go(context, score);
		}
	})

}




