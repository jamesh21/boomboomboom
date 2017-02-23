var AM = new AssetManager();
var gameEngine = new GameEngine();
var soundManager = new SoundManager();
function distance(a, b) {
    // if (a.name === "Bomberman"){
    //     var dx = a.x+24 - b.x+25;
    //     var dy = a.y+70 - b.y+25;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }
    // if (a.name === "Bomberman") {
    //     var dx = (a.x + 23) - b.x + 25;
    //     var dy = (a.y + 81) - b.y + 25;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }
    // if (a.name === "Ugly") {
    //     var dx = a.x + 24 - b.x + 25;
    //     var dy = a.y + 36 - b.y + 25;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }
    // if (a.name === "Flame") {
    //     var dx = a.center.x - b.center.x;
    //     var dy = a.y + 25 - b.y + 25;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }
    // console.log("MY A: "+a.name+" my B: "+b.name);
    var dx = a.center.x - b.center.x;
    var dy = a.center.y - b.center.y;
    return Math.sqrt(dx * dx + dy * dy);
}

var mouseX = 0;
var mouseY = 0;
var gameStarted = false;
// var firstPlayerButton = new Button(234, 452, 388, 418);
var firstPlayerButton = new Button(224, 462, 378, 428);
var twoPlayerButton = new Button(600, 868, 378, 428);

// When function is called, it checks if the click was within the button boundaires.
function mouseClicked(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (firstPlayerButton.isClicked() && !gameStarted) {
        gameStarted = true;
        startSinglePlayerGame();
    } else if (twoPlayerButton.isClicked() && !gameStarted) {
        gameStarted = true;
        startTwoPlayerGame();
    }
}

// This function is used for changing which state the mouse cursor should be in.
function mouseMoved(e) {
    if ((firstPlayerButton.xLeft <= e.clientX && e.clientX <= firstPlayerButton.xRight &&
        firstPlayerButton.yTop <= e.clientY && e.clientY <= firstPlayerButton.yBottom && !gameStarted) ||
        (twoPlayerButton.xLeft <= e.clientX && e.clientX <= twoPlayerButton.xRight &&
        twoPlayerButton.yTop <= e.clientY && e.clientY <= twoPlayerButton.yBottom && !gameStarted)) {
        document.documentElement.style.cursor = "url(./img/HeadCursor.png),auto";
    } else {
        document.documentElement.style.cursor = "auto";
    }
}

// Button class which presents the buttons to start the game
function Button(leftX, rightX, topY, bottomY) {
    this.xLeft = leftX;
    this.xRight = rightX;
    this.yTop = topY;
    this.yBottom = bottomY;
}

// Checking if the button was clicked on to begin the game.
Button.prototype.isClicked = function () {
    if (this.xLeft <= mouseX && mouseX <= this.xRight && this.yTop <= mouseY && mouseY <= this.yBottom) {
        return true;
    }
};

function Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop,
                   scale, startrow, reverse) {
    this.spriteSheet = spriteSheet;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.sheetWidth = sheetWidth;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.scale = scale;
    this.startrow = startrow;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, cx, cy, cxx, cyy) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var xindex = 0;
    var yindex = 0;
    // this code is because in the beginning after i flipped the image,
    // when the direction toward left, it seems like moon walk so
    // i reverse the x index count. However, it looks totally same.
    // so i comment it out and using old method......
    // if (this.re) {
    //     xindex = this.sheetWidth - 1 - (frame % this.sheetWidth);
    // } else {
    //     xindex = frame % this.sheetWidth;
    // }
    xindex = frame % this.sheetWidth;
    if (this.startrow === 0) {
        yindex = Math.floor(frame / this.sheetWidth);
        //console.log("This is when the start row is 0 " + yindex);
    } else {
        yindex = this.startrow + Math.floor(frame / this.sheetWidth);
        //console.log("This is when the start row is not 0 " + yindex);
    }

    ctx.drawImage(this.spriteSheet,
        xindex * this.frameWidth, yindex * this.frameHeight,  // source from sheet
        this.frameWidth, this.frameHeight,
        x, y,
        this.frameWidth * this.scale,
        this.frameHeight * this.scale);
    ctx.strokeRect(x, y, this.frameWidth * this.scale,
        this.frameHeight * this.scale);
    ctx.strokeRect(cx, cy, cxx, cyy);
    // ctx.strokeRect(this.cx, this.cy, this.cxx, this.cyy);
    ctx.beginPath();
    ctx.fillStyle = "Red";
    // ctx.arc(x+25,y+75,5,0,Math.PI*2,false);
    ctx.arc(cx + cxx / 2, cy + cyy / 2, 5, 0, Math.PI * 2, false);
    ctx.fill();
    ctx.closePath();
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

// no inheritance
function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "Background";
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};

Background.prototype.update = function () {
};

function BackgroundStars(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.starsOn = false;
    this.name = "BackgroundStar";
};

BackgroundStars.prototype.draw = function () {
    // after I added '!' in the if statement, star go completely black.
    if (!this.starsOn) {
        this.ctx.drawImage(this.spritesheet,
            this.x, this.y);
        this.ctx.drawImage(this.spritesheet,
            700, this.y);
    }
};

