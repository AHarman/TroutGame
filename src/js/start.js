"use strict";

var startState = {
    init: function() {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    },

    preload: function() {
        game.load.image("splashScreen", "assets/images/Title-screen.jpg");
    },

    create: function() {
        var bg = game.add.image(0,0, "splashScreen");
    }

};
