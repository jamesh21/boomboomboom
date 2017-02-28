window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (/* function */ callback, /* DOMElement */ element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function GameEngine() {
    this.entities = [];
    this.destroyable = [];
    this.walls = [];
    this.bombs = [];
    this.flames = [];
    this.players_bots = [];
    this.offLimitPlacement = [];
    this.randomItemPlacement =[];
    this.items = [];
    this.ctx = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.typeOfGame = 1;
    this.chars = ['ArrowUp','ArrowRight','ArrowDown','ArrowLeft',
        'KeyA', 'KeyW', 'KeyD', 'KeyS', 'Space', 'ControlLeft'];
}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.timer = new Timer();
    this.startInput();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.addOffLimitPlacement = function(x, y) {
    var offLimit = new Object();
    offLimit.x = x;
    offLimit.y = y;
    this.offLimitPlacement.push(offLimit);
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        if (x < 1024) {
            x = Math.floor(x / 32);
            y = Math.floor(y / 32);
        }

        return { x: x, y: y };
    }

    var that = this;

    // event listeners are added here

    // this.ctx.canvas.addEventListener("click", function (e) {
    //     that.click = getXandY(e);
    //     console.log(e);
    //     console.log("Left Click Event - X,Y " + e.clientX + ", " + e.clientY);
    // }, false);

    this.ctx.canvas.addEventListener("click", mouseClicked, false);

    this.ctx.canvas.addEventListener("contextmenu", function (e) {
        that.click = getXandY(e);
        //console.log(e);
       // console.log("Right Click Event - X,Y " + e.clientX + ", " + e.clientY);
        e.preventDefault();
    }, false);

    // this.ctx.canvas.addEventListener("mousemove", function (e) {
    //     //console.log(e);
    //     that.mouse = getXandY(e);
    // }, false);

    this.ctx.canvas.addEventListener("mousemove", mouseMoved, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        //console.log(e);
        that.wheel = e;
        //console.log("Click Event - X,Y " + e.clientX + ", " + e.clientY + " Delta " + e.deltaY);
    }, false);

    this.ctx.canvas.addEventListener("keydown", function (e) {
        that.chars[e.code] = true;
        e.preventDefault();
        //console.log(e);
        // console.log("Key Down Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keypress", function (e) {
        if (e.code === "KeyD") that.d = true;
        that.chars[e.code] = true;
        e.preventDefault();
        //console.log(e);
       // console.log("Key Pressed Event - Char " + e.charCode + " Code " + e.keyCode);
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        that.chars[e.code] = false;
        //console.log(e);
        //console.log("Key Up Event - Char " + e.code + " Code " + e.keyCode);
    }, false);

    //console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
    if (entity.name === "Wall") this.walls.push(entity);
    if (entity.name === "Bomb") this.bombs.push(entity);
    if (entity.name === "Flame") this.flames.push(entity);
    if (entity.name === "Bomberman"||entity.name ==="Ugly"||entity.name==="Bot") this.players_bots.push(entity);
    if (entity.name === "Destroyable") this.destroyable.push(entity);
    if (entity.name === "SpeedPowerup" || entity.name === "BombPowerup" || entity.name === "FlamePowerup") {
        this.items.push(entity);
    }
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.surfaceWidth, this.surfaceHeight);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        if ((this.entities[i].name == "Bomberman" ||
            this.entities[i].name == "Ugly" ||
            this.entities[i].name == "Bot")
            && (i < (this.entities.length -this.players_bots.length))) {
            var temp = this.entities[i];
            this.entities.splice(i, 1);
            this.entities.push(temp);
            i--;
        } else {
            this.entities[i].draw(this.ctx);
        }
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];
        if (!entity.removeFromWorld) {
            entity.update();
        }

    }
    // Loop through to remove entities that have been removed from the world
    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }
    // Loop  through the destroyable entities to remove from world
    for (var i = this.destroyable.length -1; i >= 0; i--) {
        if (this.destroyable[i].removeFromWorld) {
            this.destroyable.splice(i, 1);
        }
    }
    for (var i = this.bombs.length -1; i >= 0; i--) {
        if (this.bombs[i].removeFromWorld) {
            this.bombs.splice(i, 1);
        }
    }
    for (var i = this.flames.length -1; i >= 0; i--) {
        if (this.flames[i].removeFromWorld) {
            this.flames.splice(i, 1);
        }
    }
    for (var i = this.players_bots.length -1; i >= 0; i--) {
        if (this.players_bots[i].removeFromWorld) {
            if (this.typeOfGame === 1 && this.players_bots[i].name === "Bomberman") {
                document.getElementById('end-game').style.display = "flex";
                var gameoverMsg = document.getElementById('game-over');
                gameoverMsg.style.display = "block";
                gameoverMsg.innerHTML = "You Lose!!!!!";
                this.clockTick = 0;
                break;
            }
            this.players_bots.splice(i, 1);
            if (this.typeOfGame === 2 && (this.checkPlayers() ||
                    (this.players_bots.length === 1 && this.players_bots[0].name === "Bot"))) {
                document.getElementById('end-game').style.display = "flex";
                var gameoverMsg = document.getElementById('game-over');
                gameoverMsg.style.display = "block";
                gameoverMsg.innerHTML = "A.I. Wins!!!!!";
                this.clockTick = 0;
                break;
            }
        }
    }
    if (this.players_bots.length === 1) {
        document.getElementById('end-game').style.display = "flex";
        var gameoverMsg = document.getElementById('game-over');
        gameoverMsg.style.display = "block";
        // gameoverMsg.movingTargetX = this.ctx.x/2;
        // gameoverMsg.movingTargetY = this.ctx.y/2;
        if (this.players_bots[0].name === "Bomberman") {
            gameoverMsg.innerHTML = "You Win!!!!!";
        }
        //document.getElementById('game-over').style.display = "block";

        this.clockTick = 0;
    }
}

GameEngine.prototype.checkPlayers = function () {
    console.log("Im in here");
    if (this.players_bots.length === 2 && ((this.players_bots[0].name === "Bot" &&
                this.players_bots[1].name === "Bot") || this.players_bots[0].name === "Bot" &&
                    this.players_bots[1].name ==="Bot")) {
        return true;
    } else {
        return false;
    }

}
GameEngine.prototype.loop = function () {
    this.clockTick = this.timer.tick();
    this.update();
    this.draw();
}

function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {
}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}

// added this method for easy horizontal flip
Entity.prototype.flip = function (image) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.translate(size, 0);
    offscreenCtx.scale(-1, 1);
    offscreenCtx.drawImage(image, 0, 0);
    return offscreenCanvas;
}