"use strict";

var game = new Phaser.Game(1300, 720, Phaser.AUTO, "gameContainer", { init: init, preload: preload, create: create, update: update });

var player;
var platforms;
var cursors;
var bgObstacles

var tillyScale = 0.3;

function init() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

function preload() {
    game.load.image("river", "assets/images/River-Obstacles.jpg");
    game.load.spritesheet("tilly", "assets/images/Tilly-Spritesheet.png", 600, 229, 10);

    game.load.physics("physics-data", "assets/physics.json");
}

function create() {
    game.world.setBounds(0, 0, 24588, 720);
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.restitution = 0;

    var bg = game.add.image(0,0, "river");
    bgObstacles = game.add.sprite(12, 15);
    game.physics.p2.enable(bgObstacles, true);
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

    player = game.add.sprite(32, game.world.height - 150, "tilly");
    player.scale.set(tillyScale);

    resizePolygons("physics-data", "Tilly-Sprite", tillyScale);
    game.physics.p2.enable(player, true);
    player.body.clearShapes();
    player.body.loadPolygon("physics-data", "Tilly-Sprite");
    player.body.fixedRotation = true;

    var swim = player.animations.add("swim")
    player.animations.play("swim", 15, true);

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(100, 0, 200, 720);
}

function resizePolygons(key, object, scale) {
    var polygons = game.cache.getPhysicsData(key, object);
    for (var i = 0; i < polygons.length; i++) {
        console.log(polygons[i].shape);
        for (var j = 0; j < polygons[i]["shape"].length; j++) {
            polygons[i].shape[j] *= scale;
        }
        console.log(polygons[i].shape);
    }
    //game.cache.addPhysicsData(key + "-scaled", null, polygons)
}

function update() {
    player.body.velocity.y = 0;

    if (player.body.velocity.x > 30)
    {
        player.body.velocity.x -= 4;
    } else {
        player.body.velocity.x = 30;
    }

    if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;
        player.animations.play("right");
    }
    else if (player.position.x - game.camera.x > 100)
    {
        game.camera.x += 1;
    }

    if (cursors.up.isDown)
    {
        player.body.velocity.y = -150;
    } else if (cursors.down.isDown)
    {
        player.body.velocity.y = 150;
    }
}

