var AM = new AssetManager();

function distance(a, b) {
    // if (a.name === "Bomberman"){
    //     var dx = a.x+24 - b.x+25;
    //     var dy = a.y+70 - b.y+25;
    //     return Math.sqrt(dx * dx + dy * dy);
    // }
    if (a.name === "Bomberman") {
        var dx = (a.x + 23) - b.x + 25;
        var dy = (a.y + 81) - b.y + 25;
        return Math.sqrt(dx * dx + dy * dy);
    }
    if (a.name === "Ugly") {
        var dx = a.x + 24 - b.x + 25;
        var dy = a.y + 36 - b.y + 25;
        return Math.sqrt(dx * dx + dy * dy);
    }
    if (a.name === "Flame") {
        var dx = a.x + 25 - b.x + 25;
        var dy = a.y + 25 - b.y + 25;
        return Math.sqrt(dx * dx + dy * dy);
    }
    // console.log("MY A: "+a.name+" my B: "+b.name);
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
}

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

Animation.prototype.drawFrame = function (tick, ctx, x, y) {
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
    ctx.strokeRect(x + 7, y + 64, 33, 33);
    // ctx.strokeRect(this.cx, this.cy, this.cxx, this.cyy);
    ctx.beginPath();
    ctx.fillStyle = "Red";
    // ctx.arc(x+25,y+75,5,0,Math.PI*2,false);
    ctx.arc(x + 24, y + 81, 5, 0, Math.PI * 2, false);
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
    this.leftOffset = 5;
    this.rightOffset = 55;
    this.topOffset = 8;
    this.bottomOffset = 60;
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

Ugly.prototype.collideLeft = function () {
    return (this.x + this.leftOffset) < 50;
};

Ugly.prototype.collideRight = function () {
    return (this.x + this.rightOffset) > 1000;
};

Ugly.prototype.collideTop = function () {
    return (this.y + this.topOffset) < 50;
};

Ugly.prototype.collideBottom = function () {
    return (this.y + this.bottomOffset) > 600;
};
Ugly.prototype.update = function () {
    // this.x += this.game.clockTick * this.speed;
    // if (this.x > 800) this.x = -230;
    Entity.prototype.update.call(this);
    if (!this.collideTop()) {
        if (this.game.chars['KeyW']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 2, false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 2;
            this.y -= 2;
        }
    }
    if (!this.collideBottom()) {
        if (this.game.chars['KeyS']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 1, false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 1;
            this.y += 2;
        }
    }
    if (!this.collideRight()) {
        if (this.game.chars['KeyD']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 0,false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 0;
            this.x += 2;
        }
    }
    if (!this.collideLeft()) {
        if (this.game.chars['KeyA']) {
            //this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, true);
            this.animation.spriteSheet = this.leftsprite;
            this.animation.startrow = 0;
            this.animation.reverse = true;
            this.x -= 2;
        }
    }
    // if (this.game.keyDown) {
    //     this.animation.loop = true;
    // } else if (!this.game.keyDown) {
    //     this.animation.loop = false;
    // }
}

Ugly.prototype.draw = function () {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    if (this.game.chars['KeyW'] || this.game.chars['KeyS'] ||
        this.game.chars['KeyA'] || this.game.chars['KeyD']) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(0, this.ctx, this.x, this.y);
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
    this.bombs = 5;
    this.bombLvl = 2;
    this.name = "Bomberman";
    this.passTop = false;
    this.passRight = false;
    this.passBottom = false;
    this.passLeft = false;
    Entity.call(this, game, 50, 0);
    // this.leftOffset = 3;
    // this.rightOffset = 48;
    // this.topOffset = 28;
    // this.bottomOffset = 100;
    this.leftOffset = 7;
    this.rightOffset = 33;
    this.topOffset = 64;
    this.bottomOffset = 97;
    this.fourPosition = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    // ctx.strokeRect(x+7,y+77,33,20);
    this.cx = this.x + 7;
    this.cxx = 34;
    this.cy = this.y + 64;
    this.cyy = 34;
}

Bomberman.prototype = new Entity();
Bomberman.prototype.constructor = Bomberman;

Bomberman.prototype.collide = function (other) {
    return distance(this, other) < 17 + 24;
    // return(this.x+this.leftOffset < other.x
    // && this.x+this.rightOffset > other.x
    // && this.y+this.topOffset < other.y
    // && this.y+this.bottomOffset > other.y);
};

// Bomberman.prototype.collideLeft = function () {
//     // console.log("TELL ME MY COODINATE: {"+this.x+","+this.y+"}");
//     // console.log("name: "+other.name+"\nmy x: " + other.x+"\nmy y: " + other.y);
//     // console.log("WHAT IS MY PASSLEFT before: "+this.passLeft);
//     // console.log("WHAT IS MY PASSLEFT after: "+this.passLeft+"\n");
//     // return (this.x + this.leftOffset ) > other.x+50;
//     return this.x+7 < 0;
// };
//
// Bomberman.prototype.collideRight = function () {
//     // return (this.x + this.rightOffset) > other.x;
//     return this.x+7+33 > 1500;
// };
//
// Bomberman.prototype.collideTop = function () {
//     // return (this.y + this.topOffset) < other.y+50;
//     return this.y+64 < 0;
// };
//
// Bomberman.prototype.collideBottom = function () {
//     // return (this.y + this.bottomOffset) > other.y;
//     return this.y+64+33 > 650;
// };
Bomberman.prototype.collideLeft = function (other) {
    // console.log("TELL ME MY COODINATE: {"+this.x+","+this.y+"}");
    // console.log("name: "+other.name+"\nmy x: " + other.x+"\nmy y: " + other.y);
    // console.log("WHAT IS MY PASSLEFT before: "+this.passLeft);
    // console.log("WHAT IS MY PASSLEFT after: "+this.passLeft+"\n");
    // return (this.x + this.leftOffset ) > other.x+50;
    var temp = (this.x + 7 <= other.x + 50) && (this.x + 7 + 33 >= other.x + 50)
        && (((this.y + 64 + 33 >= other.y) && (this.y + 64 <= other.y))
        || ((this.y + 64 <= other.y + 50) && (this.y + 64 + 33 >= other.y + 50))
        || ((this.y + 64 >= other.y) && (this.y + 64 + 33 <= other.y + 50)));
    if (temp) {
        this.x += 5;
    }
    return temp;
};

Bomberman.prototype.collideRight = function (other) {
    // return (this.x + this.rightOffset) > other.x;
    // right side collide object && left side is left side of the object
    var temp = (this.x + 7 + 33 >= other.x) && (this.x + 7 <= other.x)
        // &&
        && (((this.y + 64 + 33 >= other.y) && (this.y + 64 <= other.y))
        || ((this.y + 64 <= other.y + 50) && (this.y + 64 + 33 >= other.y + 50))
        || ((this.y + 64 >= other.y) && (this.y + 64 + 33 <= other.y + 50)));
    if (temp) {
        this.x -= 5;
    }
    return temp;
};

Bomberman.prototype.collideTop = function (other) {
    // return (this.y + this.topOffset) < other.y+50;
    var temp = (this.y + 64 <= other.y + 50) && (this.y + 64 + 33 >= other.y + 50)
        && (((this.x + 7 + 33 >= other.x) && (this.x + 7 <= other.x))
        || ((this.x + 7 <= other.x + 50) && (this.x + 7 + 33 >= other.x + 50))
        || ((this.x + 7 >= other.x) && (this.x + 7 + 33 <= other.x + 50)));
    if (temp) {
        this.y += 5;
    }
    return temp;
};

Bomberman.prototype.collideBottom = function (other) {
    // return (this.y + this.bottomOffset) > other.y;
    var temp = (this.y + 64 + 33 >= other.y) && (this.y + 64 <= other.y)
        && (((this.x + 7 + 33 >= other.x) && (this.x + 7 <= other.x))
        || ((this.x + 7 <= other.x + 50) && (this.x + 7 + 33 >= other.x + 50))
        || ((this.x + 7 >= other.x) && (this.x + 7 + 33 <= other.x + 50)));
    if (temp) {
        this.y -= 5;
    }
    return temp;
};

Bomberman.prototype.update = function () {
    // console.log("MY CX: " + this.cx + " MY CY: " + this.cy);
    // console.log("MY X: " + this.x + " MY Y: " + this.y);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
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

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        // var tempCollide = this.collide(ent);
        // if (ent !== this && this.collide(ent)) {
        //     console.log("ent name: "+ent.name);
        this.passTop = this.collideTop(ent);
        this.passBottom = this.collideBottom(ent);
        this.passRight = this.collideRight(ent);
        this.passLeft = this.collideLeft(ent);
        // }
    }

    if (!this.passTop) {
        if (this.game.chars['ArrowUp']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 2, false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 2;
            this.y -= 5;
        }
    }
    if (!this.passBottom) {
        if (this.game.chars['ArrowDown']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 1, false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 1;
            this.y += 5;
        }
    }
    if (!this.passRight) {
        if (this.game.chars['ArrowRight']) {
            //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 0,false);
            this.animation.spriteSheet = this.sprite;
            this.animation.startrow = 0;
            this.x += 5;
        }
    }
    if (!this.passLeft) {
        if (this.game.chars['ArrowLeft']) {
            //this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, true);
            this.animation.spriteSheet = this.leftsprite;
            this.animation.startrow = 0;
            this.animation.reverse = true;
            this.x -= 5;
        }
    }

    // if (this.pass) {
    //     if (!this.collideTop()) {
    //         if (this.game.chars['ArrowUp']) {
    //             //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 2, false);
    //             this.animation.spriteSheet = this.sprite;
    //             this.animation.startrow = 2;
    //             this.y -= 5;
    //         }
    //     }
    //     if (!this.collideBottom()) {
    //         if (this.game.chars['ArrowDown']) {
    //             //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 1, false);
    //             this.animation.spriteSheet = this.sprite;
    //             this.animation.startrow = 1;
    //             this.y += 5;
    //         }
    //     }
    //     if (!this.collideRight()) {
    //         if (this.game.chars['ArrowRight']) {
    //             //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 0,false);
    //             this.animation.spriteSheet = this.sprite;
    //             this.animation.startrow = 0;
    //             this.x += 5;
    //         }
    //     }
    //     if (!this.collideLeft()) {
    //         if (this.game.chars['ArrowLeft']) {
    //             //this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, true);
    //             this.animation.spriteSheet = this.leftsprite;
    //             this.animation.startrow = 0;
    //             this.animation.reverse = true;
    //             this.x -= 5;
    //         }
    //     } //This was used for bomb lvl up
    if (this.game.chars['KeyC']) {
        if (this.bombLvl < 10) {
            this.bombLvl++;
        }

    }
    // }
    this.pass = true;
    this.cx = this.x + 7;
    this.cy = this.y + 64;
    if (this.cooldown === 0 && this.game.chars['Space']) { //create new bomb
        this.cooldown = 0.25;
        var bomb = new Bomb(this.game, AM.getAsset("./img/Bomb.png"), this.bombLvl);
        // bomb.x = this.x;
        // bomb.y = this.y;
        this.game.addEntity(bomb);
        // Entity.call(bomb, this.game, this.x + this.animation.frameWidth - bomb.animation.frameWidth - 11
        //     , this.y + this.animation.frameHeight - bomb.animation.frameHeight - 24);
        var x = (Math.floor(((this.x + this.leftOffset + 5) + this.animation.frameWidth - bomb.animation.frameWidth - 11) / 50)) * 50;
        var y = (Math.floor((this.y + 90) / 50)) * 50;
        Entity.call(bomb, this.game, x + 6, y + 6);
    }
    Entity.prototype.update.call(this);
}