BackgroundStars.prototype.update = function () {
    // console.log(Math.round( this.game.timer.gameTime * 10 ) / 10);
    if (this.starsOn && Math.floor(this.game.timer.gameTime) % 2 === 0) {
        // console.log("yyyyyyyy");
        this.starsOn = false;
    } else {
        // console.log("nonononono");
        this.starsOn = true;
    }
};


// inheritance
function Ugly(game, spritesheet) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    // this.animation = new Animation(spritesheet, 64, 50, 8, 0.15, 8, true, 0.5);
    this.sprite = spritesheet;
    this.leftsprite = this.flip(spritesheet);
    this.animation = new Animation(spritesheet, 64, 64, 6, 0.05, 6, true, 1, 1, false);
    this.speed = 200;
    this.ctx = game.ctx;
    this.name = "Ugly";
    this.radius = 24;
    // this.leftOffset = 5;
    // this.rightOffset = 55;
    // this.topOffset = 8;
    // this.bottomOffset = 60;
    this.cooldown = 0;
    this.cx = this.x + 15;
    this.cxx = 34;
    this.cy = this.y + 23;
    this.cyy = 34;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.passTop = false;
    this.passRight = false;
    this.passBottom = false;
    this.passLeft = false;
    this.radius = 17;
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    // Entity.call(this, game, this.radius + Math.random() * (1000 - this.radius * 2), this.radius + Math.random() * (600 - this.radius * 2));
    Entity.call(this, game, 945, 540);
}

Ugly.prototype = new Entity();
Ugly.prototype.constructor = Ugly;

// Ugly.prototype.collide = function (other) {
//     return distance(this, other) < 24 + 24;
// };
//
// Ugly.prototype.collideLeft = function () {
//     return (this.x + 5) < 0 + 50;
// };
//
// Ugly.prototype.collideRight = function () {
//     return (this.x + 55) > 1000;
// };
//
// Ugly.prototype.collideTop = function () {
//     return (this.y + 8) < 0 + 50;
// };
//
// Ugly.prototype.collideBottom = function () {
//     return (this.y + 60) > 600;
// };
Ugly.prototype.collide = function (other) {
    return distance(this, other) < 40;
};

Ugly.prototype.collideLeft = function (other) {
    // return (this.x + this.leftOffset) < 50;
    var temp = (this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx)
        && (((this.cy + this.cyy >= other.cy) && (this.cy <= other.cy))
        || ((this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy))
        || ((this.cy >= other.cy) && (this.cy + this.cyy <= other.cy + other.cyy)));
    if (temp) {
        this.x += 5;
    }
    return temp;
};

Ugly.prototype.collideRight = function (other) {
    // return (this.x + this.rightOffset) > 1000;
    var temp = (this.cx + this.cxx >= other.cx) && (this.cx <= other.cx)
        // &&
        && (((this.cy + this.cyy >= other.cy) && (this.cy <= other.cy))
        || ((this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy))
        || ((this.cy >= other.cy) && (this.cy + this.cyy <= other.cy + other.cyy)));
    if (temp) {
        this.x -= 5;
    }
    return temp;
};

Ugly.prototype.collideTop = function (other) {
    // return (this.y + this.topOffset) < 50;
    var temp = (this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy)
        && (((this.cx + this.cxx >= other.cx) && (this.cx <= other.cx))
        || ((this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx))
        || ((this.cx >= other.cx) && (this.cx + this.cxx <= other.cx + other.cxx)));
    if (temp) {
        this.y += 5;
    }
    return temp;
};

Ugly.prototype.collideBottom = function (other) {
    // return (this.y + this.bottomOffset) > 600;
    var temp = (this.cy + this.cyy >= other.cy) && (this.cy <= other.cy)
        && (((this.cx + this.cxx >= other.cx) && (this.cx <= other.cx))
        || ((this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx))
        || ((this.cx >= other.cx) && (this.cx + this.cxx <= other.cx + other.cxx)));
    if (temp) {
        this.y -= 5;
    }
    return temp;
};

Ugly.prototype.update = function () {
    // this.x += this.game.clockTick * this.speed;
    // if (this.x > 800) this.x = -230;
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        // var tempCollide = this.collide(ent);
        if (ent !== this && ent.name !== "Bomberman") {
            //     console.log("ent name: "+ent.name);
            this.passTop = this.collideTop(ent);
            this.passBottom = this.collideBottom(ent);
            this.passRight = this.collideRight(ent);
            this.passLeft = this.collideLeft(ent);
        }
    }
    if (!this.passTop) {
        if (this.game.chars['KeyW']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 2, false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 2;
            this.y -= 5;
        }
    }
    if (!this.passBottom) {
        if (this.game.chars['KeyS']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 1, false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 1;
            this.y += 5;
        }
    }
    if (!this.passRight) {
        if (this.game.chars['KeyD']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 0,false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 0;
            this.x += 5;
        }
    }
    if (!this.passLeft) {
        if (this.game.chars['KeyA']) {
            //this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, true);
            this.animation.spriteSheet = this.leftsprite;
            this.animation.startrow = 0;
            this.animation.reverse = true;
            this.x -= 5;
        }
    }
    this.cx = this.x + 15;
    this.cy = this.y + 23;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    // if (this.game.keyDown) {
    //     this.animation.loop = true;
    // } else if (!this.game.keyDown) {
    //     this.animation.loop = false;
    // }
    Entity.prototype.update.call(this);
}

