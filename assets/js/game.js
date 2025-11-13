const gameArea = document.querySelector('#game-area');
const inventoryList = document.querySelector('#inventory');

let player = document.querySelector('#player');

let gameAreaValues;

let xAxis = 0;
let yAxis = 0;

let pastX = 0;
let pastY = 0;

let movement = 32;

let level = 0;

let inventory = {
  playerKeys: 0
}

// All maps objects
let maps;
// Current map
let map;

// Load maps from JSON file

fetch('assets/maps.json')
  .then(res => res.json())
  .then(levels => {
    maps = levels.maps
    gameArea.style.width = maps[level].width;
    gameArea.style.height = maps[level].height;
    gameAreaValues = gameArea.getBoundingClientRect();
    map = maps[level].layout;
    renderMap();
  })

// Render the map
function renderMap(){
    map.forEach((row, y) => {
    row.forEach((element, x) => {
      /* Map Legend:
      " " = empty space
      "." = immovable wall
      "#" = wall
      ":" = pit
      "&" = key
      "*" = door
      "!" = start
      "@" = exit */
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
      } else if(element === ".") {
        const immovableWall = document.createElement('div');
        immovableWall.style.top = `${y * 32}px`;
        immovableWall.style.left = `${x * 32}px`;
        immovableWall.className = "immovable-wall";
        gameArea.appendChild(immovableWall);
      } else if(element === ":") {
        const pit = document.createElement('div');
        pit.style.top = `${y * 32}px`;
        pit.style.left = `${x * 32}px`;
        pit.className = "pit";
        gameArea.appendChild(pit);
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
      }
    });
  });
}

function changeMap(){
  gameArea.innerHTML = '<div id="player">You</div>'
  gameArea.style.width = maps[level].width;
  gameArea.style.height = maps[level].height;
  gameAreaValues = gameArea.getBoundingClientRect();
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
          const wallUp = document.elementFromPoint(wallRect.left, wallRect.top - movement);
          if (wallUp != null) {
            if (wallUp === gameArea) {
              wall.style.top = `${wallRect.top - movement}px`;
            } else if (wallUp.className === 'pit') {
              wallUp.remove();
              wall.remove();
            }
            else {
              xAxis = pastX;
              yAxis = pastY;
            }
          } else {
            xAxis = pastX;
            yAxis = pastY;
          }
          break;

        case 'ArrowDown':
          const wallDown = document.elementFromPoint(wallRect.left, wallRect.top + movement);
          if (wallDown != null) {
            if (wallDown === gameArea) {
              wall.style.top = `${wallRect.top + movement}px`;
            } else if (wallDown.className === 'pit') {
              wallDown.remove();
              wall.remove();
            }
            else {
              xAxis = pastX;
              yAxis = pastY;
            }
          } else {
            xAxis = pastX;
            yAxis = pastY;
          }
          break;

        case 'ArrowLeft':
          const wallLeft = document.elementFromPoint(wallRect.left - movement, wallRect.top);
          if (wallLeft != null) {
            if (wallLeft === gameArea) {
              wall.style.top = `${wallRect.left - movement}px`;
            } else if (wallLeft.className === 'pit') {
              wallLeft.remove();
              wall.remove();
            }
            else {
              xAxis = pastX;
              yAxis = pastY;
            }
          } else {
            xAxis = pastX;
            yAxis = pastY;
          }
          break;

        case 'ArrowRight':
          const wallRight = document.elementFromPoint(wallRect.left + movement, wallRect.top);
          if (wallRight != null) {
            if (wallRight === gameArea) {
              wall.style.left = `${wallRect.left + movement}px`;
            } else if (wallRight.className === 'pit') {
              wallRight.remove();
              wall.remove();
            }
            else {
              xAxis = pastX;
              yAxis = pastY;
            }
          } else {
            xAxis = pastX;
            yAxis = pastY;
          }
          break;
      }
    }
  });
}

function checkImmovableWallCollision() {
  const immovableWalls = document.querySelectorAll('.immovable-wall');

  immovableWalls.forEach(immovableWall => {
    const wallRect = immovableWall.getBoundingClientRect();

    if (wallRect.left === xAxis && wallRect.top === yAxis) {
      // Revert player position on collision
      xAxis = pastX;
      yAxis = pastY;
    }
    
  });
}

function checkPitCollision() {
  const pits = document.querySelectorAll('.pit');

  pits.forEach(pit => {
    const pitRect = pit.getBoundingClientRect();

    if(pitRect.left === xAxis && pitRect.top === yAxis) {
      // Revert player position on collision
      xAxis = pastX;
      yAxis = pastY;
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

function pickUpKey() {
  if(document.querySelectorAll('.key')) {
    const keys = document.querySelectorAll('.key')
    keys.forEach(key => {
      if(xAxis + 'px' === key.style.left && yAxis + 'px' === key.style.top) {
        inventory.playerKeys++;
        key.remove();
        updateInventory();
      }
    })
  }
}

function openDoor() {
  if(document.querySelectorAll('.door')) {
    const doors = document.querySelectorAll('.door')
    doors.forEach(door => {
      if(xAxis + 'px' === door.style.left && yAxis + 'px' === door.style.top) {
        if(inventory.playerKeys > 0) {
          inventory.playerKeys--;
          door.remove();
          updateInventory();
        } else {
          xAxis = pastX;
          yAxis = pastY;
        }
      }
    })
  }
}

function updateInventory() {
  if(!document.querySelector('#inventory-keys')) {
    const inventoryKeys = document.createElement('li');
    inventoryKeys.id = 'inventory-keys';
    inventoryKeys.innerText = `Keys: ${inventory.playerKeys}`;
    inventoryList.appendChild(inventoryKeys);
  } else {
    const inventoryKeys = document.querySelector('#inventory-keys');
    inventoryKeys.innerText = `Keys: ${inventory.playerKeys}`;
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
    checkImmovableWallCollision();
    checkPitCollision();
    pickUpKey();
    openDoor();

    // Update the player's position on screen
    player.style.top = `${yAxis}px`;
    player.style.left = `${xAxis}px`;

    checkExitCollision();
  }
});