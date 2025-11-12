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

// Map Legend:
// " " = empty space
// "#" = wall
// "!" = start
// "@" = exit

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
      if (element === "!") {
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
}

function changeMap(){
  gameArea.innerHTML = '<div id="player">You</div>'
  gameArea.style.width = maps[level].width;
  gameArea.style.height = maps[level].height;
  map = maps[level].layout;

  player = document.querySelector('#player')
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

    const exit = document.querySelector('.exit');
    if(xAxis + 'px' === exit.style.left && yAxis + 'px' === exit.style.top){
      level++;
      changeMap();
      renderMap();
    }
  }
});