Bomberman.prototype.draw = function () {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    if (this.game.chars['ArrowUp'] || this.game.chars['ArrowRight'] ||
        this.game.chars['ArrowDown'] || this.game.chars['ArrowLeft']) {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    } else {
        this.animation.drawFrame(0, this.ctx, this.x, this.y);
    }
    Entity.prototype.draw.call(this);
}

function Bomb(game, spritesheet, currentBombLvl) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.sprite = spritesheet;
    // this.animation = new Animation(spritesheet, 48, 48, 8, 1, 8, true, 0.5, 0, false);
    this.animation = new Animation(spritesheet, 48, 48, 3, 1, 3, true, 1, 0, false);
    // this.firePosition = [[0,0], [30, 0], [0, 30], [-30, 0], [0, -30], [60, 0], [0, 60], [-60, 0], [0, -60]];
    //                   LEFT   ,  RIGHT,   UP  ,  BOTTOM
    this.firePosition = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    this.ctx = game.ctx;
    this.currentLvl = currentBombLvl;
    this.name = "Bomb";
    this.explode = false;
    this.stoptry = false;
    //Entity.call(this, game, 100, 100);console.log(this.x +" "+ this.y );

}

Bomb.prototype = new Entity();
Bomb.prototype.constructor = Bomb;

