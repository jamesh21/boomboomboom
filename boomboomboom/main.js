var AM = new AssetManager();

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

// function MushroomDude(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 189, 230, 5, 0.10, 14, true, 1);
//     this.x = 0;
//     this.y = 0;
//     this.speed = 100;
//     this.game = game;
//     this.ctx = game.ctx;
// }
//
// MushroomDude.prototype.draw = function () {
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
// }
//
// MushroomDude.prototype.update = function () {
//     if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
//         this.x += this.game.clockTick * this.speed;
//     if (this.x > 800) this.x = -230;
// }
//
//
// // inheritance
// function Cheetah(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 512, 256, 2, 0.05, 8, true, 0.5);
//     this.speed = 350;
//     this.ctx = game.ctx;
//     Entity.call(this, game, 0, 250);
// }
//
// Cheetah.prototype = new Entity();
// Cheetah.prototype.constructor = Cheetah;
//
// Cheetah.prototype.update = function () {
//     if (this.animation.elapsedTime < this.animation.totalTime * 8 / 14)
//         this.x += this.game.clockTick * this.speed;
//     //this.x += this.game.clockTick * this.speed;
//     if (this.x > 800) this.x = 0;
//     Entity.prototype.update.call(this);
// }
//
// Cheetah.prototype.draw = function () {
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//     Entity.prototype.draw.call(this);
// }
//
// // inheritance
// function Guy(game, spritesheet) {
//     this.animation = new Animation(spritesheet, 154, 215, 4, 0.15, 8, true, 0.5);
//     this.speed = 100;
//     this.ctx = game.ctx;
//     Entity.call(this, game, 0, 450);
// }
//
// Guy.prototype = new Entity();
// Guy.prototype.constructor = Guy;
//
// Guy.prototype.update = function () {
//     this.x += this.game.clockTick * this.speed;
//     if (this.x > 800) this.x = -230;
//     Entity.prototype.update.call(this);
// }
//
// Guy.prototype.draw = function () {
//     this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
//     Entity.prototype.draw.call(this);
// }

// inheritance
function Ugly(game, spritesheet) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    // this.animation = new Animation(spritesheet, 64, 50, 8, 0.15, 8, true, 0.5);
    this.sprite = spritesheet;
    this.leftsprite = this.flip(spritesheet);
    this.animation = new Animation(spritesheet, 64, 64, 6, 0.05, 6, true, 1, 0, false);
    this.speed = 200;
    this.ctx = game.ctx;
    Entity.call(this, game, 100, 100);
}

Ugly.prototype = new Entity();
Ugly.prototype.constructor = Ugly;

Ugly.prototype.update = function () {
    // this.x += this.game.clockTick * this.speed;
    // if (this.x > 800) this.x = -230;
    if (this.game.chars['KeyW']) {
        //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 2, false);
        this.animation.spriteSheet = this.sprite;
        this.animation.startrow = 2;
        this.y-=2 ;
    }
    if (this.game.chars['KeyD']) {
        //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 0,false);
        this.animation.spriteSheet = this.sprite;
        this.animation.startrow = 0;
        this.x+=2 ;
    }
    if (this.game.chars['KeyS']) {
        //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 1, false);
        this.animation.spriteSheet = this.sprite;
        this.animation.startrow = 1;
        this.y+=2;
    }
    if (this.game.chars['KeyA']) {
        //this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, true);
        this.animation.spriteSheet = this.leftsprite;
        this.animation.startrow = 0;
        this.animation.reverse = true;
        this.x-=2;
    }
    Entity.prototype.update.call(this);
}

Ugly.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

// inheritance
function Bomberman(game, spritesheet) {
    this.sprite = spritesheet;
    this.leftsprite = this.flip(spritesheet);
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    // this.animation = new Animation(spritesheet, 64, 50, 8, 0.15, 8, true, 0.5);
    this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, false);
    this.speed = 200;
    this.ctx = game.ctx;
    Entity.call(this, game, 0, 0);
}

Bomberman.prototype = new Entity();
Bomberman.prototype.constructor = Bomberman;

Bomberman.prototype.update = function () {
    if (this.game.chars['ArrowUp']) {
        //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 2, false);
        this.animation.spriteSheet = this.sprite;
        this.animation.startrow = 2;
        this.y-=2 ;
    }
    if (this.game.chars['ArrowRight']) {
        //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 0,false);
        this.animation.spriteSheet = this.sprite;
        this.animation.startrow = 0;
        this.x+=2 ;
    }
    if (this.game.chars['ArrowDown']) {
        //this.animation = new Animation(this.sprite, 64, 133, 8, 0.05, 8, true, 0.5, 1, false);
        this.animation.spriteSheet = this.sprite;
        this.animation.startrow = 1;
        this.y+=2;
    }
    if (this.game.chars['ArrowLeft']) {
        //this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.5, 0, true);
        this.animation.spriteSheet = this.leftsprite;
        this.animation.startrow = 0;
        this.animation.reverse = true;
        this.x-=2;
    }
    Entity.prototype.update.call(this);
}

Bomberman.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/RobotUnicorn.png");
AM.queueDownload("./img/guy.jpg");
AM.queueDownload("./img/mushroomdude.png");
AM.queueDownload("./img/runningcat.png");
AM.queueDownload("./img/background.jpg");
AM.queueDownload("./img/farback.gif");
AM.queueDownload("./img/starfield.png");
AM.queueDownload("./img/bomberman.png");
AM.queueDownload("./img/SideSprite.png");
AM.queueDownload("./img/ugly.png");

//This method call starts the game, using the function as a callback function for when all the resources are finished.
AM.downloadAll(function () {
    var canvas = document.getElementById("gameWorld");
    var ctx = canvas.getContext("2d");

    var gameEngine = new GameEngine();
    gameEngine.init(ctx);
    gameEngine.start();

    // gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/background.jpg")));
    gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/farback.gif")));
    gameEngine.addEntity(new BackgroundStars(gameEngine, AM.getAsset("./img/starfield.png")));
    // gameEngine.addEntity(new MushroomDude(gameEngine, AM.getAsset("./img/mushroomdude.png")));
    // gameEngine.addEntity(new Cheetah(gameEngine, AM.getAsset("./img/runningcat.png")));
    // gameEngine.addEntity(new Guy(gameEngine, AM.getAsset("./img/guy.jpg")));
    gameEngine.addEntity(new Bomberman(gameEngine, AM.getAsset("./img/bomberman.png")));
    gameEngine.addEntity(new Ugly(gameEngine, AM.getAsset("./img/ugly.png")));

    console.log("All Done!");
});