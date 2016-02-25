"use strict";

var debug = false;

var game = new Phaser.Game(1366, 720, Phaser.CANVAS, "gameContainer");

game.state.add('start', startState);
game.state.add('play', playState);
game.state.start('start');