Ugly.prototype.draw = function () {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    if (this.game.chars['KeyW'] || this.game.chars['KeyS'] ||
        this.game.chars['KeyA'] || this.game.chars['KeyD']) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    } else {
        this.animation.drawFrame(0, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    }
    Entity.prototype.draw.call(this);
}

// inheritance
function Bomberman(game, spritesheet) {
    this.sprite = spritesheet;
    this.leftsprite = this.flip(spritesheet);
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    // this.animation = new Animation(spritesheet, 64, 50, 8, 0.15, 8, true, 0.5);
    this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.8, 1, false);
    this.speed = 200;
    this.ctx = game.ctx;
    this.cooldown = 0;
    this.currentBombOnField = 0;
    this.bombLvl = 1;
    this.flameLvl = 2;
    this.speedLvl = 6;
    this.debuffTimer = 0;
    this.isConfused = 1;
    this.name = "Bomberman";
    this.passTop = false;
    this.passRight = false;
    this.passBottom = false;
    this.passLeft = false;
    this.cx = this.x + 7;
    this.cxx = 34;
    this.cy = this.y + 64;
    this.cyy = 34;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.radius = 17;
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    this.insideBomb = null;
    Entity.call(this, game, 50, 0);
}

Bomberman.prototype = new Entity();
Bomberman.prototype.constructor = Bomberman;

Bomberman.prototype.collide = function (other) {
    return distance(this, other) < this.radius+other.radius;
};

Bomberman.prototype.collideLeft = function (other) {
    var temp = (this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx)
        && (((this.cy + this.cyy >= other.cy) && (this.cy <= other.cy))
        || ((this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy))
        || ((this.cy >= other.cy) && (this.cy + this.cyy <= other.cy + other.cyy)));
    if (temp) {
        this.x += this.speedLvl;
    }
    return temp;
};

Bomberman.prototype.collideRight = function (other) {
    var temp = (this.cx + this.cxx >= other.cx) && (this.cx <= other.cx)
        // &&
        && (((this.cy + this.cyy >= other.cy) && (this.cy <= other.cy))
        || ((this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy))
        || ((this.cy >= other.cy) && (this.cy + this.cyy <= other.cy + other.cyy)));
    if (temp) {
        this.x -= this.speedLvl;
    }
    return temp;
};

Bomberman.prototype.collideTop = function (other) {
    var temp = (this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy)
        && (((this.cx + this.cxx >= other.cx) && (this.cx <= other.cx))
        || ((this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx))
        || ((this.cx >= other.cx) && (this.cx + this.cxx <= other.cx + other.cxx)));
    if (temp) {
        this.y += this.speedLvl;
    }
    return temp;
};

Bomberman.prototype.collideBottom = function (other) {
    var temp = (this.cy + this.cyy >= other.cy) && (this.cy <= other.cy)
        && (((this.cx + this.cxx >= other.cx) && (this.cx <= other.cx))
        || ((this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx))
        || ((this.cx >= other.cx) && (this.cx + this.cxx <= other.cx + other.cxx)));
    if (temp) {
        this.y -= this.speedLvl;
    }
    return temp;
};