Bomb.prototype.update = function () {
    //Checking if the bomb animation has ended
    if (this.animation.totalTime - this.animation.elapsedTime < 1 /*||
     this.explode*/) { // try to do flame collide bomb, bomb explode immediately.
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
        var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
        this.game.addEntity(flame);
        Entity.call(flame, this.game, this.x, this.y);
        //Creates flames after bombs explosion, loop will run base on bombs current lvl
        for (var i = 0; i < 4; i++) {
            for (var j = 1; j <= this.currentLvl; j++) {
                var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
                this.game.addEntity(flame);
                Entity.call(flame, this.game, this.x + this.firePosition[i][0] * 30 * j,
                    this.y + this.firePosition[i][1] * 30 * j);
                // if (j === 0 ) {
                //     break;
                // }
                if (this.stoptry) {
                    console.log("How about me?????????");
                    // flame.stop = false;
                    break;
                }
            }
        }
        // This code will be used to making the bomb shake
        // if (this.shake && this.removeFromWorld != true) {
        //     this.x += 10;
        //     this.shake = false;
        //     console.log("hello world");
        // } else if (!this.shake && this.removeFromWorld != true) {
        //     this.x -= 10;
        //     this.shake = true;
        //     console.log("world hello");
        // }
    }
    Entity.prototype.update.call(this);
}

