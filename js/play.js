"use strict";

var PlayState = {

    // Increment this for every open menu
    inMenu: 0,

    init: function() {
    },

    preload: function() {
        game.load.image("river",          "assets/images/River-Improvements.jpg");
        game.load.image("weir-1",         "assets/images/weir-1.jpg");
        game.load.image("weir-2",         "assets/images/weir-2.jpg");
        game.load.image("mud-1",          "assets/images/mud-1.jpg");
        game.load.image("mud-2",          "assets/images/mud-2.jpg");
        game.load.image("net-1",          "assets/images/net-1.png");
        game.load.image("net-2",          "assets/images/net-2.png");
        game.load.image("net-3",          "assets/images/net-3.png");
        game.load.image("pollution-1",    "assets/images/pollution-1.png")
        game.load.image("pollution-2",    "assets/images/pollution-2.png")
        game.load.image("pollution-3",    "assets/images/pollution-3.png")
        game.load.image("pipe",           "assets/images/pipe.jpg");
        game.load.image("ui-intro-1",     "assets/images/ui/UI-Intro-1.png");
        game.load.image("ui-intro-2",     "assets/images/ui/UI-Intro-2.png");
        game.load.image("healthFrame",    "assets/images/ui/UI-Health-Bar.png");
        game.load.image("healthBar",      "assets/images/ui/Health.png");
        game.load.image("ui-weir-1",      "assets/images/ui/UI-Weir-1.png");
        game.load.image("ui-weir-2",      "assets/images/ui/UI-Weir-2.png");
        game.load.image("ui-erosion-1",   "assets/images/ui/UI-Erosion-1.png");
        game.load.image("ui-erosion-2",   "assets/images/ui/UI-Erosion-2.png");
        game.load.image("ui-nets-1",      "assets/images/ui/UI-Nets-1.png");
        game.load.image("ui-nets-2",      "assets/images/ui/UI-Nets-2.png");
        game.load.image("ui-pollution-1", "assets/images/ui/UI-Pollution-1.png");
        game.load.image("ui-pollution-2", "assets/images/ui/UI-Pollution-2.png");
        game.load.image("ui-win",         "assets/images/ui/UI-Win.png");
        game.load.image("ui-score",       "assets/images/ui/UI-Score.png");
        game.load.spritesheet("tilly",    "assets/images/Tilly-Spritesheet.png", 600, 229, 10);
        game.load.physics("physics-data", "assets/physics.json");
    ;},

    create: function() {
        game.world.setBounds(0, 0, 24588, 720);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.setPostBroadphaseCallback(this.overlapInterrupt, this);

        this.bankCollisionGroup = game.physics.p2.createCollisionGroup();
        this.rockCollisionGroup = game.physics.p2.createCollisionGroup();
        this.fishCollisionGroup = game.physics.p2.createCollisionGroup();
        this.overlapObstaclesCollisionGroup = game.physics.p2.createCollisionGroup();
        this.blockObstaclesCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();

        this.background = new PlayState.Background(this.bankCollisionGroup, this.rockCollisionGroup);
        this.weir1 = new PlayState.Weir( 5000, 0, this.blockObstaclesCollisionGroup,   1);
        this.weir2 = new PlayState.Weir( 7300, 0, this.blockObstaclesCollisionGroup,   2);
        this.mud1  = new PlayState.Mud(  8940, 0, this.overlapObstaclesCollisionGroup, 1);
        this.mud2  = new PlayState.Mud( 10820, 0, this.overlapObstaclesCollisionGroup, 2);
        this.pipe  = new PlayState.Pipe(18775, 0);
        this.pollution = this.placePollution(this.overlapObstaclesCollisionGroup);
        this.player = new PlayState.Player(200, game.world.height - 150, this.fishCollisionGroup);
        this.nets = this.placeNets(this.overlapObstaclesCollisionGroup);

        this.player.sprite.body.collides([this.bankCollisionGroup, this.rockCollisionGroup], this.player.collideBG, this.player);
        this.player.sprite.body.collides(this.blockObstaclesCollisionGroup, this.player.collideObs, this.player);
        this.background.bankSprite.body.collides(this.fishCollisionGroup);
        this.background.rockSprite.body.collides(this.fishCollisionGroup);
        this.weir1.sprite.body.collides(this.fishCollisionGroup);
        this.weir2.sprite.body.collides(this.fishCollisionGroup);

        var healthFrame = game.add.image(10, 10, "healthFrame");
        healthFrame.fixedToCamera = true;
        this.healthBar = game.add.image(5, 5, "healthBar");
        healthFrame.addChild(this.healthBar);

        this.createUI("ui-intro-1", this.createUI, ["ui-intro-2"]);

        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player.sprite);
        game.camera.deadzone = new Phaser.Rectangle(100, 0, 200, 720);
    },

    update: function() {
        if (this.inMenu == 0) {
            this.player.move();
        }
        this.postWarning();
        this.checkWin();
    },

    postWarning: function() {
        if (this.player.sprite.body.x > 4500 && !this.player.seenWeir) {
            this.player.seenWeir = true;
            this.createUI("ui-weir-1", this.createUI, ["ui-weir-2"]);
        } else if (this.player.sprite.body.x > 8100 && !this.player.seenMud) {
            this.player.seenMud = true;
            this.createUI("ui-erosion-1", this.createUI, ["ui-erosion-2"]);
        } else if (this.player.sprite.body.x > 1100 && !this.player.seenNet) {
            this.player.seenNet = true;
            this.createUI("ui-nets-1", this.createUI, ["ui-nets-2"]);
        } else if (this.player.sprite.body.x > 12100 && !this.player.seenPoll) {
            this.player.seenPoll = true;
            this.createUI("ui-pollution-1", this.createUI, ["ui-pollution-2"]);
        }
    },

    checkWin: function() {
        if (this.player.sprite.body.x > 24150 && !this.player.won) {
            this.player.won = true;
            this.createUI("ui-win", this.displayScore, []);
        }
    },

    displayScore: function() {
        this.player.pause();

        var score = Math.round(PlayState.healthBar.width) * 100;
        var uiImage = game.add.image(0, 0, "ui-score");
        
        uiImage.position.x = game.camera.x + (uiImage.width / 2);
        uiImage.position.y = (game.height - uiImage.height) / 2;

        var button = game.add.button(507, 458, null, function(){game.state.start("credits")});
        button.width = 165;
        button.height = 62;
        button.input.useHandCursor = true;

        uiImage.addChild(button);

        game.add.text(game.camera.x + game.width / 2, game.height / 2, score.toString(), { font: "65px Arial", "fontStyle":  "bold", align: "center" });
    },

    overlapInterrupt: function(body1, body2) {
        if ((body1.sprite.name === "fish" && body2.sprite.name == "mud" ) ||
            (body1.sprite.name === "mud"  && body2.sprite.name == "fish")) {
            this.player.collideMud();
            return false;
        } else if ( (body1.sprite.name === "fish" && body2.sprite.name == "net" ) ||
                    (body1.sprite.name === "net"  && body2.sprite.name == "fish")) {
            this.player.collideNet();
            return false;
        } else if ( (body1.sprite.name === "fish" && body2.sprite.name == "pollution" ) ||
                    (body1.sprite.name === "pollution"  && body2.sprite.name == "fish")) {
            this.player.collidePollution();
            return false;
        }
        return true;
    },

    placeNets: function(collisionGroup) {
        var netsDefs = [{x:  1607, y: 259, num: 2},
                        {x:  2377, y: 368, num: 1},
                        {x:  3111, y: 419, num: 3},
                        {x:  3673, y: 144, num: 1},
                        {x:  4399, y: 374, num: 2},
                        {x:  5879, y: 385, num: 2},
                        {x:  6653, y: 232, num: 3},
                        {x:  8065, y: 208, num: 3},
                        {x:  8650, y: 355, num: 1},
                        {x: 16612, y: 213, num: 1}];
        var nets = [];

        for (var i = 0; i < netsDefs.length; i++) {
            var net = new PlayState.Net(netsDefs[i].x, netsDefs[i].y, collisionGroup, netsDefs[i].num);
            nets.push(net);
        }
        return nets;
    },

    placePollution: function(collisionGroup) {
        var pollDefs = [{x: 12419, y: 256, num: 2, small: false},
                        {x: 12873, y: 432, num: 1, small: false},
                        {x: 13392, y: 253, num: 2, small: false},
                        {x: 14425, y: 272, num: 3, small: false},
                        {x: 14880, y: 309, num: 2, small: false},
                        {x: 15698, y: 283, num: 1, small: false},
                        {x: 18361, y: 216, num: 2, small: false},
                        {x: 18658, y: 388, num: 3, small: false},
                        {x: 18617, y: 418, num: 1, small: false},
                        {x: 19197, y: 539, num: 2, small:  true},
                        {x: 19844, y: 493, num: 3, small:  true},
                        {x: 20767, y: 133, num: 1, small:  true},];
        var polls = [];

        this.resizePolygons("physics-data", "Pollution-1-small", 0.5);
        this.resizePolygons("physics-data", "Pollution-2-small", 0.5);
        this.resizePolygons("physics-data", "Pollution-3-small", 0.5);

        for (var i = 0; i < pollDefs.length; i++) {
            var poll = new PlayState.Pollution(pollDefs[i].x, pollDefs[i].y, collisionGroup, pollDefs[i].num, pollDefs.small);
            polls.push(poll);
        }
        return polls;
    },

    createUI: function(key, callback, args) {
        this.player.pause();
        var uiImage = game.add.image(0, 0, key);
        
        uiImage.position.x = game.camera.x + (uiImage.width / 2);
        uiImage.position.y = (game.height - uiImage.height) / 2;

        var closeUI = function() { 
                uiImage.destroy();
                button.destroy();
                this.inMenu--;
                if (this.inMenu == 0) {
                    this.player.unpause();
                }
                if (callback)
                    callback.apply(this, args);
            };

        var button = game.add.button(563, 457, null, closeUI.bind(this));
        button.width = 110;
        button.height = 62;
        button.input.useHandCursor = true;

        uiImage.addChild(button);
        this.inMenu++;
    },

    Weir: function(x, y, collisionGroup, number) {
        this.image = game.add.image(x, y, "weir-" + number);
        this.sprite = game.add.sprite(x, y);

        game.physics.p2.enable(this.sprite, debug);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physics-data", "Weir-" + number);
        this.sprite.body.static = true;
        this.sprite.body.setCollisionGroup(collisionGroup);
        //this.sprite.name = "weir";
    },

    Mud: function(x, y, collisionGroup, number) {
        this.image = game.add.image(x, y, "mud-" + number);
        this.sprite = game.add.sprite(x, y);

        game.physics.p2.enable(this.sprite, debug);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physics-data", "Mud-" + number);
        this.sprite.body.static = true;
        this.sprite.body.setCollisionGroup(collisionGroup);
        this.sprite.name = "mud";
    },

    Net: function(x, y, collisionGroup, number) {
        this.image = game.add.image(x, y, "net-" + number);
        this.sprite = game.add.sprite(x, y);

        game.physics.p2.enable(this.sprite, debug);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physics-data", "Night-Net-" + number);
        this.sprite.body.static = true;
        this.sprite.body.setCollisionGroup(collisionGroup);
        this.sprite.name = "net";
    },

    Pollution: function(x, y, collisionGroup, number, small) {
        this.image = game.add.image(x, y, "pollution-" + number);
        this.sprite = game.add.sprite(x, y);
        if (small) {
            this.sprite.scale.set(0.5);
        }

        game.physics.p2.enable(this.sprite, debug);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physics-data", "Pollution-" + number + (small ? "-small" : ""));
        this.sprite.body.static = true;
        this.sprite.body.setCollisionGroup(collisionGroup);
        this.sprite.name = "pollution";
    },

    Pipe: function(x, y) {
        this.image = game.add.image(x, y, "pipe")
    },

    Background: function(bankCollisionGroup, rockCollisionGroup) {
        this.image = game.add.image(0,0, "river");
        this.bankSprite = game.add.sprite(0, 0);
        this.rockSprite = game.add.sprite(0, 0);
        game.physics.p2.enable(this.bankSprite, debug);
        game.physics.p2.enable(this.rockSprite, debug);
        this.bankSprite.body.clearShapes();
        this.rockSprite.body.clearShapes();
        this.bankSprite.body.loadPolygon("physics-data", "River-Improvements");
        this.rockSprite.body.loadPolygon("physics-data", "River-Rocks");

        this.bankSprite.body.static = true;
        this.rockSprite.body.static = true;
        this.bankSprite.body.setCollisionGroup(bankCollisionGroup);
        this.rockSprite.body.setCollisionGroup(rockCollisionGroup);
    },

    Player: function(x, y, collisionGroup) {
        var tillyScale = 0.3;
        this.sprite = game.add.sprite(x, y, "tilly");
        this.sprite.scale.set(tillyScale);
        this.sprite.alpha = 0.8;

        game.physics.p2.enable(this.sprite, debug);
        PlayState.resizePolygons("physics-data", "Tilly-Sprite", tillyScale);
        this.sprite.body.clearShapes();
        this.sprite.body.loadPolygon("physics-data", "Tilly-Sprite");
        this.sprite.body.fixedRotation = true;
        this.sprite.body.setCollisionGroup(collisionGroup);

        var swim = this.sprite.animations.add("swim");
        this.sprite.animations.play("swim", 5, true);
        this.sprite.name = "fish";

        this.immune = false;
        this.jumping = false;
        this.paused = false;
        this.won = false;
        
        this.seenWeir = false;
        this.seenMud  = false;
        this.seenNet  = false;
        this.seenPoll = false;

        this.pause = function() {
            if (this.paused)
                return;

            this.oldVelX = this.sprite.body.velocity.x;
            this.oldVelY = this.sprite.body.velocity.y;
            this.sprite.body.velocity.x = 0;
            this.sprite.body.velocity.y = 0;
            this.sprite.animations.paused = true;
            this.paused = true;
        };

        this.unpause = function() {
            if (!this.paused)
                return;

            this.sprite.body.velocity.x = this.oldVelX;
            this.sprite.body.velocity.y = this.oldVelY;
            this.sprite.animations.paused = false;
            this.paused = false;
        };

        this.jump = function() {
            this.jumping = true;
            this.sprite.body.removeCollisionGroup([ PlayState.blockObstaclesCollisionGroup,
                                                    PlayState.overlapObstaclesCollisionGroup,
                                                    PlayState.rockCollisionGroup], true);
            var jumpUp   = game.add.tween(this.sprite.scale).to({x: 0.4, y: 0.4}, 500, "Linear");
            var fallDown = game.add.tween(this.sprite.scale).to({x: 0.3, y: 0.3}, 500, "Linear");
            fallDown.onComplete.add(this.onJumpEnd, this);
            jumpUp.chain(fallDown);
            jumpUp.start();
        };

        this.onJumpEnd = function() {
            this.jumping = false;
            this.sprite.body.collides(PlayState.blockObstaclesCollisionGroup, this.collideObs, this);
            this.sprite.body.collides(PlayState.rockCollisionGroup, this.collideBG, this);
        };

        this.move = function() {
            if (this.paused) {
                return
            } else if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.jumping) {
                this.jump();
            } else if (!this.jumping) {
                this.sprite.body.velocity.y = 0;

                if (this.sprite.body.velocity.x > 30)
                    this.sprite.body.velocity.x -= 4;
                else if (this.sprite.body.velocity.x < 0)
                    this.sprite.body.velocity.x += 4;
                else
                    this.sprite.body.velocity.x = 30;

                if (PlayState.cursors.right.isDown)
                    this.sprite.body.velocity.x = 500;
                else if (PlayState.cursors.left.isDown)
                    this.sprite.body.velocity.x = -200;
                else if (this.sprite.position.x - game.camera.x > 100)
                    game.camera.x += 1;

                if (PlayState.cursors.up.isDown)
                    this.sprite.body.velocity.y = -150;
                else if (PlayState.cursors.down.isDown)
                    this.sprite.body.velocity.y = 150;

                this.sprite.animations.currentAnim.speed = Math.max( 5,
                                                            Math.abs(this.sprite.body.velocity.x / 20),
                                                            Math.abs(this.sprite.body.velocity.y / 10));
            }
        };

        this.collideBG  = function(bodyA, bodyB, shapeA, shapeB, equation) {this.takeDamage( 5);};
        this.collideObs = function(bodyA, bodyB, shapeA, shapeB, equation) {this.takeDamage(20);};
        this.collideMud = function(body) {if(!this.jumping){this.takeDamage(10);}};
        this.collideNet = function(body) {if(!this.jumping){this.takeDamage(10);}};
        this.collidePollution = function(body) {if(!this.jumping){this.takeDamage(15);}};

        this.takeDamage = function(amount) {
            if (!this.immune)
            {
                var health = PlayState.healthBar.width - amount;
                if (health > 0) {
                    PlayState.healthBar.width = health;
                    this.tempImmune();
                } else {
                    game.state.start("gameOver");
                }
            }
        };
        
        this.tempImmune = function() {
            this.immune = true;
            this.sprite.alpha = 0;

            game.time.events.add(1000, function(){this.immune=false;}, this);

            // Flip between visibile and invisible
            game.time.events.repeat(250, 3, 
                function(){this.sprite.alpha = this.sprite.alpha == 0 ? 0.8 : 0;}, this);
        };
    },
    
    resizePolygons: function(key, object, scale) {
        var polygons = game.cache.getPhysicsData(key, object);
        for (var i = 0; i < polygons.length; i++) {
            for (var j = 0; j < polygons[i]["shape"].length; j++) {
                polygons[i].shape[j] *= scale;
            }
        }
    },
}

