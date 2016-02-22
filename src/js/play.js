var playState = {

    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },

    preload: function() {
        game.load.image("river", "assets/images/River-Obstacles.jpg");
        game.load.spritesheet("tilly", "assets/images/Tilly-Spritesheet.png", 600, 229, 10);
        game.load.physics("physics-data", "assets/physics.json");
    },

    create: function() {
        game.world.setBounds(0, 0, 24588, 720);
        game.physics.startSystem(Phaser.Physics.P2JS);

        this.createBackground();
        this.player = this.createPlayer();

        this.cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(this.player);
        game.camera.deadzone = new Phaser.Rectangle(100, 0, 200, 720);
    },

    update: function() {
        this.movePlayer();
    },

    createBackground: function() {
        var bg = game.add.image(0,0, "river");
        var bgObstacles = game.add.sprite(12, 15);
        game.physics.p2.enable(bgObstacles, debug);
        bgObstacles.body.clearShapes();
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-1");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-2");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-3");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-4");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-5");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-6");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-7");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-8");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-9");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-10");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-11");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-rock-12");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-top");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-bot-1");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-bot-2");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-bot-3");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-bot-4");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-bot-5");
        bgObstacles.body.loadPolygon("physics-data", "river-collision-bot-6");
        bgObstacles.body.static = true;
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

    createPlayer: function() {
        var tillyScale = 0.3;
        var player = game.add.sprite(200, game.world.height - 150, "tilly");
        player.scale.set(tillyScale);
        player.alpha = 0.9;

        game.physics.p2.enable(player, debug);
        this.resizePolygons("physics-data", "Tilly-Sprite", tillyScale);
        player.body.clearShapes();
        player.body.loadPolygon("physics-data", "Tilly-Sprite");
        player.body.fixedRotation = true;

        var swim = player.animations.add("swim");
        player.animations.play("swim", 5, true);
        
        return player
    },

    movePlayer: function() {
       this.player.body.velocity.y = 0;

       if (this.player.body.velocity.x > 30)
           this.player.body.velocity.x -= 4;
       else
           this.player.body.velocity.x = 30;

       if (this.cursors.right.isDown)
           this.player.body.velocity.x = 150;
       else if (this.player.position.x - game.camera.x > 100)
           game.camera.x += 1;

       if (this.cursors.up.isDown)
           this.player.body.velocity.y = -150;
       else if (this.cursors.down.isDown)
           this.player.body.velocity.y = 150;

       this.player.animations.currentAnim.speed = Math.max( 5,
                                                       Math.abs(this.player.body.velocity.x / 10),
                                                       Math.abs(this.player.body.velocity.y / 10));
   }
}

