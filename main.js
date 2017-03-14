const MAX_SPEED = 10;
const EACH_LEVEL_SPEED = 50;
const MAX_BOMB = 10;
const MAX_FLAME = 10;

var AM = new AssetManager();
var gameEngine = new GameEngine();
function distance(a, b) {
    var dx = a.center.x - b.center.x;
    var dy = a.center.y - b.center.y;
    return Math.sqrt(dx * dx + dy * dy);
}

var socket = io.connect("http://76.28.150.193:8888");
//socket.emit("save", { studentname: "James Ho", statename: "aState", x:5 });
//socket.emit("load", { studentname: "James Ho", statename: "aState" });
//socket.emit("load", { studentname: "James Ho", statename: "theState" });

window.onload = function () {

    socket.on("connect", function () {
        console.log("Socket connected.")
    });
    socket.on("disconnect", function () {
        console.log("Socket disconnected.")
    });
    socket.on("reconnect", function () {
        console.log("Socket reconnected.")
    });

};

socket.on("load", function (data) {
    clearGame();
    var savedEntities = data.entities;
    var temp;
    var object;
    for (var i = 0; i < savedEntities.length; i++) {
        temp = savedEntities[i];
        if (temp.name === "Destroyable") {
            object = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), temp.x, temp.y);
        } else if (temp.name === "Bot") {
            if (temp.color === "red") {
                object = new Bot(gameEngine, AM.getAsset("./img/bomberman_red.png"), temp.x, temp.y, temp.color);
            } else if (temp.color === "violet") {
                object = new Bot(gameEngine, AM.getAsset("./img/bomberman_violet.png"), temp.x, temp.y, temp.color);
            } else if (temp.color === "blue") {
                object = new Bot(gameEngine, AM.getAsset("./img/bomberman_blue.png"), temp.x, temp.y, temp.color);
            } else {
                object = new Bot(gameEngine, AM.getAsset("./img/bomberman_green.png"), temp.x, temp.y, temp.color);
            }
            object.cooldown = temp.cooldown;
            object.jumpCooldown = temp.jumpCooldown;
            object.currentBombOnField = temp.currentBombOnField;
            object.isJump = temp.isJump;
            object.passTop = temp.passTop;
            object.passRight = temp.passRight;
            object.passBottom = temp.passBottom;
            object.passLeft = temp.passLeft;
            object.insideBomb = temp.insideBomb;
            object.movingTarget = temp.movingTarget;
            object.movingTargetX = temp.movingTargetX;
            object.movingTargetY = temp.movingTargetY;
            object.directionX = temp.directionX;
            object.directionY = temp.directionY;
            object.stopAnime = temp.stopAnime;
            object.elapsedTime = temp.elapsedTime;
            object.jumpBeginY = temp.jumpBeginY;
            object.fireJump = temp.fireJump
            object.dangerousCount = temp.dangerousCount;

        }
        gameEngine.addEntity(object);
    }
});

function clearGame() {
    // gameEngine.entities = [];
    // gameEngine.destroyable = [];
    // gameEngine.walls = [];
    // gameEngine.bombs = [];
    // gameEngine.flames = [];
    // gameEngine.players_bots = [];
    // gameEngine.offLimitPlacement = [];
    // gameEngine.items = [];
    for (var i = 0; i < gameEngine.destroyable.length; i++) {
        var temp = gameEngine.destroyable[i];
        temp.removeFromWorld = true;
    }
    // for (var i = 0; i < gameEngine.bombs.length; i++) {
    //     var temp = gameEngine.bombs[i];
    //     temp.removeFromWorld = true;
    // }
    // for (var i = 0; i < gameEngine.flames.length; i++) {
    //     var temp = gameEngine.flames[i];
    //     temp.removeFromWorld = true;
    // }
    for (var i = 0; i < gameEngine.players_bots.length; i++) {
        var temp = gameEngine.players_bots[i];
        temp.removeFromWorld = true;
    }
}

function SaveBot(x, y, color) {
    this.color = color;
    this.cooldown = 0;
    this.jumpCooldown = 0;
    this.currentBombOnField = 0;
    this.isJump = false;
    this.name = "Bot";
    this.passTop = false;
    this.passRight = false;
    this.passBottom = false;
    this.passLeft = false;
    this.x = x;
    this.y = y;
    this.insideBomb = null;
    this.movingTarget = null;
    this.movingTargetX = null;
    this.movingTargetY = null;
    this.directionX = 0;
    this.directionY = 0;
    this.stopAnime = false;
    this.elapsedTime = 0;
    this.jumpBeginY = null;
    this.fireJump = false;
    this.dangerousCount = 0;
}

function SaveBomb(){

}

// function SaveWall(x, y) {
//     this.x = x;
//     this.y = y;
//     this.name = "Wall";
// }