Bomberman.prototype.update = function () {
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;

    if (this.debuffTimer > 0) this.debuffTimer -= this.game.clockTick;
    if (this.debuffTimer < 0) this.debuffTimer = 0;
    this.cx = this.x + 7;
    this.cy = this.y + 64;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};

    if (this.isConfused === -1 && this.debuffTimer === 0) {
        this.isConfused = 1;
    }

    if (this.cooldown === 0 && this.game.chars['Space'] && this.currentBombOnField < this.bombLvl) { //create new bomb
        this.cooldown = 0.25;
        this.currentBombOnField++;
        var bomb = new Bomb(this.game, AM.getAsset("./img/Bomb.png"), this);
        //var bomb = new Bomb(this.game, AM.getAsset("./img/Bomb.png"), this.flameLvl);
        // bomb.x = this.x;
        // bomb.y = this.y;
        this.game.addEntity(bomb);
        // Entity.call(bomb, this.game, this.x + this.animation.frameWidth - bomb.animation.frameWidth - 11
        //     , this.y + this.animation.frameHeight - bomb.animation.frameHeight - 24);
        // var x = (Math.floor(((this.x + this.leftOffset + 5) + this.animation.frameWidth - bomb.animation.frameWidth - 11) / 50)) * 50;
        // var y = (Math.floor((this.y + 90) / 50)) * 50;
        // Entity.call(bomb, this.game, x + 6, y + 6);
        // var x = (Math.floor(this.center.x / 50)) * 50;
        // var y = (Math.floor(this.center.y / 50)) * 50;
        var x = this.position.x * 50;
        var y = this.position.y * 50;
        bomb.center.x = x+25;
        bomb.center.y = y+25;
        for (var i = 0; i < this.game.players_bots.length; i++) {
            var character = this.game.players_bots[i];
            console.log(character.name);
            if (bomb.collide(character)) {
                character.insideBomb = bomb;
            }
        }
        // this.insideBomb = bomb;
        // for (var i = 0; i < this.game.players_bots.length; i++) {
        //     var character = this.game.players_bots[i];
        //     if (this.collide(character)) {
        //         this.insideBomb = bomb;
        //     }
        // }
        Entity.call(bomb, this.game, x, y);
    }
    // console.log("my center x: " + this.center.x + " my center y: " + this.center.y);
    // Entity.prototype.update.call(this);
    // for (var i = 0; i < this.game.walls.length; i++) {
    //     var wall = this.game.walls[i];
    //     var dist = distance(wall, this);
    //     if (this.collide({x: wall.x, y: wall.y, radius: 25})) {
    //         var difX = (wall.x - this.x) / dist;
    //         var difY = (wall.y - this.y) / dist;
    //         this.x -= difX * 10 / (dist * dist);
    //         this.y -= difY * 10 / (dist * dist);
    //     }
    // }
    // console.log("Before: "+this.insideBomb);
    if (this.insideBomb != null) {
        // console.log(this.insideBomb);
        // console.log("BOMB CENTER X: "+this.insideBomb.center.x);
        // console.log("AM I COLLIDING!!!!!!!!!!!!! "+this.collide(this.insideBomb));
        if (!this.collide(this.insideBomb)||this.insideBomb.removeFromWorld) {
            // console.log("FUNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN");
            this.insideBomb = null;
        }
    }

    // console.log("After: "+this.insideBomb);
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        // if (ent.name ==="Bomb") {
        //     console.log(ent.name);
        // }
        // var tempCollide = this.collide(ent);
        if (ent !== this && ent.name !== "Ugly"
            && ent.name !== "Background" && ent.name !== "BackgroundStar" && !ent.removeFromWorld) {
            //     console.log("ent name: "+ent.name);
            if (ent.name !== "Bomb" || this.insideBomb == null){
                this.passTop = this.collideTop(ent);
                this.passBottom = this.collideBottom(ent);
                this.passRight = this.collideRight(ent);
                this.passLeft = this.collideLeft(ent);
            } /*else if (this.insideBomb == null) {
                // if (this.insideBomb != null) {
                //     console.log("ent.x: " + ent.x + " this.insideBomb.x: " + this.insideBomb.x);
                // }
                this.passTop = this.collideTop(ent);
                this.passBottom = this.collideBottom(ent);
                this.passRight = this.collideRight(ent);
                this.passLeft = this.collideLeft(ent);
            }*/else if (ent.x != this.insideBomb.x || ent.y != this.insideBomb.y){
                this.passTop = this.collideTop(ent);
                this.passBottom = this.collideBottom(ent);
                this.passRight = this.collideRight(ent);
                this.passLeft = this.collideLeft(ent);
            }
        }
    }
    // for(var i = 0; i <this.game.bombs.length; i++){
    //     var ent = this.game.bombs[i];
    //     if (!ent.removeFromWorld && this.insideBomb != null && ent.x != this.insideBomb.x && ent.y != this.insideBomb.y) {
    //         console.log("HELLO IM HERE!!!!!!!!!!!");
    //         this.passTop = this.collideTop(ent);
    //         this.passBottom = this.collideBottom(ent);
    //         this.passRight = this.collideRight(ent);
    //         this.passLeft = this.collideLeft(ent);
    //     }
    // }

    if (this.game.chars['ArrowUp']) {
        if (!this.passTop) {
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 2;
            this.y -= this.speedLvl * this.isConfused;
        }
    }
    else if (this.game.chars['ArrowDown']) {
        if (!this.passBottom) {
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 1;
            this.y += this.speedLvl * this.isConfused;
        }
    }
    else if (this.game.chars['ArrowRight']) {
        if (!this.passRight) {
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 0;
            this.x += this.speedLvl * this.isConfused;
        }
    }
    else if (this.game.chars['ArrowLeft']) {
        if (!this.passLeft) {
            this.animation.spriteSheet = this.leftsprite;
            this.animation.startrow = 0;
            this.animation.reverse = true;
            this.x -= this.speedLvl * this.isConfused;
        }
    }
    //This was used for bomb lvl up
    // if (this.game.chars['KeyC']) {
    //     if (this.bombLvl < 10) {
    //         this.bombLvl++;
    //     }
    //
    // }

    Entity.prototype.update.call(this);
}

Bomberman.prototype.draw = function () {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    if (this.game.chars['ArrowUp'] || this.game.chars['ArrowRight'] ||
        this.game.chars['ArrowDown'] || this.game.chars['ArrowLeft']) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    } else {
        this.animation.drawFrame(0, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    }
    Entity.prototype.draw.call(this);
}

function Bomb(game, spritesheet, owner) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.sprite = spritesheet;
    // this.animation = new Animation(spritesheet, 48, 48, 8, 1, 8, true, 0.5, 0, false);
    this.animation = new Animation(spritesheet, 48, 48, 3, 1, 3, true, 1, 0, false);
    // this.firePosition = [[0,0], [30, 0], [0, 30], [-30, 0], [0, -30], [60, 0], [0, 60], [-60, 0], [0, -60]];
    //                   LEFT   ,  RIGHT,   UP  ,  BOTTOM
    this.firePosition = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    this.ctx = game.ctx;
    this.currentLvl = owner.flameLvl;
    this.name = "Bomb";
    this.ownerOfBomb = owner;
    this.explode = false;
    this.stoptry = false;
    //Entity.call(this, game, 100, 100);console.log(this.x +" "+ this.y );
    this.cxx = 50;
    this.cyy = 50;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    this.radius = 25;
}

Bomb.prototype = new Entity();
Bomb.prototype.constructor = Bomb;

Bomb.prototype.collide = function (other) {
    return distance(this, other) < this.radius+other.radius;
};

