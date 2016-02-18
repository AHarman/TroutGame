"use strict";

var debug = false;

var game = new Phaser.Game(1300, 720, Phaser.CANVAS, "gameContainer", { init: init, preload: preload, create: create, update: update });

var player;
var cursors;

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

    createBackground();
    createPlayer();

    cursors = game.input.keyboard.createCursorKeys();

    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(100, 0, 200, 720);
}

function resizePolygons(key, object, scale) {
    var polygons = game.cache.getPhysicsData(key, object);
    for (var i = 0; i < polygons.length; i++) {
        for (var j = 0; j < polygons[i]["shape"].length; j++) {
            polygons[i].shape[j] *= scale;
        }
    }
}

function update() {
    movePlayer();
}

function createBackground() {
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
}

function createPlayer() {
    var tillyScale = 0.3;
    player = game.add.sprite(200, game.world.height - 150, "tilly");
    player.scale.set(tillyScale);
    player.alpha = 0.9;
    
    game.physics.p2.enable(player, debug);
    resizePolygons("physics-data", "Tilly-Sprite", tillyScale);
    player.body.clearShapes();
    player.body.loadPolygon("physics-data", "Tilly-Sprite");
    player.body.fixedRotation = true;

    var swim = player.animations.add("swim");
    player.animations.play("swim", 5, true);
}

function movePlayer() {
    player.body.velocity.y = 0;

    if (player.body.velocity.x > 30)
        player.body.velocity.x -= 4;
    else
        player.body.velocity.x = 30;

    if (cursors.right.isDown)
        player.body.velocity.x = 150;
    else if (player.position.x - game.camera.x > 100)
        game.camera.x += 1;

    if (cursors.up.isDown)
        player.body.velocity.y = -150;
    else if (cursors.down.isDown)
        player.body.velocity.y = 150;

    player.animations.currentAnim.speed = Math.max( 5,
                                                    Math.abs(player.body.velocity.x / 10),
                                                    Math.abs(player.body.velocity.y / 10));
}