function SaveDestroyable(x, y, name) {
    this.x = x;
    this.y = y;
    this.name = name;
}
function saveClick() {
    var saveEntities = [];
    var object;
    var temp;
    for (var i = 0; i < gameEngine.entities.length; i++) {
        temp = gameEngine.entities[i];
        if (temp.name === "Destroyable") {
            object = new SaveDestroyable(temp.x, temp.y, temp.name);
        } else if(temp.name === "Bot") {
            object = new SaveBot(temp.x, temp.y, temp.color);
            object.cooldown = temp.cooldown;
            object.jumpCooldown = temp.jumpCooldown;
            object.currentBombOnField = temp.currentBombOnField;
            object.isJump = temp.isJump;
            object.passTop = temp.passTop;
            object.passRight = temp.passRight;
            object.passBottom = temp.passBottom;
            object.passLeft = temp.passLeft;
            object.insideBomb = temp.insideBomb;
            object.movingTarget = temp.movingTarget;
            object.movingTargetX = temp.movingTargetX;
            object.movingTargetY = temp.movingTargetY;
            object.directionX = temp.directionX;
            object.directionY = temp.directionY;
            object.stopAnime = temp.stopAnime;
            object.elapsedTime = temp.elapsedTime;
            object.jumpBeginY = temp.jumpBeginY;
            object.fireJump = temp.fireJump
            object.dangerousCount = temp.dangerousCount;
        }
        saveEntities.push(object);
    }

    socket.emit("save", { studentname: "James Ho", statename: "aState", entities:saveEntities});
}
function loadClick() {
    socket.emit("load", { studentname: "James Ho", statename: "aState" });
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

Animation.prototype.drawFrame = function (tick, ctx, x, y, cx, cy, cxx, cyy) {
    this.elapsedTime += tick;
    if (this.isDone()) {
        if (this.loop) this.elapsedTime = 0;
    }
    var frame = this.currentFrame();
    var yindex = 0;
    xindex = frame % this.sheetWidth;
    if (this.startrow === 0) {
        yindex = Math.floor(frame / this.sheetWidth);
    } else {
        yindex = this.startrow + Math.floor(frame / this.sheetWidth);
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



function Bomb(game, spritesheet, owner) {
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    this.sprite = spritesheet;
    // this.animation = new Animation(spritesheet, 48, 48, 8, 1, 8, true, 0.5, 0, false);
    this.animation = new Animation(spritesheet, 48, 48, 3, 1, 3, false, 1, 0, false);
    // this.firePosition = [[0,0], [30, 0], [0, 30], [-30, 0], [0, -30], [60, 0], [0, 60], [-60, 0], [0, -60]];
    //                   LEFT   ,  RIGHT,   UP  ,  BOTTOM
    this.firePosition = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    this.ctx = game.ctx;
    this.currentLvl = owner.flameLvl;
    this.name = "Bomb";
    this.ownerOfBomb = owner;
    this.isMoving = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveTop = false;
    this.moveBot = false;
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
    return distance(this, other) < this.radius + other.radius + 1;
};


Bomb.prototype.update = function () {
    //Checking if the bomb animation has ended
    // if (this.animation.totalTime - this.animation.elapsedTime <1 ) {
    if (this.animation.isDone()) {
        this.removeFromWorld = true;


        this.ownerOfBomb.currentBombOnField--;
        var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
        this.game.addEntity(flame);
        Entity.call(flame, this.game, this.x, this.y);
        var positions = this.printFlameHelper();
        for (var i = 0; i < positions.length; i++) {
            // console.log(positions[0].x+", "+positions[0].y);
            var pos = positions[i];
            var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
            this.game.addEntity(flame);
            Entity.call(flame, this.game, pos.x * 50,
                pos.y * 50);
        }
    }

    this.cx = this.x;
    this.cy = this.y;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    if (this.isMoving) {
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent !== this && ent.name !== "SpeedPowerup" && ent.name !== "BombPowerup" && ent.name !== "KickPowerup"
                    && ent.name !== "Dead"
                && ent.name !== "FlamePowerup" && ent.name != "SpeedPowerdown" && ent.name != "ConfusionPowerdown"
                && ent.name !== "Background" && ent.name !== "BackgroundStar" && !ent.removeFromWorld && !this.removeFromWorld) {
                if (this.moveRight && (ent.position.y === this.position.y)
                    && (ent.position.x > this.position.x) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveRight = false;
                    this.moveBot = false;
                    this.moveTop = false;
                    this.moveLeft = false;
                    break;
                } else if (this.moveLeft && (ent.position.y === this.position.y)
                    && (ent.position.x < this.position.x) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveLeft = false;
                    break;
                } else if (this.moveTop && (ent.position.x === this.position.x)
                    && (ent.position.y < this.position.y) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveTop = false;
                    break;
                } else if (this.moveBot && (ent.position.x === this.position.x)
                    && (ent.position.y > this.position.y) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveBot = false;
                    break;
                }
            }
        }
    }

    if (this.moveRight) {
        this.x += (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    } else if (this.moveLeft) {
        this.x -= (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    } else if (this.moveTop) {
        this.y -= (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    } else if (this.moveBot) {
        this.y += (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    }

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
    if (this.animation.totalTime - this.animation.elapsedTime < 1.5) {
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
        // console.log(ent.name);
        if (ent !== this && ent.name !== "Flame" && ent.name !== "Dead"
            && ent.name !== "Background" && ent.name !== "BackgroundStar"
            && this.collide(ent)) {
            // if (ent.name === "Wall" && ent.name !== "Background" && ent.name !== "star" && !ent.removeFromWorld) {
            //     console.log("Hello I'm HERE!!!!!!!");
            //     this.removeFromWorld = true;
            //     this.stop = true;
            // }
            if (/*ent.name !== "Bomberman" &&*/ /*ent.name !== "Bot" &&*/
                ent.name !== "Wall" && ent.name !== "Background" && !ent.removeFromWorld && ent.name !== "FlamePowerup"
                && ent.name !== "SpeedPowerup" && ent.name !== "BombPowerup" && ent.name != "SpeedPowerdown" && ent.name != "ConfusionPowerdown" && ent.name != "KickPowerup") {
                if (ent.name === "Destroyable" && ent.hasPowerup) {
                    if (ent.hasSpeedPowerup) {
                        var speedUp = new SpeedPowerup(this.game, AM.getAsset("./img/SpeedPowerup.png"), ent.x, ent.y);
                        this.game.addEntity(speedUp);
                    } else if (ent.hasBombPowerup) {
                        var bombUp = new BombPowerup(this.game, AM.getAsset("./img/BombPowerup.png"), ent.x, ent.y);
                        this.game.addEntity(bombUp);
                    } else if (ent.hasConfusionPowerdown) {
                        var confusionDown = new ConfusionPowerdown(this.game, AM.getAsset("./img/ConfusionPowerdown.png"), ent.x, ent.y);
                        this.game.addEntity(confusionDown);
                    } else if (ent.hasSpeedPowerdown) {
                        var speedDown = new SpeedPowerdown(this.game, AM.getAsset("./img/SpeedPowerdown.png"), ent.x, ent.y);
                        this.game.addEntity(speedDown);
                    } else if (ent.hasKickPowerup) {
                        var kickUp = new KickPowerup(this.game, AM.getAsset("./img/KickPowerup.png"), ent.x, ent.y);
                        this.game.addEntity(kickUp);
                    } else {
                        var flameUp = new FlamePowerup(this.game, AM.getAsset("./img/FlamePowerup.png"), ent.x, ent.y);
                        this.game.addEntity(flameUp);
                    }
                }

                // This is for when the flame kills another bomb, which will right away blow the bomb that was hit
                // I wanna make a helper function for this, so we dont have to use this code two times!!!!!!!!!!!!!!!!
                if (ent.name === "Bomb") {
                    ent.ownerOfBomb.currentBombOnField--;
                    var positions = ent.printFlameHelper();
                    for (var i = 0; i < positions.length; i++) {
                        var pos = positions[i];
                        var flame = new Flame(this.game, AM.getAsset("./img/Flame.png"));
                        this.game.addEntity(flame);
                        Entity.call(flame, this.game, pos.x * 50, pos.y * 50);
                    }
                }
                if (ent.name === "Bomberman" || ent.name === "Ugly" || ent.name === "Bot") {
                    if (ent.isJump) {
                        continue;
                    } else {
                        var dead = new Dead(this.game, AM.getAsset("./img/Dead.png"),ent.center.x-64, ent.center.y-64);
                        this.game.addEntity(dead);
                        Entity.call(dead, this.game, ent.center.x-64, ent.center.y-64);
                        ent.removeFromWorld = true;
                        continue;
                    }
                }
                ent.removeFromWorld = true;
            }
        }
    }
}

Flame.prototype.draw = function () {
    this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    Entity.prototype.draw.call(this);
}
function Dead(game, spritesheet, x, y) {
    this.x = x;
    this.y = y;
    this.sprite = spritesheet;
    this.animation = new Animation(spritesheet, 128, 128, 10, 0.1, 10, false, 1, 0, false, 0.4, 0, false);
    this.ctx = game.ctx;
    this.name = "Dead";
}

Dead.prototype = new Entity();

Dead.prototype.update = function () {
    if (this.animation.isDone()) {
        this.removeFromWorld = true;
    }

}

Dead.prototype.draw = function () {
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
    this.isMoving = false;
    this.moveLeft = false;
    this.moveRight = false;
    this.moveTop = false;
    this.moveBot = false;
    this.dangerous = false;
};

Wall.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius + 5;
};
Wall.prototype.collideB = function (other) {
    return distance(this, other) < 25;
};
var rainbow = ["Yellow", "Red", "Orange", "Green", "Blue", "Cyan", "Pink", "White", "Purple"];
Wall.prototype.draw = function () {
    if (this.dangerous) {
        var color = rainbow[Math.floor(Math.random() * rainbow.length)];
        this.ctx.strokeStyle = color;
    } else {
        this.ctx.strokeStyle = "Yellow";
    }
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y, 50, 50);
    this.ctx.strokeRect(this.x, this.y, 50, 50);
};

Wall.prototype.update = function () {
    this.cx = this.x;
    this.cy = this.y;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    if (this.x === 0 && this.y === 0 && this.game.destroyable.length < 1) {
    }
    if (this.isMoving) {
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent !== this && ent.name !== "Bomberman" && ent.name !== "Ugly" && ent.name !== "Bot" && ent.name !== "Flame"
                && ent.name !== "Bomb" && ent.name !== "Dead"
                && ent.name !== "SpeedPowerup" && ent.name !== "BombPowerup"
                && ent.name !== "FlamePowerup" && ent.name != "SpeedPowerdown" && ent.name != "ConfusionPowerdown"
                && ent.name !== "Background" && ent.name !== "BackgroundStar" && !ent.removeFromWorld) {
                if (this.moveRight && (ent.position.y === this.position.y)
                    && (ent.position.x > this.position.x) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveRight = false;
                    this.moveBot = false;
                    this.moveTop = false;
                    this.moveLeft = false;
                    break;
                } else if (this.moveLeft && (ent.position.y === this.position.y)
                    && (ent.position.x < this.position.x) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveLeft = false;
                    break;
                } else if (this.moveTop && (ent.position.x === this.position.x)
                    && (ent.position.y < this.position.y) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveTop = false;
                    break;
                } else if (this.moveBot && (ent.position.x === this.position.x)
                    && (ent.position.y > this.position.y) && this.collide(ent)) {
                    this.isMoving = false;
                    this.moveBot = false;
                    break;
                }
            }
            if (ent !== this && (ent.name || "Bomberman" && ent.name || "Ugly" && ent.name || "Bot") && ent.name !== "Dead"
                && ent.name !== "Background" && ent.name !== "BackgroundStar" && !ent.removeFromWorld) {
                if (this.collideB(ent)) {
                    if (ent.name === "Bomberman" || ent.name === "Ugly" || ent.name === "Bot") {
                        var dead = new Dead(this.game, AM.getAsset("./img/Dead.png"), ent.center.x - 64, ent.center.y - 64);
                        this.game.addEntity(dead);
                        Entity.call(dead, this.game, ent.center.x - 64, ent.center.y - 64);
                    }
                    ent.removeFromWorld = true;
                }
            }
        }
    }

    if (this.moveRight) {
        this.x += (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    } else if (this.moveLeft) {
        this.x -= (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    } else if (this.moveTop) {
        this.y -= (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    } else if (this.moveBot) {
        this.y += (5+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    }
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
};



function Bot(game, spritesheet, x, y, color) {
    this.color = color;
    this.sprite = spritesheet;
    this.leftsprite = this.flip(spritesheet);
    //Animation(spriteSheet, frameWidth, frameHeight, sheetWidth, frameDuration, frames, loop, scale)
    // this.animation = new Animation(spritesheet, 64, 50, 8, 0.15, 8, true, 0.5);
    this.animation = new Animation(this.leftsprite, 64, 133, 8, 0.05, 8, true, 0.8, 1, false);
    // this.speed = 200;
    this.ctx = game.ctx;
    this.cooldown = 0;
    this.jumpCooldown = 0;
    this.currentBombOnField = 0;
    this.bombLvl = 10;
    this.flameLvl = 10;
    this.speedLvl = 4;
    this.debuffTimer = 0;
    this.isConfused = 1;
    this.canKick = true;
    this.isJump = false;
    this.name = "Bot";
    this.passTop = false;
    this.passRight = false;
    this.passBottom = false;
    this.passLeft = false;
    this.x = x;
    this.y = y;
    this.cx = this.x + 7;
    this.cxx = 34;
    this.cy = this.y + 64;
    this.cyy = 34;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.radius = 17;
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    this.insideBomb = null;
    //                     Left,   Right,   Bot,    Top
    this.fourDirection = [[-1, 0], [1, 0], [0, 1], [0, -1]];
    // store the target cells's game coordinate (left top coordinate){x,y}
    this.movingTarget = null;
    // store the target cells's CENTER, canvas pixel
    this.movingTargetX = null;
    this.movingTargetY = null;
    // store the moving x direction
    this.directionX = 0;
    // store the moving y direction
    this.directionY = 0;
    this.stopAnime = false;
    this.elapsedTime = 0;
    this.jumpBeginY = null;
    this.fireJump = false;
    this.dangerousCount = 0;
    Entity.call(this, game, x, y);
}

Bot.prototype = new Entity();
Bot.prototype.constructor = Bot;

Bot.prototype.selectAction = function () {
    var action = {direction: null, putBomb: false, target: null};
    action.putBomb = (this.nearBox() || this.nearPlayer());
    action.direction = this.getDirection();
    this.stopAnime = (this.directionX === 0 && this.directionY === 0);
    return action;
}

// this method is checked, return true if nest to destroyable box, false otherwise.
Bot.prototype.nearBox = function () {
    for (var i = 0; i < 4; i++) {
        var x = this.position.x + this.fourDirection[i][0];
        var y = this.position.y + this.fourDirection[i][1];
        for (var j = 0; j < this.game.destroyable.length; j++) {
            var entD = this.game.destroyable[j];
            if (entD.position.x === x && entD.position.y === y) {
                return true;
            }
        }
    }
    return false;
}
Bot.prototype.nearPlayer = function () {
    for (var i = 0; i < 4; i++) {
        var x = this.position.x + this.fourDirection[i][0];
        var y = this.position.y + this.fourDirection[i][1];
        for (var j = 0; j < this.game.players_bots.length; j++) {
            var entP = this.game.players_bots[j];
            if (entP.position.x === x && entP.position.y === y
                && (entP.name === "Bomberman" || entP.name === "Ugly" || entP.name === "Bot")) {
                return true;
            }
        }
    }
    return false;
}

Bot.prototype.getDirection = function () {
    var changeDirection = true;
    var possibles = this.findPossibleDirection(this.position.x, this.position.y);
    if (this.movingTarget !== null) {
        for (var i = 0; i < possibles.length; i++) {
            var pos = possibles[i];
            if (pos.x === this.movingTarget.x && pos.y === this.movingTarget.y) {
                changeDirection = false;
                break;
            }
        }
    }
    if (changeDirection) {
        var safePositions = [];
        for (var i = 0; i < possibles.length; i++) {
            var pos = possibles[i];
            if (this.isSafe(pos)) {
                safePositions.push(pos);
            }
        }
        if (safePositions.length === 0 && possibles.length > 1) {
            for (var j = 0; j < possibles.length; j++) {
                // console.log("How about this one!!!!!!!!!!!!");
                var pos2 = possibles[j];
                var nextPossibles = this.findPossibleDirection(pos2.x, pos2.y);
                if (nextPossibles.length === 1) {
                    possibles.splice(j, 1);
                    j--;
                }
            }
        }

        var resultDirections = null;
        if (safePositions.length > 0) {
            this.dangerousCount = 0;
            resultDirections = safePositions;
        } else if ((possibles.length > 1|| this.dangerousCount>9) && !this.isJump) {
            if (this.dangerousCount>9) {
                this.fireJump = true;
            } else {
                this.dangerousCount++;
                resultDirections = possibles;
            }
        } else if ((possibles.length < 2 || this.dangerousCount>9) && !this.isJump){
            this.fireJump = true;
        }

        // random pick a cell
        if ((!this.fireJump/*||!this.isJump*/) && (resultDirections !== null && resultDirections.length !== 0)) {
            this.movingTarget = resultDirections[Math.floor(Math.random() * resultDirections.length)];
        } else {
            this.movingTarget = null;
        }
    }
    // set the direction X and Y
    if (this.movingTarget !== null) {
        this.movingTargetX = this.movingTarget.x * 50 + 25;
        this.movingTargetY = this.movingTarget.y * 50 + 25;
    }
    if (this.movingTargetX > this.center.x && (this.movingTargetX - this.center.x >= this.speedLvl)) {
        this.directionX = 1 * this.isConfused; // moving right
    } else if (this.movingTargetX < this.center.x && (this.center.x - this.movingTargetX >= this.speedLvl)) {
        this.directionX = -1 * this.isConfused; // moving left
    } else {
        this.directionX = 0; // stop or moving vertical
    }
    if (this.movingTargetY > this.center.y && ((this.movingTargetY - this.center.y) >= this.speedLvl)) {
        this.directionY = 1 * this.isConfused; // moving bottom
    } else if (this.movingTargetY < this.center.y && ((this.center.y - this.movingTargetY) >= this.speedLvl)) {
        this.directionY = -1 * this.isConfused; // moving top
    } else {
        this.directionY = 0; // stop or moving horizontal
    }
    return this.movingTarget;
}

// this method is CHECKED. it will return safe cells game's coordinate,
// if no safe direction, return possibles game's coordinate.
Bot.prototype.findPossibleDirection = function (theX, theY) {
    var result = [];
    result.push({x: theX, y: theY});
    for (var i = 0; i < this.fourDirection.length; i++) {
        var x = theX + this.fourDirection[i][0];
        var y = theY + this.fourDirection[i][1];
        var go = true;
        // check bombs position, if found, break immediately.
        for (var j = 0; j < this.game.bombs.length; j++) {
            var bomb = this.game.bombs[j];
            if ((bomb.x / 50) === x && (bomb.y / 50) === y) {
                go = false;
                break;
            }
        }
        // check flames position, if found, break immediately.
        if (go) {
            for (var k = 0; k < this.game.flames.length; k++) {
                var flame = this.game.flames[k];
                if ((flame.x / 50) === x && (flame.y / 50) === y) {
                    go = false;
                    break;
                }
            }
        }
        // check walls position, if found, break immediately.
        if (go) {
            for (var k = 0; k < this.game.walls.length; k++) {
                var wall = this.game.walls[k];
                if (wall.position.x === x && wall.position.y === y) {
                    go = false;
                    break;
                }
            }
        }
        if (go) {
            // check destroyable boxes position, if found, break immediately.
            for (var l = 0; l < this.game.destroyable.length; l++) {
                var box = this.game.destroyable[l];
                if (box.position.x === x && box.position.y === y) {
                    go = false;
                    break;
                }
            }
        }
        if (go) {
            result.push({x: x, y: y});
        }
    }
    return result;
    // }
}

// this method is checked, return true if position is safe, otherwise false.
// @param position is the game coordination.
Bot.prototype.isSafe = function (position) {
    for (var k = 0; k < this.game.flames.length; k++) {
        var flame = this.game.flames[k];
        if ((flame.x / 50) === position.x && (flame.y / 50) === position.y) {
            return false;
        }
    }
    for (var i = 0; i < this.game.bombs.length; i++) {
        var bomb = this.game.bombs[i];
        var flamePositions = bomb.printFlameHelper();
        for (var j = 0; j < flamePositions.length; j++) {
            var flame = flamePositions[j];
            if (flame.x === position.x && flame.y === position.y) {
                return false;
            }
        }
    }
    return true;
}

// Bot.prototype.putBomb = function() {
//
// }
Bot.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

Bot.prototype.collideLeft = function (other) {
    var temp = (this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx)
        && (((this.cy + this.cyy >= other.cy) && (this.cy <= other.cy))
        || ((this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy))
        || ((this.cy >= other.cy) && (this.cy + this.cyy <= other.cy + other.cyy)));
    if (temp) {
        this.x += (this.speedLvl+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    }
    return temp;
};

Bot.prototype.collideRight = function (other) {
    var temp = (this.cx + this.cxx >= other.cx) && (this.cx <= other.cx)
        // &&
        && (((this.cy + this.cyy >= other.cy) && (this.cy <= other.cy))
        || ((this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy))
        || ((this.cy >= other.cy) && (this.cy + this.cyy <= other.cy + other.cyy)));
    if (temp) {
        this.x -= (this.speedLvl+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    }
    return temp;
};

Bot.prototype.collideTop = function (other) {
    var temp = (this.cy <= other.cy + other.cyy) && (this.cy + this.cyy >= other.cy + other.cyy)
        && (((this.cx + this.cxx >= other.cx) && (this.cx <= other.cx))
        || ((this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx))
        || ((this.cx >= other.cx) && (this.cx + this.cxx <= other.cx + other.cxx)));
    if (temp) {
        this.y += (this.speedLvl+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    }
    return temp;
};

Bot.prototype.collideBottom = function (other) {
    var temp = (this.cy + this.cyy >= other.cy) && (this.cy <= other.cy)
        && (((this.cx + this.cxx >= other.cx) && (this.cx <= other.cx))
        || ((this.cx <= other.cx + other.cxx) && (this.cx + this.cxx >= other.cx + other.cxx))
        || ((this.cx >= other.cx) && (this.cx + this.cxx <= other.cx + other.cxx)));
    if (temp) {
        this.y -= (this.speedLvl+1) * EACH_LEVEL_SPEED * this.game.clockTick;
    }
    return temp;
};

Bot.prototype.update = function () {
    Entity.prototype.update.call(this);
    if (this.cooldown > 0) this.cooldown -= this.game.clockTick;
    if (this.cooldown < 0) this.cooldown = 0;
    if (this.jumpCooldown > 0) this.jumpCooldown -= this.game.clockTick;
    if (this.jumpCooldown < 0) this.jumpCooldown = 0;
    if (this.debuffTimer > 0) this.debuffTimer -= this.game.clockTick;
    if (this.debuffTimer < 0) this.debuffTimer = 0;
    this.cx = this.x + 7;
    this.cy = this.y + 64;
    this.center = {x: (this.cx + (this.cxx / 2)), y: (this.cy + (this.cyy / 2))};
    this.position = {x: (Math.floor(this.center.x / 50)), y: (Math.floor(this.center.y / 50))};
    if (this.isConfused === -1 && this.debuffTimer === 0) {
        this.isConfused = 1;
    }
    this.action = this.selectAction();
    // console.log("my direction: {" + this.action.direction.x+", "+this.action.direction.y+"}");
    // console.log("my direction: {" + this.action.direction+"}");
    // console.log("my action putBomb:"+this.action.putBomb);
    if (/*(this.game.chars['Space'])||*/(!this.isJump && this.cooldown === 0 && this.directionX === 0 && this.directionY === 0
    && this.action.putBomb && this.currentBombOnField < this.bombLvl)) { //create new bomb
        this.cooldown = 0;
        this.currentBombOnField++;
        var bomb = new Bomb(this.game, AM.getAsset("./img/Bomb.png"), this);
        //var bomb = new Bomb(this.game, AM.getAsset("./img/Bomb.png"), this.flameLvl);
        // bomb.x = this.x;
        // bomb.y = this.y;
        this.game.addEntity(bomb);
        var x = this.position.x * 50;
        var y = this.position.y * 50;
        bomb.center.x = x + 25;
        bomb.center.y = y + 25;
        for (var i = 0; i < this.game.players_bots.length; i++) {
            var character = this.game.players_bots[i];
            if (bomb.collide(character)) {
                character.insideBomb = bomb;
            }
        }
        Entity.call(bomb, this.game, x, y);
    }
    if (this.insideBomb != null) {
        if (!this.collide(this.insideBomb) || this.insideBomb.removeFromWorld) {
            this.insideBomb = null;
        }
    }
    if (!this.isJump) {
        for (var i = 0; i < this.game.entities.length; i++) {
            var ent = this.game.entities[i];
            if (ent !== this && ent.name !== "Ugly" && ent.name !== "Bot" && ent.name !== "Bomberman"
                && ent.name !== "Background" && ent.name !== "BackgroundStar" && !ent.removeFromWorld) {
                //     console.log("ent name: "+ent.name);
                if (ent.name !== "Bomb" /*|| this.insideBomb == null*/) {
                    this.passTop = this.collideTop(ent);
                    this.passBottom = this.collideBottom(ent);
                    this.passRight = this.collideRight(ent);
                    this.passLeft = this.collideLeft(ent);
                } else if (this.insideBomb == null || (ent.x != this.insideBomb.x || ent.y != this.insideBomb.y)) {
                    this.passTop = this.collideTop(ent);
                    this.passBottom = this.collideBottom(ent);
                    this.passRight = this.collideRight(ent);
                    this.passLeft = this.collideLeft(ent);
                    if (this.canKick && ent.name === "Bomb"
                        && this.passTop && this.directionY === -1) {
                        ent.moveTop = true;
                        ent.isMoving = true;
                    }
                    else if (this.canKick && ent.name === "Bomb"
                        && this.passBottom && this.directionY === 1) {
                        ent.moveBot = true;
                        ent.isMoving = true;
                    }
                    else if (this.canKick && ent.name === "Bomb"
                        && this.passRight && this.directionX === 1) {
                        ent.moveRight = true;
                        ent.isMoving = true;
                    }
                    else if (this.canKick && ent.name === "Bomb"
                        && this.passLeft && this.directionX === -1) {
                        ent.moveLeft = true;
                        ent.isMoving = true;
                    }
                }
            }
        }
        // console.log(this.directionX+", "+ this.directionY);
        if (this.directionY === -1) {
            if (!this.passTop) {
                this.animation.spriteSheet = this.sprite;
                this.animation.startrow = 2;
                this.y -= (this.speedLvl + 1) * EACH_LEVEL_SPEED * this.game.clockTick * this.isConfused;
            }
        }
        if (this.directionY === 1) {
            if (!this.passBottom) {
                this.animation.spriteSheet = this.sprite;
                this.animation.startrow = 1;
                this.y += (this.speedLvl + 1) * EACH_LEVEL_SPEED * this.game.clockTick * this.isConfused;
            }
        }
        if (this.directionX === 1) {
            if (!this.passRight) {
                this.animation.spriteSheet = this.sprite;
                this.animation.startrow = 0;
                this.x += (this.speedLvl + 1) * EACH_LEVEL_SPEED * this.game.clockTick * this.isConfused;
            }
        }

        if (this.directionX === -1) {
            if (!this.passLeft) {
                this.animation.spriteSheet = this.leftsprite;
                this.animation.startrow = 0;
                this.animation.reverse = true;
                this.x -= (this.speedLvl + 1) * EACH_LEVEL_SPEED * this.game.clockTick * this.isConfused;
            }
        }
        //This was used for bomb lvl up
        // if (this.game.chars['KeyC']) {
        //     if (this.bombLvl < 10) {
        //         this.bombLvl++;
        //     }
        //
        // }
        if (this.directionX === 0 && this.directionY === 0) {
            this.movingTarget = null;
        }
        if (this.jumpCooldown === 0 && this.fireJump) {
            this.dangerousCount = 0;
            this.jumpCooldown = 5;
            this.jumpBeginY = this.y;
            this.isJump = true;
            this.fireJump = false;
        }
    }

    if (this.isJump) {
        this.elapsedTime += this.game.clockTick;
        var jumpDistance = this.elapsedTime / 4;
        var totalHeight = 100;
        {
            if (jumpDistance > 0.5) {
                jumpDistance = 1 - jumpDistance;
            }
        }
        // var height = jumpDistance * 2 * totalHeight;
        var height = totalHeight * (-4 * (jumpDistance * jumpDistance - jumpDistance));

        this.y = this.jumpBeginY - height;
        if (this.elapsedTime > 4) {
            this.isJump = false;
            this.jumpBeginY = null;
            this.elapsedTime = 0;
        }
    }
}

Bot.prototype.draw = function () {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y);
    // if (this.game.chars['ArrowUp'] || this.game.chars['ArrowRight'] ||
    //     this.game.chars['ArrowDown'] || this.game.chars['ArrowLeft']) {
    // this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    // } else {
    //     this.animation.drawFrame(0, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    // }
    if (this.stopAnime) {
        this.animation.drawFrame(0, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    } else {
        this.animation.drawFrame(this.game.clockTick, this.ctx, this.x, this.y, this.cx, this.cy, this.cxx, this.cyy);
    }
    Entity.prototype.draw.call(this);
}

AM.queueDownload("./img/MainMenu.png");
AM.queueDownload("./sound/MenuBackgroundSound.mp3");
AM.queueDownload("./img/farback.gif");
AM.queueDownload("./img/starfield.png");
AM.queueDownload("./img/bomberman.png");
AM.queueDownload("./img/bomberman_blue.png");
AM.queueDownload("./img/bomberman_cyan.png");
AM.queueDownload("./img/bomberman_green.png");
AM.queueDownload("./img/bomberman_red.png");
AM.queueDownload("./img/bomberman_violet.png");
AM.queueDownload("./img/ugly.png");
AM.queueDownload("./img/Bomb.png");
AM.queueDownload("./img/Flame.png");
AM.queueDownload("./img/DestoryableBox.png");
AM.queueDownload("./img/SolidBlock.png");
AM.queueDownload("./img/BombPowerup.png");
AM.queueDownload("./img/FlamePowerup.png");
AM.queueDownload("./img/SpeedPowerup.png");
AM.queueDownload("./img/SpeedPowerdown.png");
AM.queueDownload("./img/KickPowerup.png");
AM.queueDownload("./img/ConfusionPowerdown.png");
AM.queueDownload("./img/Dead.png");

var friction = 1;
//This method call starts the game, using the function as a callback function for when all the resources are finished.
AM.downloadAll(function () {

    var canvas = document.getElementById("gameWorld");
    canvas.style.cursor = "point";
    var ctx = canvas.getContext("2d");
    gameEngine.init(ctx);
    gameEngine.start();

    //gameEngine.addEntity(new Background(gameEngine, AM.getAsset("./img/MainMenu.png")));
    startSinglePlayerGame();
    // console.log("WHAT IS THIS AM??? "+ AM.cache);
});

// Function for building the map, boxes and items of the game.
function buildMap() {
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


    // var block = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), 100, 50);
    // gameEngine.addEntity(block);
    // var block2 = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), 200, 50);
    // gameEngine.addEntity(block2);
    // var block3 = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), 250, 100);
    // gameEngine.addEntity(block3);
    // var block4 = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), 300, 150);
    // gameEngine.addEntity(block4);
    // var block5 = new Destroyable(gameEngine, AM.getAsset("./img/DestoryableBox.png"), 250, 200);
    // gameEngine.addEntity(block5);
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
}
function startSinglePlayerGame() {
    buildMap();
    gameEngine.typeOfGame = 1;
    initiateGUI();
    // gameEngine.addEntity(new Bomberman(gameEngine, AM.getAsset("./img/bomberman.png"), 50, 0));
    // gameEngine.addEntity(new Ugly(gameEngine, AM.getAsset("./img/ugly.png"),945, 540));
    gameEngine.addEntity(new Bot(gameEngine, AM.getAsset("./img/bomberman_red.png"), 50, 0, "red"));
    gameEngine.addEntity(new Bot(gameEngine, AM.getAsset("./img/bomberman_blue.png"), 50, 500, "blue"));
    gameEngine.addEntity(new Bot(gameEngine, AM.getAsset("./img/bomberman_green.png"), 950, 500, "green"));
    gameEngine.addEntity(new Bot(gameEngine, AM.getAsset("./img/bomberman_violet.png"), 950, 0, "violet"));
    // gameEngine.typeOfGame = 1;
    // initiateGUI();

}

function initiateGUI () {
    var p1BombLvl = document.getElementById("p1_bombUp");
    var p1SpeedLvl = document.getElementById("p1_speedUp");
    var p1FlameLvl = document.getElementById("p1_flameUp");
    gameEngine.p1BombLvl = p1BombLvl;
    gameEngine.p1FlameLvl = p1FlameLvl;
    gameEngine.p1SpeedLvl = p1SpeedLvl;
    if (gameEngine.typeOfGame === 2) {
        var p2BombLvl = document.getElementById("p2_bombUp");
        var p2SpeedLvl = document.getElementById("p2_speedUp");
        var p2FlameLvl = document.getElementById("p2_flameUp");
        gameEngine.p2BombLvl = p2BombLvl;
        gameEngine.p2FlameLvl = p2FlameLvl;
        gameEngine.p2SpeedLvl = p2SpeedLvl;
    }
}