Bomb.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

function Flame(game, spritesheet) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.sprite = spritesheet;
    // this.animation = new Animation(spritesheet, 48, 48, 8, 1, 8, true, 0.5, 0, false);
    this.animation = new Animation(spritesheet, 48, 48, 5, 0.4, 5, true, 0.8, 0, false);
    this.ctx = game.ctx;
    this.name = "Flame";
    this.stop = false;
    //Entity.call(this, game, 100, 100);
}

Flame.prototype = new Entity();
Flame.prototype.constructor = Bomb;

Flame.prototype.collide = function (other) {
    return distance(this, other) < 50;
};

Flame.prototype.update = function () {
    //Checking if the bomb animation has ended
    if (this.animation.totalTime - this.animation.elapsedTime < 1) {
        this.removeFromWorld = true;
    }
    Entity.prototype.update.call(this);

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            // if (ent.name === "Wall" && ent.name !== "Background" && ent.name !== "star" && !ent.removeFromWorld) {
            //     console.log("Hello I'm HERE!!!!!!!");
            //     this.removeFromWorld = true;
            //     this.stop = true;
            // }
            if (ent.name !== "Flame" && ent.name !== "Bomberman" &&
                ent.name !== "Wall" && ent.name !== "Background" && !ent.removeFromWorld) {
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
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    this.name = "Wall";
    this.here = true;
};

Wall.prototype.collide = function (other) {
    return distance(this, other) < 25;
};

Wall.prototype.draw = function () {
    this.ctx.strokeStyle = "Red";
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
    // for debugging (to use it have to comment top 2 line and comment out bot 1 line)
    this.ctx.strokeRect(this.x,this.y,50, 50);
};

Wall.prototype.update = function () {
    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (ent !== this && this.collide(ent)) {
            if (ent.name === "Flame" && !ent.removeFromWorld) {
                ent.removeFromWorld = true;
            }
        }
    }
};

