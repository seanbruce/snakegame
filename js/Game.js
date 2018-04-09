export default class Game {
  constructor({columns = 100, rows = 100} = {}) {
    this.playground = this.buildPlayground(rows, columns)
    this.matrix = new Map([["x-axis", columns],["y-axis", rows]]);
    this.food  = null;
  }
  putFood() {
    if(this.food !== null) break
    else {
      console.log(`No food exist for now, setting new food...`);
      const resultNumber = Math.floor(Math.random() * (this.matrix.x * this.matrix.y + 1)) + 1;
      const untestedFood = new Map([["x", resultNumber % this.matrix.get("x-axis")], ["y", Math.ceil(resultNumber / this.matrix.get("y-axis"))]]);
      if(referee.verifyFood(untestedFood)) {
        this.food = untestedFood;
        const foodLocation = this.playground.children[this.food.get("x-axis")-1].children[this.food.get("y-axis")-1];
        foodLocation.classList.toggle("food");
      } else {
        break;
      }
    }
  }
  buildPlayground(rows, columns) {
    const playground = document.createElement("div");
    playground.classList.add("matrix-container");
    for(let i = 0; i < rows; i++) {
      const rowContainer = document.createElement("div");
      rowContainer.classList.add("row-container");
      for(let i = 0; i < columns; i++) {
        const matrixUnit = document.createElement("div");
        matrixUnit.classList.add("matrix-unit");
        rowContainer.appendChild(matrixUnit);
      }
      playground.appendChild(rowContainer);
    }
    document.getElementById("playground").appendChild(playGround);
    return playground;
  }


}
