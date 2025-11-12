const gameArea = document.querySelector('#game-area');

const player = document.querySelector('#player');

let gameAreaValues = gameArea.getBoundingClientRect()

let xAxis = 0;
let yAxis = 0;

let movement = 32;

const map = [
  [" ", "#", "#", "#", "#", "#", "#", "#", "#", "#"],
  [" ", "#", "#", "#", "#", "#", "#", "#", "#", "#"]

];  

map.forEach((row, y) => {
  row.forEach((element, x) => {
    if(element === "#") {
      const wall = document.createElement('div');
      wall.style.top = `${y * 32}px`;
      wall.style.left = `${x * 32}px`;
      wall.className = "wall";
      gameArea.appendChild(wall);
    }
  })
})

document.addEventListener('keydown', event => {

    if(event.key.startsWith('Arrow')){
        
        event.preventDefault();

        switch(event.key){
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
        }

        if(xAxis < 0) xAxis = 0;
        if(yAxis < 0) yAxis = 0;
        if(xAxis > gameAreaValues.width - player.offsetWidth) xAxis = gameAreaValues.width - player.offsetWidth;
        if(yAxis > gameAreaValues.height - player.offsetHeight) yAxis = gameAreaValues.height - player.offsetHeight;


        player.style.top = `${yAxis}px`
        player.style.left = `${xAxis}px`
    }
})