// Bomb.prototype.checkLeft = function (other) {
//     return !(other.cx + other.cxx < this.x);
// };
//
// Bomb.prototype.checkRight = function (other) {
//     return !(other.cx > this.x + this.cxx);
// };
//
// Bomb.prototype.checkTop = function (other) {
//     return !(other.cy + other.cyy < this.y);
// };
//
// Bomb.prototype.checkBottom = function (other) {
//     return !(other.cy > this.y + this.cyy);
// };

Bomb.prototype.update = function () {
    //Checking if the bomb animation has ended
    if (this.animation.totalTime - this.animation.elapsedTime < 1) { // try to do flame collide bomb, bomb explode immediately.
        // but FAILED..........bomb just removed, won't trigger flame, don't know why
        // TODO do the above if we have time
        this.removeFromWorld = true;

        // //Creates flames after bombs explosion, loop will run base on bombs current lvl
        // for (var i = 0; i <= this.currentLvl; i++) {
        //     for (var j = 0; j < 4; j++) {
        //         var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
        //         this.game.addEntity(flame);
        //         Entity.call(flame, this.game, this.x + this.firePosition[j][0] * 30 * i,
        //             this.y + this.firePosition[j][1] * 30 * i);
        //         if (i === 0) {
        //             break;
        //         }
        //     }
        // }
        this.ownerOfBomb.currentBombOnField--;
        var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
        this.game.addEntity(flame);
        soundManager.playSound(soundManager.explosion);
        Entity.call(flame, this.game, this.x, this.y);
        //Creates flames after bombs explosion, loop will run base on bombs current lvl
        // for (var i = 0; i < 4; i++) {
        //     for (var j = 1; j <= this.currentLvl; j++) {
        //         var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
        //         this.game.addEntity(flame);
        //         Entity.call(flame, this.game, this.x + this.firePosition[i][0] * 50 * j,
        //             this.y + this.firePosition[i][1] * 50 * j);
        //         // if (j === 0 ) {
        //         //     break;
        //         // }
        //         // if (flame.collide()) {
        //         //     console.log("How about me?????????");
        //         //     // flame.stop = false;
        //         //     break;
        //         // }
        //     }
        // }
        var positions = this.printFlameHelper();
        for (var i = 0; i < positions.length; i++) {
            var pos = positions[i];
            var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
            this.game.addEntity(flame);
            Entity.call(flame, this.game, pos.x * 50,
                pos.y * 50);
        }
    }
    // for (var i = 0; i < this.game.players_bots.length; i++) {
    //     var character = this.game.players_bots[i];
    //     if (this.collide(character)) {
    //         character.insideBomb = this;
    //     }
    // }
    this.cx = this.x;
    this.cy = this.y;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    Entity.prototype.update.call(this);
}

Bomb.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

Bomb.prototype.printFlameHelper = function () {
    var positions = [];
    positions.push(this.position);
    for (var i = 0; i < 4; i++) {
        for (var j = 1; j <= this.currentLvl; j++) {
            var x = this.position.x + this.firePosition[i][0] * j;
            var y = this.position.y + this.firePosition[i][1] * j;
            var stop = false;
            for (var k = 0; k < this.game.walls.length; k++) {
                var entW = this.game.walls[k];
                if (entW.position.x === x && entW.position.y === y) {
                    stop = true;
                    // print = false;
                    break;
                }
            }
            if (stop) {
                break;
            }
            for (var l = 0; l < this.game.destroyable.length; l++) {
                var entD = this.game.destroyable[l];
                if (entD.position.x === x && entD.position.y === y) {
                    positions.push({x: x, y: y});
                    stop = true;
                    break;
                }
            }
            if (stop) {
                break;
            } else {
                positions.push({x: x, y: y});
            }
        }
    }
    return positions;
}

function Flame(game, spritesheet) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.sprite = spritesheet;
    // this.animation = new Animation(spritesheet, 48, 48, 8, 1, 8, true, 0.5, 0, false);
    this.animation = new Animation(spritesheet, 48, 48, 5, 0.4, 5, true, 1, 0, false);
    this.ctx = game.ctx;
    this.name = "Flame";
    this.stop = false;
    this.cx = this.x;
    this.cy = this.y;
    this.cxx = 50;
    this.cyy = 50;
    this.center = {x: (this.cx + 25), y: (this.cy + 25)};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    this.radius = 25;
    //Entity.call(this, game, 100, 100);
}

Flame.prototype = new Entity();
Flame.prototype.constructor = Bomb;

