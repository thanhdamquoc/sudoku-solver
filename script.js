let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");

c.style.border = "1px solid black";
c.width = 700;
c.height = 500;

c.addEventListener("click",getClickEvent);
c.addEventListener("mousemove",getMousePosition);
addEventListener("keydown",getKeyDown);

function getKeyDown(event) {
    if (event.keyCode === 32) {
        let projectileSpeed = 15;
        let projectileVelocity = getSpeedXAndSpeedY(mouseCurrent.x, mouseCurrent.y, player1.x, player1.y, projectileSpeed)
        projectiles.push(new Projectile(player1.x,player1.y, 5, projectileSpeed, "green", projectileVelocity[0], projectileVelocity[1]));
    }
}

function getMousePosition(event) {
    mouseCurrent.x = event.offsetX;
    mouseCurrent.y = event.offsetY;
}

function getClickEvent(event) {
    mouseLastClick.x = event.offsetX;
    mouseLastClick.y = event.offsetY;
    let playerVelocity = getSpeedXAndSpeedY(mouseLastClick.x, mouseLastClick.y, player1.x, player1.y, player1.speed);
    player1.speedX = playerVelocity[0];
    player1.speedY = playerVelocity[1];
}

function getSpeedXAndSpeedY(mouseX, mouseY, objX, objY, objSpeed) {
    let distX = mouseX - objX;
    let distY = mouseY - objY;
    let dist = Math.hypot(distX, distY);
    let ratio = objSpeed / dist;
    return [distX * ratio, distY * ratio]
}

let Mouse = function Mouse(x,y) {
    this.x = x;
    this.y = y;
}
let mouseLastClick = new Mouse(0,0);
let mouseCurrent = new Mouse(0, 0)

let Projectile = function Projectile(x,y,size, speed, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    this.update = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        this.draw();
    }
}

let Player = function Player(x,y,size, speed, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
    this.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.strokeStyle = this.color;
        ctx.stroke();
    }
    this.update = function () {
        this.stopAtClickDestination();
        this.checkOffScreen();
        this.x += this.speedX;
        this.y += this.speedY;
        this.draw();

    }
    this.stopAtClickDestination = function () {
        let dist = Math.hypot(this.x - mouseLastClick.x, this.y - mouseLastClick.y);
        let isAtDestination = dist < this.size;
        if (isAtDestination) {
            this.speedX = 0;
            this.speedY = 0;
        }
    }
    this.checkOffScreen = function () {
        if (this.x - this.size < 0) {this.x = this.size}
        if (this.x + this.size > c.width) {this.x = c.width - this.size}
        if (this.y - this.size < 0) {this.y = this.size}
        if (this.y + this.size > c.height) {this.y = c.height - this.size}
    }
}

let enemies = [];
let projectiles = [];
let player1 = new Player(50,50,10,5,"black",0 ,0);

function render() {
    let animationFrameID = requestAnimationFrame(render);
    ctx.clearRect(0,0, c.width, c.height);
    player1.update();
    //spawn enemies x,y,size, speed, color, speedX, speedY
    if (Math.random() < 0.01) {
        enemies.push(new Player(Math.random()*c.width, Math.random()*c.height,10, 0, "red", 0, 0));
    }
    //render enemies
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].update();
        for (let j = 0; j < projectiles.length; j++) {
            let distX = enemies[i].x - projectiles[j].x;
            let distY = enemies[i].y - projectiles[j].y;
            let dist = Math.hypot(distX,distY);
            if (dist < (enemies[i].size + projectiles[j].size)) {
                enemies.splice(i,1);
                projectiles.splice(j, 1);
            }
        }
    }
    //render projectiles
    for (let i = 0; i < projectiles.length; i++) {
        projectiles[i].update();
        //remove off screen projectiles
        if ((projectiles[i].x - projectiles[i].size < 0) ||
        (projectiles[i].x + projectiles[i].size > c.width) ||
        (projectiles[i].y - projectiles[i].size < 0) ||
        (projectiles[i].y + projectiles[i].size > c.height)) {
            projectiles.splice(i,1);
        }
    }
}
requestAnimationFrame(render);