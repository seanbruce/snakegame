// create a map whose properties are Symbols use to identify movement direction of snake.
const direction = new Map([
    ['up' , Symbol("direction:up")],
    ['down' , Symbol("direction:down")],
    ['left' , Symbol("direction:left")],
    ['right' , Symbol("direction:right")]
]);


const snake = {
  status : true,
  snakeBody : [],
  foodInStomach : [],
  direction : null,
  _velocity : 70,

  setVelocity(second){
    this._velocity = second * 1000;
  },

  moveHead(snakeHead){
      console.log(`Head for: ${String(this.direction)}`);
      /* Move head of snake to next position by consider following rules:
       * 1. If player makes snake go up when head of snake was already at the
       *    top line of playground.next position of the snake will be at the
       *    bottom line of the playground.
       *
       * 2. If player makes snake go down when head of snake was already at the
       *    bottom line of playground.next position of the snake will be at the
       *    top line of the playground.
       *
       * 3. If player makes snake go left when head of snake was already at the
       *    leftmost line of playground.next position of the snake will be at the
       *    mostright line of the playground.
       *
       * 4. If player makes snake go right when head of snake was already at the
       *    mostright line of playground.next position of the snake will be at the
       *    leftmost line of the playground.
       */
      switch(this.direction) {
        case direction.get("up"):
          if(snakeHead[1] === 1) {
            return [snakeHead[0], game.matrix.y];
          } else {
            return [snakeHead[0], --snakeHead[1]];
          }
        case direction.get("down"):
          if(snakeHead[1] === game.matrix.y) {
            return [snakeHead[0], 1];
          } else {
            return [snakeHead[0], ++snakeHead[1]];
          }
        case direction.get("left"):
          if(snakeHead[0] === 1) {
            return [game.matrix.x, snakeHead[1]];
          } else {
            return [--snakeHead[0], snakeHead[1]];
          }
        case direction.get("right"):
          if(snakeHead[0] === game.matrix.x) {
            return [1, snakeHead[1]];
          } else {
            return [++snakeHead[0], snakeHead[1]];
          }
      }
  },
  /**

   */
  moveBody(snakeBody, oldHead){
    let temporalSlot;
    for(const [key, value] of snakeBody.entries()) {
      if(key === 0) continue;
      temporalSlot = snakeBody[key];
      snakeBody[key] = oldHead;
      oldHead = temporalSlot
    }
    return true;
  },

  nextMove(){
    this.status = false;
    console.log(`move start`);
    console.log(`before move [${this.snakeBody[0][0]},${this.snakeBody[0][1]}],[${this.snakeBody[1][0]},${this.snakeBody[1][1]}]`);
    if(referee.contactWith([this.snakeBody[0][0], this.snakeBody[0][1]])) {
      this.drawSnake();
      const oldHead = [this.snakeBody[0][0], this.snakeBody[0][1]];
      this.snakeBody[0] = this.moveHead(this.snakeBody[0]);
      this.moveBody(this.snakeBody, oldHead);
      console.log(`after move [${this.snakeBody[0][0]},${this.snakeBody[0][1]}],[${this.snakeBody[1][0]},${this.snakeBody[1][1]}]`);
      if(this.foodInStomach.length !== 0) {
        if(this.foodInStomach[0].appendToTail === 0) {
          this.snakeBody.push(this.foodInStomach[0].foodPosition);
          const depositFood  = game.playground.children[this.foodInStomach[0].foodPosition[0]-1].children[this.foodInStomach[0].foodPosition[1]-1];
          depositFood.classList.toggle("food");
          this.foodInStomach.shift();
        } else {
          for(const value of this.foodInStomach) {
            value.appendToTail = value.appendToTail - 1;
          }
        }
      }
      this.drawSnake();
    } else {
      this.giveup();
    }
    this.status = true;
    console.log(`move end`);
  },

  giveup(){
    referee.acceptGiveup.call(referee);
  },

  eat([x, y]){
    const newFood = {
      appendToTail : this.snakeBody.length,
      foodPosition : [x, y]
    };
    this.foodInStomach.push(newFood);
  },

  init(){
    this.direction = direction.get("right");
    this.snakeBody.push([20, 20]);
    this.snakeBody.push([19, 20]);
    this.drawSnake();
    this.status = true;

  },

  drawSnake(){
    for(const point of this.snakeBody) {
      this.drawPoint(point);
    }
  },

  drawPoint([x , y]) {
    let point = game.playground.children[x-1].children[y-1];
    point.classList.toggle("partOfSnake");
  },
}