Flame.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Flame.prototype.update = function () {
    //Checking if the flame animation has ended
    if (this.animation.totalTime - this.animation.elapsedTime < 1) {
        this.removeFromWorld = true;
    }
    this.cx = this.x;
    this.cy = this.y;
    this.center = {x: (this.cx + 25), y: (this.cy + 25)};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    // console.log("my x: "+this.cx+" my y: "+this.cy);
    Entity.prototype.update.call(this);

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name !== "Flame"
            && ent.name !== "Background" && ent.name !== "BackgroundStar"
            && this.collide(ent)) {
            this.stop = true;
            // if (ent.name === "Wall" && ent.name !== "Background" && ent.name !== "star" && !ent.removeFromWorld) {
            //     console.log("Hello I'm HERE!!!!!!!");
            //     this.removeFromWorld = true;
            //     this.stop = true;
            // }
            if (ent.name !== "Bomberman" && /*ent.name !== "Bomb" &&*/
                ent.name !== "Wall" && ent.name !== "Background" && !ent.removeFromWorld && ent.name !== "FlamePowerup"
                && ent.name !== "SpeedPowerup" && ent.name !== "BombPowerup" && ent.name != "SpeedPowerdown" && ent.name != "ConfusionPowerdown") {
                if (ent.name === "Destroyable" && ent.hasPowerup) {
                    if (ent.hasSpeedPowerup) {
                        console.log("Speed!!!!!!!!!!!!");
                        var speedUp = new SpeedPowerup(this.game, AM.getAsset("./img/SpeedPowerup.png"), ent.x, ent.y);
                        this.game.addEntity(speedUp);
                    } else if (ent.hasBombPowerup) {
                        console.log("Bomb!!!!!!!!!!!!!!!");
                        var bombUp = new BombPowerup(this.game, AM.getAsset("./img/BombPowerup.png"), ent.x, ent.y);
                        this.game.addEntity(bombUp);
                    } else if (ent.hasConfusionPowerdown) {
                        var confusionDown = new ConfusionPowerdown(this.game, AM.getAsset("./img/ConfusionPowerdown.png"), ent.x, ent.y);
                        this.game.addEntity(confusionDown);
                    } else if(ent.hasSpeedPowerdown) {
                        var speedDown = new SpeedPowerdown(this.game, AM.getAsset("./img/SpeedPowerdown.png"), ent.x, ent.y);
                        this.game.addEntity(speedDown);
                    } else {
                        console.log("Flame!!!!!!!!!!!!!!!");
                        var flameUp = new FlamePowerup(this.game, AM.getAsset("./img/FlamePowerup.png"), ent.x, ent.y);
                        this.game.addEntity(flameUp);
                    }
                }

                // This is for when the flame kills another bomb, which will right away blow the bomb that was hit
                // I wanna make a helper function for this, so we dont have to use this code two times!!!!!!!!!!!!!!!!
                if (ent.name === "Bomb") {
                    ent.ownerOfBomb.currentBombOnField--;
                    // var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
                    // this.game.addEntity(flame);
                    // soundManager.playSound(soundManager.explosion);
                    // Entity.call(flame, this.game, ent.x, ent.y);
                    //Creates flames after bombs explosion, loop will run base on bombs current lvl
                    // for (var i = 0; i < 4; i++) {
                    //     for (var j = 1; j <= ent.currentLvl; j++) {
                    //         var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
                    //         this.game.addEntity(flame);
                    //         Entity.call(flame, this.game, ent.x + ent.firePosition[i][0] * 50 * j,
                    //             ent.y + ent.firePosition[i][1] * 50 * j);
                    //     }
                    // }
                    var positions = ent.printFlameHelper();
                    for (var i = 0; i < positions.length; i++) {
                        var pos = positions[i];
                        var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
                        this.game.addEntity(flame);
                        Entity.call(flame, this.game, pos.x * 50,
                            pos.y * 50);
                    }
                }
                ent.removeFromWorld = true;
            }
            // if (ent.name === "Bomb") {
            //     ent.explode = true;
            // }
        }
    }
}

Flame.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// no inheritance
function Wall(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "Wall";
    this.radius = 25;
    this.here = true;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
};

Wall.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Wall.prototype.draw = function () {
    this.ctx.strokeStyle = "Red";
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
    // for debugging (to use it have to comment top 2 line and comment out bot 1 line)
    this.ctx.strokeRect(this.x, this.y, 50, 50);
};

Wall.prototype.update = function () {
    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    // if (ent !== this && this.collide({x: ent.center.x, y: ent.center.y, radius: ent.radius})) {
    //     if (ent.name === "Flame" && !ent.removeFromWorld) {
    //         ent.removeFromWorld = true;
    //     }
    // }
    // }
};

function Destroyable(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.radius = 25;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "Destroyable";
    this.hasPowerup = false;
    this.hasBombPowerup = false;
    this.hasSpeedPowerup = false;
    this.hasFlamePowerup = false;
    this.hasSpeedPowerdown = false;
    this.hasConfusionPowerdown = false;
    this.here = true;
};

Destroyable.prototype.collide = function (other) {
    return distance(this, other) < 25;
};

Destroyable.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
};

Destroyable.prototype.update = function () {
    // for (var i = 0; i < this.game.entities.length; i++) {
    //     var ent = this.game.entities[i];
    //     if (ent !== this && ent.name !== "Background" && ent.name !== "BackgroundStar" && this.collide(ent)) {
    //         if (ent.name === "Flame" && !ent.removeFromWorld) {
    //             ent.removeFromWorld = true;
    //
    //         }
    //     }
    // }
};

function BombPowerup(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "BombPowerup";
    this.here = true;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.radius = 25;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
};

BombPowerup.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius + 2;
};

BombPowerup.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
};

BombPowerup.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name !== "Background" && ent.name !== "BackgroundStar" && this.collide(ent)) {
            if (ent.name === "Bomberman" && !ent.removeFromWorld) {
                soundManager.playSound(soundManager.bombUp);
                if (ent.bombLvl < 6) {
                    ent.bombLvl++;
                    console.log("Bomb Lvl =" + ent.bombLvl);
                }
                this.removeFromWorld = true;
            }
        }
    }
};

