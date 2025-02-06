const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const collisionCanvas = document.getElementById('collisionCanvas');
const collisionCtx = collisionCanvas.getContext('2d');
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval= 1000;
let lastTime = 0;

let gameover = false;

let ravens = [];
let score = 0;
ctx.font = '30px Impact';
class Raven {
  constructor()
  {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x  = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 +3;
    this.directionY = Math.random() *5 -2.5;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = 'raven.png';
    this.frame = 0;
    this.maxframe =4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 100;
    this.randomColors = [Math.floor(Math.random()*255) ,Math.floor(Math.random()*255),Math.floor(Math.random()*255)];
    this.color= 'rgb(' + this.randomColors[0] + ',' + this.randomColors[1]+ ',' + this.randomColors[2]+ ')';
  }
  update(deltaTime){
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = this.directionY * -1;
    }
    this.x-= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) {
      this.markedForDeletion = true;
    }
    this.timeSinceFlap += deltaTime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxframe) this.frame = 0;
      else this.frame++
      this.timeSinceFlap =0;
    }
    if (this.x < 0 - this.width) gameover = true;
  }
  
  draw(){
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x,this.y, this.width, this.height)
    
    ctx.drawImage(this.image,this.frame * this.spriteWidth,0, this.spriteWidth, this.spriteHeight,this.x, this.y, this.width,this.height);
  }
}
let explosions = [];
class Explosion{
  constructor(x,y,size){
    this.image = new Image();
    this.image.src = 'boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size  = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.markedForDeletion = false;
    this.timeSinceLastFrame = 0;
    this.frameInterval = 100;
  }
  update(deltaTime){
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval){
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5){
        this.markedForDeletion = true;
      }
    }
  }
  draw(){
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x - this.size/4, this.y, this.size, this.size);
  }
}

function drawscore() {
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 50, 75);
}
function drawGameOver() {
  ctx.fillStyle = '#000000';
  ctx.fillText('GAME OVER, your score is  ' + score, canvas.width/2, canvas.height/2);
  ctx.fillAlign = 'center';
}
window.addEventListener('click', function(e){
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y,1,1);
  const pc = detectPixelColor.data;
  ravens.forEach(element => {
    if(element.randomColors[0] === pc[0] && element.randomColors[1] === pc[1] && element.randomColors[2] === pc[2]){
      element.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(element.x, element.y, element.width));
    }
  });
})


function animate(timestamp) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  collisionCtx.clearRect(0,0,canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function(a,b){
      return a.width - b.width;
    });
    
  }
  drawscore();
  [...ravens, ...explosions].forEach(element => element.update(deltaTime));
  [...ravens, ...explosions].forEach(element => element.draw());
  ravens = ravens.filter((item) => !item.markedForDeletion)
  explosions = explosions.filter((item) => !item.markedForDeletion)
  if (!gameover) requestAnimationFrame(animate);
  else drawGameOver();
}
animate(0);

