const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval= 500;
let lastTime = 0;

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
  }
  
  draw(){
    ctx.drawImage(this.image,this.frame * this.spriteWidth,0, this.spriteWidth, this.spriteHeight,this.x, this.y, this.width,this.height);
  }
}

function drawscore() {
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 50, 75);
  
}
window.addEventListener('click', function(e){
  console.log(e.x, e.y)
  const detectPixelColor = ctx.getImageData(e.x, e.y,1,1).eraseToPixels();
  console.log(detectPixelColor);
})


function animate(timestamp) {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltaTime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  drawscore();
  [...ravens].forEach(element => element.update(deltaTime));
  [...ravens].forEach(element => element.draw());
  ravens = ravens.filter((item) => !item.markedForDeletion)
  requestAnimationFrame(animate);

}
animate(0);

