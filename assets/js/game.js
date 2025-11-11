const gameArea = document.querySelector('#game-area');
const player = document.querySelector('#player');

let gameAreaValues = gameArea.getBoundingClientRect();

let xAxis = 0;
let yAxis = 0;

let pastX = 0;
let pastY = 0;

let movement = 32;

// Map Legend:
// " " = empty space
// "#" = wall
// "!" = start
// "@" = exit
const map = [
  [" ", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  ["!", " ", "#", "#", "#", "#", "#", "#", "#", "#"],
  [" ", " ", " ", "#", " ", "#", "#", "#", "#", "#"],
  ["#", "#", "#", "#", "#", " ", " ", " ", "#", "#"],
  ["#", "#", " ", " ", " ", "#", " ", " ", "#", "#"],
  ["#", "#", " ", "#", "#", "#", "#", " ", " ", "@"],
];  

// Render the map
map.forEach((row, y) => {
  row.forEach((element, x) => {
    if (element === "!") {
      const start = document.createElement('div');
      start.style.top = `${y * 32}px`;
      start.style.left = `${x * 32}px`;
      start.className = "start";
      gameArea.appendChild(start);
      xAxis = x * 32;
      yAxis = y * 32;
      pastX = xAxis;
      pastY = yAxis;
      player.style.top = `${yAxis}px`;
      player.style.left = `${xAxis}px`;
    }
    if (element === "#") {
      const wall = document.createElement('div');
      wall.style.top = `${y * 32}px`;
      wall.style.left = `${x * 32}px`;
      wall.className = "wall";
      gameArea.appendChild(wall);
    } else if (element === "@") {
      const exit = document.createElement('div');
      exit.innerText = "Exit";
      exit.style.top = `${y * 32}px`;
      exit.style.left = `${x * 32}px`;
      exit.className = "exit";
      gameArea.appendChild(exit);
    }
  });
});

document.addEventListener('keydown', event => {

  if (event.key.startsWith('Arrow')) {

    // Save the player's current position as past position
    pastX = xAxis;
    pastY = yAxis;

    // Move player based on arrow key
    switch (event.key) {
      case 'ArrowUp':
        yAxis -= movement;
        break;
      case 'ArrowDown':
        yAxis += movement;
        break;
      case 'ArrowLeft':
        xAxis -= movement;
        break;
      case 'ArrowRight':
        xAxis += movement;
        break;
    }

    // Boundary checks
    if (xAxis < 0) xAxis = 0;
    if (yAxis < 0) yAxis = 0;
    if (xAxis > gameAreaValues.width - player.offsetWidth) xAxis = gameAreaValues.width - player.offsetWidth;
    if (yAxis > gameAreaValues.height - player.offsetHeight) yAxis = gameAreaValues.height - player.offsetHeight;

    const walls = document.querySelectorAll('.wall');

    // Collision detection with walls
    walls.forEach(wall => {
      const wallRect = wall.getBoundingClientRect();
      const playerRect = player.getBoundingClientRect();


      if (wallRect.left === xAxis && wallRect.top === yAxis) {
        // Handle wall movement and player position update
        switch (event.key) {
          case 'ArrowUp':
            if (document.elementFromPoint(wallRect.left, wallRect.top - movement) == gameArea) {
              wall.style.top = `${wallRect.top - movement}px`;
            } else {
              xAxis = pastX;
              yAxis = pastY;
            }
            break;

          case 'ArrowDown':
            if (document.elementFromPoint(wallRect.left, wallRect.top + movement) == gameArea) {
              wall.style.top = `${wallRect.top + movement}px`;
            } else {
              xAxis = pastX;
              yAxis = pastY;
            }
            break;

          case 'ArrowLeft':
            if (document.elementFromPoint(wallRect.left - movement, wallRect.top) == gameArea) {
              wall.style.left = `${wallRect.left - movement}px`;
            } else {
              xAxis = pastX;
              yAxis = pastY;
            }
            break;

          case 'ArrowRight':
            if (document.elementFromPoint(wallRect.left + movement, wallRect.top) == gameArea) {
              wall.style.left = `${wallRect.left + movement}px`;
            } else {
              xAxis = pastX;
              yAxis = pastY;
            }
            break;
        }
      }
    });

    // Update the player's position on screen
    player.style.top = `${yAxis}px`;
    player.style.left = `${xAxis}px`;
  }
});
