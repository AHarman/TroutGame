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
        this.mud2 = new PlayState.Mud(10820, 0, overlapObstaclesCollisionGroup, 2);
        this.pipe = new PlayState.Pipe(18775, 0);
        this.player = new PlayState.Player(200, game.world.height - 150, fishCollisionGroup);

        this.player.sprite.body.collides(bgCollisionGroup, this.playerCollisionBG, this);
        this.player.sprite.body.collides(blockObstaclesCollisionGroup, this.playerCollisionObs, this);
        this.bgObstacles.body.collides(fishCollisionGroup);
        //this.weir1.sprite.body.collides(fishCollisionGroup);
        //this.weir2.sprite.body.collides(fishCollisionGroup);

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
    },

    playerCollisionBG: function(bodyA, bodyB, shapeA, shapeB, equation) {
        this.playerTakeDamage(5);
    },

    playerCollisionObs: function(bodyA, bodyB, shapeA, shapeB, equation) {
        this.playerTakeDamage(20);
    },

    playerOverlapMud: function(body) {
        this.playerTakeDamage(10);
    },

    playerTakeDamage: function(amount) {
        if (!this.player.immune)
        {
            console.log("takedamage");
            var health = this.healthBar.width - amount;
            if (health > 0) {
                this.healthBar.width = health;
                this.playerTempImmune();
            } else {
                game.state.start("gameOver");
            }
        }
    },

    playerTempImmune: function() {
        this.player.immune = true;
        this.player.sprite.alpha = 0;

        game.time.events.add(1000, function(){this.player.immune=false;}, this);

        // Flip between visibile and invisible
        game.time.events.repeat(250, 3, 
            function(){this.player.sprite.alpha = this.player.sprite.alpha == 0 ? 0.8 : 0;}, this);
    },

    movePlayer: function() {
       this.player.sprite.body.velocity.y = 0;

       if (this.player.sprite.body.velocity.x > 30)
           this.player.sprite.body.velocity.x -= 4;
       else
           this.player.sprite.body.velocity.x = 30;

       if (this.cursors.right.isDown)
           this.player.sprite.body.velocity.x = 500;
       else if (this.player.sprite.position.x - game.camera.x > 100)
           game.camera.x += 1;

       if (this.cursors.up.isDown)
           this.player.sprite.body.velocity.y = -150;
       else if (this.cursors.down.isDown)
           this.player.sprite.body.velocity.y = 150;

       this.player.sprite.animations.currentAnim.speed = Math.max( 5,
                                                            Math.abs(this.player.sprite.body.velocity.x / 20),
                                                            Math.abs(this.player.sprite.body.velocity.y / 10));
   }
}