const referee = {
  gameId : null,
  foodId : null,

  setFood(){
    this.foodId = setInterval(()=>{
      if(game.food === null) {
        console.log('food is null');
        let testFood = game.createFood();
        console.log(`rectification : ${this.ractifyFood(testFood)}`);
        if(this.ractifyFood(testFood)) {
          console.log("setting food");
          game.food = [testFood[0], testFood[1]];
          game.putFood();
        }
      }
    }, 1000);
  },

  play(){
    this.gameId = setInterval(()=> {
      if(snake.status) {
        snake.nextMove.bind(snake)();
      }
    }, snake._velocity);
  },
  contactWith(head){
    const newHead = snake.moveHead(head);
    console.log(`newHead : ${newHead}`);
    if(game.food && newHead.every((elt, index)=>elt === game.food[index])) {
      snake.eat.call(snake, game.food);
      const score = document.querySelector('div.score > span');
      score.innerText = snake.snakeBody.length-1;
      game.food = null;
      return true;
    }

    if(snake.snakeBody.some(function(elt){return (elt[0] === newHead[0] && elt[1] === newHead[1])})) {
      alert('collision.')
      return false;
    }
    return true;
  },
  startGame(){
    game.init({columns : 50, rows : 50});
    snake.init();
    document.body.onkeydown = function(e) {
      if(snake.status) {
        switch(e.key) {
          case "ArrowUp" :
            if(snake.direction !== direction.get("down")) {
              snake.direction = direction.get("up");
            }
            break;
          case "ArrowDown" :
            if(snake.direction !== direction.get("up")) {
            snake.direction = direction.get("down");
            }
            break;
          case "ArrowLeft" :
            if(snake.direction !== direction.get("right")) {
            snake.direction = direction.get("left");
            }
            break;
          case "ArrowRight" :
            if(snake.direction !== direction.get("left")) {
            snake.direction = direction.get("right");
            }
            break;
        }
      }
    };
  },
  ractifyFood([x, y]) {
    return !(snake.snakeBody.some(function(elt){return elt[0] === x && elt[1] === y})) && x !== 0 && y !== 0;
  },
  acceptGiveup() {
    window.clearInterval(this.foodId);
    window.clearInterval(this.gameId);
    alert('Game Over');
  }
};

const game = {
  food : null,
  matrix : null,
  playground : null,
  putFood(){
    try {
      let foodLocation  = game.playground.children[this.food[0]-1].children[this.food[1]-1];
      foodLocation.classList.toggle("food");
    } catch(e) {
      alert("x :" + this.food[0]);
      alert("y :" + this.food[1]);
    }

  },
  createPlayground({columns = 100, rows = 100} = {}) {
    let result = document.createElement("div");
    result.classList.add("matrix-container");
    for(let i = 0; i < rows; i++) {
      let rowContainer = document.createElement("div");
      rowContainer.classList.add("row-container");
      for(let i = 0; i < columns; i++) {
        let matrixUnit = document.createElement("div");
        matrixUnit.classList.add("matrix-unit");
        rowContainer.appendChild(matrixUnit);
      }
      result.appendChild(rowContainer);
    }
    document.getElementById("playground").appendChild(result);
    return result;
  },
  init({columns = 100, rows = 100} = {}) {
    this.playground = this.createPlayground({columns, rows});
    this.matrix = {x : columns , y : rows};
  },
  createFood() {
    const resultNumber = Math.floor(Math.random() * (this.matrix.x * this.matrix.y + 1)) + 1;
    return [resultNumber % this.matrix.y, Math.ceil(resultNumber / this.matrix.x)]
  }
}

window.onload = function() {
  referee.startGame();
  let start = document.getElementById('start');
  start.onclick = function(){
    referee.setFood();
    referee.play();
  };
 }