function FlamePowerup(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "FlamePowerup";
    this.here = true;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.radius = 25;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
};

FlamePowerup.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius + 2;
};

FlamePowerup.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
};

FlamePowerup.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name !== "Background" && ent.name !== "BackgroundStar" && this.collide(ent)) {
            if (ent.name === "Bomberman" && !ent.removeFromWorld) {
                soundManager.playSound(soundManager.fireUp);
                if (ent.flameLvl < 6) {
                    ent.flameLvl++;
                    console.log("Flame lvl =" + ent.flameLvl);
                }
                this.removeFromWorld = true;
            }
        }
    }
};

function SpeedPowerup(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "SpeedPowerup";
    this.here = true;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.radius = 25;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
};

SpeedPowerup.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius + 2;
};

SpeedPowerup.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
};

SpeedPowerup.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name !== "Background" && ent.name !== "BackgroundStar" && this.collide(ent)) {
            if (ent.name === "Bomberman" && !ent.removeFromWorld) {
                soundManager.playSound(soundManager.speedUp);
                if (ent.speedLvl < 10) {
                    ent.speedLvl++;
                    console.log("Speed lvl =" + ent.speedLvl);
                }
                this.removeFromWorld = true;
            }
        }
    }
};

function SpeedPowerdown(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "SpeedPowerdown";
    this.here = true;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.radius = 25;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
};

SpeedPowerdown.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius+2;
};

SpeedPowerdown.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
};

SpeedPowerdown.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name !== "Background" && ent.name !== "BackgroundStar" && this.collide(ent)) {
            if (ent.name === "Bomberman" && !ent.removeFromWorld) {
                //soundManager.playSound(soundManager.speedUp);
                if (ent.speedLvl > 1) {
                    ent.speedLvl--;
                    console.log("Speed lvl =" + ent.speedLvl);
                }
                this.removeFromWorld = true;
            }
        }
    }
};

function ConfusionPowerdown(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "ConfusionPowerdown";
    this.here = true;
    this.cx = this.x;
    this.cxx = 50;
    this.cy = this.y;
    this.cyy = 50;
    this.radius = 25;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
};

ConfusionPowerdown.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius+2;
};

ConfusionPowerdown.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
};

ConfusionPowerdown.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && ent.name !== "Background" && ent.name !== "BackgroundStar" && this.collide(ent)) {
            if (ent.name === "Bomberman" && !ent.removeFromWorld) {
                ent.isConfused = -1;
                ent.debuffTimer = 5;
                this.removeFromWorld = true;
            }
        }
    }
};

AM.queueDownload("./img/MainMenu.png");
AM.queueDownload("./sound/MenuBackgroundSound.mp3");
AM.queueDownload("./img/farback.gif");
AM.queueDownload("./img/starfield.png");
AM.queueDownload("./img/bomberman.png");
AM.queueDownload("./img/SideSprite.png");
AM.queueDownload("./img/ugly.png");
AM.queueDownload("./img/Bomb.png");
AM.queueDownload("./img/Flame.png");
AM.queueDownload("./img/DestoryableBox.png");
AM.queueDownload("./img/SolidBlock.png");
AM.queueDownload("./img/BombPowerup.png");
AM.queueDownload("./img/FlamePowerup.png");
AM.queueDownload("./img/SpeedPowerup.png");
AM.queueDownload("./img/SpeedPowerdown.png");
AM.queueDownload("./img/ConfusionPowerdown.png");

var friction = 1;
//This method call starts the game, using the function as a callback function for when all the resources are finished.
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    canvas.style.cursor = "point";
    var ctx = canvas.getContext("2d");
    gameEngine.init(ctx);
    gameEngine.start();
    soundManager.init();
    soundManager.playSound(soundManager.menuBackgroundSound);
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/MainMenu.png")));

});

