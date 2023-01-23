  const canvas = document.getElementById("myCanvas");
  const ctx = canvas.getContext("2d");

  let grid;
  let cols;
  let rows;
  const cellSize = 10;
  let initialization = 50;

  function setup() {
    cols = canvas.width / cellSize;
    rows = canvas.height / cellSize;
  
    grid = make2DArray(cols, rows);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = 0;
        if (Math.random() > 0.5 && initialization >= 0) {
            initialization--;
            grid[i][j] = 1;
        }
        // grid[i][j] = Math.round(Math.random());
      }
    }
  }

  function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
      arr[i] = new Array(rows);
    }
    return arr;
  }

  function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        sum += grid[col][row];
      }
    }
    sum -= grid[x][y];
    return sum;
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * cellSize;
        let y = j * cellSize;
        if (grid[i][j] == 1) {
          ctx.fillStyle = "black";
          ctx.fillRect(x, y, cellSize - 1, cellSize - 1);
        }
      }
    }
  
    let next = make2DArray(cols, rows);
  
    // Compute next based on grid
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        // Count live neighbors!
        let neighbors = countNeighbors(grid, i, j);
  
        if (state == 0 && neighbors == 3) {
          next[i][j] = 1;
        } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
  
      }
    }
  
    grid = next;
    // requestAnimationFrame(draw);
  
  }


setup();
setInterval(draw, 100);