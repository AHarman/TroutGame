"use strict";

// Used for development, set to false for actual use
var debug = false;
var fullSize = true;

var game = new Phaser.Game(24588, 720, Phaser.CANVAS, "gameContainer");

game.state.add('start', StartState);
game.state.add('play', PlayState);
game.state.add('gameOver', GameOverState);
game.state.start('start');