// AM.queueDownload("./img/RobotUnicorn.png");
// AM.queueDownload("./img/guy.jpg");
// AM.queueDownload("./img/mushroomdude.png");
// AM.queueDownload("./img/runningcat.png");
// AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/farback.gif");
AM.queueDownload("./img/starfield.png");
AM.queueDownload("./img/bomberman.png");
AM.queueDownload("./img/SideSprite.png");
AM.queueDownload("./img/ugly.png");
AM.queueDownload("./img/Bomb.png");
AM.queueDownload("./img/Flame.png");
AM.queueDownload("./img/DestoryableBox.png");
AM.queueDownload("./img/SolidBlock.png");
var friction = 1;
//This method call starts the game, using the function as a callback function for when all the resources are finished.
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    // var p = 20;
    // var bh = 600;
    // var bw = 1000;
    // var that = this;
    // function drawBoard(ctx){
    //     for (var x = 10; x <= bw; x += 50) {
    //         ctx.beginPath();
    //         ctx.moveTo(0.5 + x + p, p);
    //         ctx.lineTo(0.5 + x + p, bh + p);
    //         ctx.closePath();
    //         ctx.strokeStyle = "black";
    //         ctx.stroke();
    //     }
    //
    //
    //     for (var x = 10; x <= bh; x += 50) {
    //         ctx.beginPath();
    //         ctx.moveTo(p, 0.5 + x + p);
    //         ctx.lineTo(bw + p, 0.5 + x + p);
    //         ctx.closePath();
    //         ctx.strokeStyle = "black";
    //         ctx.stroke();
    //     }
    //
    //     ctx.strokeStyle = "black";
    //     ctx.stroke();
    // }
    //
    // drawBoard(ctx);

    gameEngine.init(ctx);
    gameEngine.start();
    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/farback.gif")));
    gameEngine.addEntity(new BackgroundStars(gameEngine, AM.getAsset("./img/starfield.png")));
    // Most Left and Most Right VERTICAL walls
    for (var i = 1; i <= 11; i++) {
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 0, i * 50);
        gameEngine.addEntity(circle);
        // gameEngine.map[0][i] = circle;
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 1000, i * 50);
        gameEngine.addEntity(circle);
        // gameEngine.map[20][i] = circle;
    }
    // Most Top and Most Bottom HORIZONTAL walls
    for (var i = 0; i < 21; i++) {
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), i * 50, 0);
        gameEngine.addEntity(circle);
        // gameEngine.map[i][0] = circle;
        var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), i * 50, 600);
        gameEngine.addEntity(circle);
        // gameEngine.map[i][12] = circle;
    }
    // Walls in the middle
    for (var row = 2; row <= 10; row += 2) {
        for (var column = 2; column < 20; column += 2) {
            var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), column * 50, row * 50);
            gameEngine.addEntity(circle);
            // gameEngine.map[column][row] = circle;
        }
    }
    // var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 200, 200);
    // gameEngine.addEntity(circle);
    // var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 200, 300);
    // gameEngine.addEntity(circle);
    // var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 300, 200);
    // gameEngine.addEntity(circle);
    // var circle = new Wall(gameEngine, AM.getAsset("./img/SolidBlock.png"), 300, 300);
    // gameEngine.addEntity(circle);
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));
    gameEngine.addEntity(new Bomberman(gameEngine, AM.getAsset("./img/bomberman.png")));
    //gameEngine.addEntity(new Ugly(gameEngine, AM.getAsset("./img/ugly.png")));

    console.log("All Done!");
    // for (var i = 0; i < 100; i++) {
    //     var circle = new Ugly(gameEngine, AM.getAsset("./img/ugly.png"));
    //     gameEngine.addEntity(circle);
    // }
    // for (var i = 0; i < 80; i++) {

    // }
    // drawBoard(ctx);
});