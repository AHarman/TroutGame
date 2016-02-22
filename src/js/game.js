"use strict";

var debug = false;

var game = new Phaser.Game(1300, 720, Phaser.CANVAS, "gameContainer");
game.state.add('play', playState);
game.state.start('play');
