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
        game.load.spritesheet("tilly",    "assets/images/Tilly-Spritesheet.png", 600, 229, 10);
        game.load.physics("physics-data", "assets/physics.json");
    ;},

    create: function() {
        game.world.setBounds(0, 0, 24588, 720);
        game.physics.startSystem(Phaser.Physics.P2JS);
        game.physics.p2.setImpactEvents(true);
        game.physics.p2.setPostBroadphaseCallback(this.overlapInterrupt, this);

        var bgCollisionGroup = game.physics.p2.createCollisionGroup();
        var fishCollisionGroup = game.physics.p2.createCollisionGroup();
        var overlapObstaclesCollisionGroup = game.physics.p2.createCollisionGroup();
        var blockObstaclesCollisionGroup = game.physics.p2.createCollisionGroup();
        game.physics.p2.updateBoundsCollisionGroup();


        this.bgObstacles = this.createBackground(bgCollisionGroup);
        //this.weir1 = new PlayState.Weir(5000, 0, blockObstaclesCollisionGroup, 1);
        //this.weir2 = new PlayState.Weir(7300, 0, blockObstaclesCollisionGroup, 2);
        this.mud1 = new PlayState.Mud( 8940, 0, overlapObstaclesCollisionGroup, 1);
        this.mud1 = new PlayState.Mud(10820, 0, overlapObstaclesCollisionGroup, 2);
        this.pipe = new PlayState.Pipe(18775, 0);
        this.player = this.createPlayer(fishCollisionGroup);

        this.player.body.collides(bgCollisionGroup, this.playerCollisionBG, this);
        this.player.body.collides(blockObstaclesCollisionGroup, this.playerCollisionObs, this);
        this.bgObstacles.body.collides(fishCollisionGroup);
        //this.weir1.sprite.body.collides(fishCollisionGroup);
        //this.weir2.sprite.body.collides(fishCollisionGroup);

        var healthFrame = game.add.image(10, 10, "healthFrame");
        healthFrame.fixedToCamera = true;
        this.healthBar = game.add.image(5, 5, "healthBar");
        healthFrame.addChild(this.healthBar);

        this.createUI("ui-intro-1", this.createUI, ["ui-intro-2"]);

        this.cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(this.player);
        game.camera.deadzone = new Phaser.Rectangle(100, 0, 200, 720);
    },

    update: function() {
        if (this.inMenu == 0) {
            this.movePlayer();
        }
    },

    overlapInterrupt: function(body1, body2) {
        if (body1.sprite.name === "fish") {
            if (body2.sprite.name == "mud") {
                this.playerOverlapMud();
            }
        } else if (body1.sprite.name == "mud") {
            if (body2.sprite.name == "fish") {
                this.playerOverlapMud();
            }
        }
        return true;
    },

    createUI: function(key, callback, args) {
        var uiImage = game.add.image(0, 0, key);
        uiImage.position.x = (game.width  - uiImage.width)  / 2;
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

    createBackground: function(collisionGroup) {
        var bg = game.add.image(0,0, "river");
        var bgObstacles = game.add.sprite(0, 0);
        game.physics.p2.enable(bgObstacles, debug);
        bgObstacles.body.clearShapes();
        bgObstacles.body.loadPolygon("physics-data", "River-Improvements");

        bgObstacles.body.static = true;
        bgObstacles.body.setCollisionGroup(collisionGroup);
        //bgObstacles.name = "bg";
        return bgObstacles;
    },

    resizePolygons: function(key, object, scale) {
        var polygons = game.cache.getPhysicsData(key, object);
        for (var i = 0; i < polygons.length; i++) {
            for (var j = 0; j < polygons[i]["shape"].length; j++) {
                polygons[i].shape[j] *= scale;
            }
        }
    },

    createPlayer: function(collisionGroup) {
        var tillyScale = 0.3;
        var player = game.add.sprite(200, game.world.height - 150, "tilly");
        player.scale.set(tillyScale);
        player.alpha = 0.8;

        game.physics.p2.enable(player, debug);
        this.resizePolygons("physics-data", "Tilly-Sprite", tillyScale);
        player.body.clearShapes();
        player.body.loadPolygon("physics-data", "Tilly-Sprite");
        player.body.fixedRotation = true;
        player.body.setCollisionGroup(collisionGroup);

        //player.body.onBeginContact.add(this.playerCollision.bind(this));

        var swim = player.animations.add("swim");
        player.animations.play("swim", 5, true);
        player.name = "fish";
        return player
    },

    playerCollisionBG: function(bodyA, bodyB, shapeA, shapeB, equation) {
        this.playerTakeDamage(5);
    },

    playerCollisionObs: function(bodyA, bodyB, shapeA, shapeB, equation) {
        this.playerTakeDamage(20);
    },

    playerOverlapMud: function(body) {
        this.playerTakeDamage(0.4);
    },

    playerTakeDamage: function(amount) {
        var health = this.healthBar.width - amount;
        if (health > 0) {
            this.healthBar.width = health;
        } else {
            game.state.start("gameOver");
        }
    },

    movePlayer: function() {
       this.player.body.velocity.y = 0;

       if (this.player.body.velocity.x > 30)
           this.player.body.velocity.x -= 4;
       else
           this.player.body.velocity.x = 30;

       if (this.cursors.right.isDown)
           this.player.body.velocity.x = 500;
       else if (this.player.position.x - game.camera.x > 100)
           game.camera.x += 1;

       if (this.cursors.up.isDown)
           this.player.body.velocity.y = -150;
       else if (this.cursors.down.isDown)
           this.player.body.velocity.y = 150;

       this.player.animations.currentAnim.speed = Math.max( 5,
                                                       Math.abs(this.player.body.velocity.x / 20),
                                                       Math.abs(this.player.body.velocity.y / 10));
   }
}

