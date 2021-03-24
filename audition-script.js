let c = document.getElementById("myCanvas");
let ctx = c.getContext("2d");
c.height = 300;
c.width = 700;

addEventListener("keydown",getKeyDown);
function getKeyDown(event) {
    switch (event.keyCode) {
        case 37:
            play(0);
            break;
        case 38:
            play(1);
            break;
        case 39:
            play(2);
            break;
        case 40:
            play(3);
            break;
    }
}

let Rectangle = function Rectangle(x,y,value) {
    this.x = x;
    this.y = y;
    this.value = value;
    this.color = "white";
    this.draw = function() {
        let img = new Image();
        switch (this.value) {
            case 0:
                img.src = "./images/left.jpg"
                break;
            case 1:
                img.src = "./images/up.jpg"
                break;
            case 2:
                img.src = "./images/right.jpg"
                break;
            case 3:
                img.src = "./images/down.jpg"
                break;
        }
        img.onload = function () {
            ctx.drawImage(img, x, y, 50, 50);
        }
        ctx.beginPath();
        ctx.rect(this.x, this.y + 50, 50, 10);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let rectangles = [];
let playIndex = 0;
updateRectangles();
setInterval(updateRectangles, 3000);
function updateRectangles() {
    playIndex = 0;
    rectangles = [];
    let startingPoint = ((c.width - 680)/2);
    for (let i = 0; i < 10; i++) {
        let x = startingPoint + (i * 70);
        let y = 50;
        let value = parseInt(Math.random()*4);
        rectangles.push(new Rectangle(x, y, value));
    }
    console.log(rectangles);
}

let animationFrameID;
requestAnimationFrame(render);
function render() {
    // ctx.clearRect(0,0,700, 500);
    //draw rectangles
    for (let i = 0; i < rectangles.length; i++) {
        rectangles[i].draw();
    }
    //check win
    console.log(playIndex);
    if (playIndex > 9) {
        // cancelAnimationFrame(animationFrameID);
        // alert("YOU WON");
        // return;
        console.log("Perfect");
    }
    animationFrameID = requestAnimationFrame(render);
}

function play(value) {
    if (rectangles[playIndex].value === value) {
        rectangles[playIndex].color = "green";
        playIndex++;
    } else {
        rectangles[playIndex].color = "purple";
    }
}

