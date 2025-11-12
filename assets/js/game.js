const gameArea = document.querySelector('#game-area');
let player = document.querySelector('#player');

let gameAreaValues = gameArea.getBoundingClientRect();

let xAxis = 0;
let yAxis = 0;

let pastX = 0;
let pastY = 0;

let movement = 32;

let level = 0;

// All maps objects
let maps;
// Current map
let map;


// Load maps from JSON file

fetch('assets/maps.json')
  .then(res => res.json())
  .then(levels => {
    maps = levels.maps
    map = maps[level].layout;
    renderMap();
  })

// Render the map
function renderMap(){
    map.forEach((row, y) => {
    row.forEach((element, x) => {
      /* Map Legend:
      " " = empty space
      "#" = wall
      "!" = start
      "@" = exit
      "&" = key
      "*" = door */
      if(element === "!") {
        xAxis = x * 32;
        yAxis = y * 32;
        pastX = xAxis;
        pastY = yAxis;
        player.style.top = `${yAxis}px`;
        player.style.left = `${xAxis}px`;
      } else if(element === "#") {
        const wall = document.createElement('div');
        wall.style.top = `${y * 32}px`;
        wall.style.left = `${x * 32}px`;
        wall.className = "wall";
        gameArea.appendChild(wall);
      } else if(element === "@") {
        const exit = document.createElement('div');
        exit.innerText = "Exit";
        exit.style.top = `${y * 32}px`;
        exit.style.left = `${x * 32}px`;
        exit.className = "exit";
        gameArea.appendChild(exit);
      } else if(element === "&") {
        const key = document.createElement('div');
        key.style.top = `${y * 32}px`;
        key.style.left = `${x * 32}px`;
        key.className = "key";
        gameArea.appendChild(key);
      } else if(element === "*") {
        const door = document.createElement('div');
        door.style.top = `${y * 32}px`;
        door.style.left = `${x * 32}px`;
        door.className = "door";
        gameArea.appendChild(door);
      } else if(element === "&") {
        const key = document.createElement('div');
        key.style.top = `${y * 32}px`;
        key.style.left = `${x * 32}px`;
        key.className = "key";
        gameArea.appendChild(key);
      }
    });
  });
}

function changeMap(){
  gameArea.innerHTML = '<div id="player">You</div>'
  gameArea.style.width = maps[level].width;
  gameArea.style.height = maps[level].height;
  map = maps[level].layout;

  player = document.querySelector('#player')
}

function checkWallCollision(keyPress) {
  const walls = document.querySelectorAll('.wall');
  // Collision detection with walls
  walls.forEach(wall => {
    const wallRect = wall.getBoundingClientRect();

    if (wallRect.left === xAxis && wallRect.top === yAxis) {
      // Handle wall movement and player position update
      switch (keyPress) {
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
}

function checkExitCollision() {
  const exit = document.querySelector('.exit');
  if (xAxis + 'px' === exit.style.left && yAxis + 'px' === exit.style.top) {
    if (level === maps.length - 1) {
      window.location.href = 'end.html';
      return;
    } else {
      level++;
    }

    changeMap();
    renderMap();
  }
}

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

    checkWallCollision(event.key);

    // Update the player's position on screen
    player.style.top = `${yAxis}px`;
    player.style.left = `${xAxis}px`;

    checkExitCollision();
  }
});