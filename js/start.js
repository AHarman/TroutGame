"use strict";

var StartState = {
    init: function() {
        if (!fullSize) {
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        } else {
            game.scale.scaleMode = Phaser.ScaleManager.NO_SCALE;
        }
        game.renderer.renderSession.roundPixels = true;
    },

    preload: function() {
        game.load.image("splashScreen", "assets/images/Title-screen.jpg");
    },

    create: function() {
        var bg = game.add.image(0,0, "splashScreen");
        var button = game.add.button(167, 493, null, this.buttonPressed);
        button.width = 443;
        button.height = 117;
        button.alpha = 0;
        button.input.useHandCursor = true;
    },

    buttonPressed: function(pointer) {
        game.state.start("play");
    }
}

