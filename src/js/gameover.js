"use strict";

var gameOverState = {
    preload: function() {
        game.load.image("gameOver", "assets/images/Game-over.png");
    },

    create: function() {
        var gameOverScreen = game.add.image(0,0, "gameOver");
        gameOverScreen.x = (game.width  - gameOverScreen.width)  / 2;
        gameOverScreen.y = (game.height - gameOverScreen.height) / 2;
        var button = game.add.button(435, 457, null, this.buttonPressed);
        button.width = 243;
        button.height = 68;
        gameOverScreen.addChild(button);

        button.input.useHandCursor = true;
    },

    buttonPressed: function(pointer) {
        game.state.start("play");
    }
};