function startSinglePlayerGame() {
    soundManager.stopSound(soundManager.menuBackgroundSound);
    soundManager.playSound(soundManager.gameBackgroundSound);
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/farback.gif")));
    gameEngine.addEntity(new BackgroundStars(gameEngine, AM.getAsset("./img/starfield.png")));
    // Most Left and Most Right VERTICAL walls
    for (var i = 1; i <= 11; i++) {
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 0, i * 50);
        gameEngine.addEntity(circle);
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 1000, i * 50);
        gameEngine.addEntity(circle);
    }
    // Most Top and Most Bottom HORIZONTAL walls
    for (var i = 0; i < 21; i++) {
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), i * 50, 0);
        gameEngine.addEntity(circle);
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), i * 50, 600);
        gameEngine.addEntity(circle);
    }
    // Walls in the middle
    for (var row = 2; row <= 10; row += 2) {
        for (var column = 2; column < 20; column += 2) {
            var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), column * 50, row * 50);
            gameEngine.addEntity(circle);
            gameEngine.addOffLimitPlacement(circle.x, circle.y);
        }
    }

    // Keeping the area around each players starting position clear.
    var startingPosition = [[50, 50], [100, 50], [50, 100], [50, 500], [50, 550], [100, 550], [900, 50], [950, 50],
        [950, 100], [950, 500], [900, 550], [950, 550]];
    for (var i = 0; i < startingPosition.length; i++) {
        gameEngine.addOffLimitPlacement(startingPosition[i][0], startingPosition[i][1]);
    }

    // Placing Destroyable boxes
    for (var row = 1; row <= 11; row++) {
        for (var column = 1; column < 20; column++) {
            var xPosition = column * 50;
            var yPosition = row * 50;
            var hasWall = false;
            for (var i = 0; i < gameEngine.offLimitPlacement.length; i++) {
                if (gameEngine.offLimitPlacement[i].x === xPosition && gameEngine.offLimitPlacement[i].y === yPosition) {
                    hasWall = true;
                    break;
                }
            }
            if (!hasWall) {
                var block = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), xPosition, yPosition);
                gameEngine.addEntity(block);
                gameEngine.randomItemPlacement.push(block);
            }
        }
    }

    // For removing random destroyables from the map each time.
    var numberOfDestroyable = gameEngine.destroyable.length;
    for (var i = 30; i > 0; i--) {
        var position = Math.floor((Math.random() * numberOfDestroyable));
        gameEngine.destroyable[position].removeFromWorld = true;
        numberOfDestroyable--;
    }

    // Removing the empty spaces from the destroyable list
    for (var i = gameEngine.destroyable.length - 1; i >= 0; i--) {
        if (gameEngine.destroyable[i].removeFromWorld) {
            gameEngine.destroyable.splice(i, 1);
            gameEngine.randomItemPlacement.splice(i, 1);
        }
    }

    // Placing bomb powerup inside boxes
    var numberOfPossibleItemPlacement = gameEngine.randomItemPlacement.length;
    for (var i = 0; i < 18; i++) {
        var position = Math.floor((Math.random() * numberOfPossibleItemPlacement));
        gameEngine.randomItemPlacement[position].hasPowerup = true;
        gameEngine.randomItemPlacement[position].hasBombPowerup = true;
        gameEngine.randomItemPlacement.splice(position, 1);
        numberOfPossibleItemPlacement--;

    }

    // Placing flame powerup inside boxes
    for (var i = 0; i < 24; i++) {
        var position = Math.floor((Math.random() * numberOfPossibleItemPlacement));
        gameEngine.randomItemPlacement[position].hasPowerup = true;
        gameEngine.randomItemPlacement[position].hasFlamePowerup = true;
        gameEngine.randomItemPlacement.splice(position, 1);
        numberOfPossibleItemPlacement--;
    }

    // Placing speed powerup inside boxes
    for (var i = 0; i < 9; i++) {
        var position = Math.floor((Math.random() * numberOfPossibleItemPlacement));
        gameEngine.randomItemPlacement[position].hasPowerup = true;
        gameEngine.randomItemPlacement[position].hasSpeedPowerup = true;
        gameEngine.randomItemPlacement.splice(position, 1);
        numberOfPossibleItemPlacement--;
    }

    // Placing speed powerdown inside boxes
    for (var i = 0; i < 5; i++) {
        var position = Math.floor((Math.random() * numberOfPossibleItemPlacement));
        gameEngine.randomItemPlacement[position].hasPowerup = true;
        gameEngine.randomItemPlacement[position].hasSpeedPowerdown = true;
        gameEngine.randomItemPlacement.splice(position, 1);
        numberOfPossibleItemPlacement--;
    }

    // Placing confusion powerdown inside boxes
    for (var i = 0; i < 5; i++) {
        var position = Math.floor((Math.random() * numberOfPossibleItemPlacement));
        gameEngine.randomItemPlacement[position].hasPowerup = true;
        gameEngine.randomItemPlacement[position].hasConfusionPowerdown = true;
        gameEngine.randomItemPlacement.splice(position, 1);
        numberOfPossibleItemPlacement--;
    }

    gameEngine.addEntity(new Bomberman(gameEngine, AM.getAsset("./img/bomberman.png")));
    gameEngine.addEntity(new Ugly(gameEngine, AM.getAsset("./img/ugly.png")));

    console.log("All Done!");
    // for (var i = 0; i < 100; i++) {
    //     var circle = new Ugly(gameEngine, AM.getAsset("./img/ugly.png"));
    //     gameEngine.addEntity(circle);
    // }
    // for (var i = 0; i < 80; i++) {

    // }
    // drawBoard(ctx);
}
function startTwoPlayerGame() {
    console.log("Two Player Game");
}

// Sound Manager Object
function SoundManager() {
    this.menuBackgroundSound;
    this.gameBackgroundSound;
    this.explosion;

};

// Initializing the sound manager fields
SoundManager.prototype.init = function () {
    this.menuBackgroundSound = document.getElementById("backgroundMenuAudio");
    this.menuBackgroundSound.loop = true;
    this.gameBackgroundSound = document.getElementById("backgroundGameAudio");
    this.gameBackgroundSound.loop = true;
    this.explosion = document.getElementById("explosion");
    this.explosion.playbackRate = 3;
    this.speedUp = document.getElementById("speedUp");
    this.speedUp.playbackRate = 2;
    this.fireUp = document.getElementById("fireUp");
    this.fireUp.playbackRate = 1;
    this.fireUp.volume = 1;
    this.bombUp = document.getElementById("bombUp");
    this.bombUp.playbackRate = 1;
}

// Playing the sound
SoundManager.prototype.playSound = function (sound) {
    sound.play();
};

// Pausing the sound
SoundManager.prototype.stopSound = function (sound) {
    sound.pause();
}