var game = new Phaser.Game(1300, 720, Phaser.CANVAS, 'gameContainer', { init: init, preload: preload, create: create, update: update });

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function init() {
    game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
}

function preload() {
    game.load.image('river', 'assets/images/River-Obstacles.jpg');
    game.load.image('tilly', 'assets/images/Tilly-Sprite.png');
}

function create() {
    var bg = game.add.sprite(0, 0, 'river');

    player = game.add.sprite(32, game.world.height - 150, 'tilly');
    player.scale.set(0.3);

    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    cursors = game.input.keyboard.createCursorKeys();

    game.world.setBounds(0, 0, 24588, 720);
    game.camera.follow(player);
    game.camera.deadzone = new Phaser.Rectangle(100, 0, 200, 720);
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
        player.animations.play('right');
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

