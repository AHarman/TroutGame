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
        this.player = new PlayState.Player(200, game.world.height - 150, this.fishCollisionGroup);

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
    },

    postWarning: function() {

        if (this.player.sprite.body.x > 4600 && !this.player.seenWeir) {
            this.player.seenWeir = true;
            this.createUI("ui-weir-1", this.createUI, ["ui-weir-2"]);

            console.log("Weir Warning!");
            console.log(this.inMenu);
        } else if (this.player.sprite.body.x > 8100 && !this.player.seenMud) {
            this.player.seenMud = true;
            this.createUI("ui-mud-1", this.createUI, ["ui-mud-2"]);
            console.log("Mud Warning!");
        }
        // Nets
        // Poll
    },

    overlapInterrupt: function(body1, body2) {
        if (body1.sprite.name === "fish" && !this.player.jumping) {
            if (body2.sprite.name == "mud") {
                this.player.collideMud();
                return false;
            }
        } else if (body1.sprite.name == "mud") {
            if (body2.sprite.name == "fish" && !this.player.jumping) {
                this.player.collideMud();
                return false;
            }
        }
        return true;
    },

    createUI: function(key, callback, args) {
        var uiImage = game.add.image(0, 0, key);
        
        uiImage.position.x = game.camera.x + (uiImage.width / 2);
        uiImage.position.y = (game.height - uiImage.height) / 2;

        var closeUI = function() { 
                uiImage.destroy();
                button.destroy();
                this.inMenu--;
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
        
        this.seenWeir = false;
        this.seenMud  = false;
        this.seenNet  = false;
        this.seenPoll = false;

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
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.jumping) {
                this.jump();
            } else if (!this.jumping) {
                this.sprite.body.velocity.y = 0;

                if (this.sprite.body.velocity.x > 30)
                    this.sprite.body.velocity.x -= 4;
                else
                    this.sprite.body.velocity.x = 30;

                if (PlayState.cursors.right.isDown)
                    this.sprite.body.velocity.x = 500;
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

        this.collideBG  = function(bodyA, bodyB, shapeA, shapeB, equation) {this.takeDamage( 5);console.log("bg");};
        this.collideObs = function(bodyA, bodyB, shapeA, shapeB, equation) {this.takeDamage(20);console.log("obs");};
        this.collideMud = function(body) {this.takeDamage(10);console.log("mud");};

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

