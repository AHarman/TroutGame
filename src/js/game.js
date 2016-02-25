"use strict";

// Used for development, set to false for actual use
var debug = false;
var fullSize = false;

var game = new Phaser.Game(1366, 720, Phaser.CANVAS, "gameContainer");

game.state.add('start', startState);
game.state.add('play', playState);
game.state.start('start');
