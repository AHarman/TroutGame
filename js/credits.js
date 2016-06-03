"use strict";

var CreditsState = {
    
    preload: function() {
        game.load.image("creditScreen", "assets/images/Credit-Screen.jpg");
    },

    create: function() {
        var bg = game.add.image(0,0, "creditScreen");
        this.spacebar = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    },

    update: function() {
        if (this.spacebar.isDown) {
            console.log("hello hello hello");
            game.state.start("play");
        }
    }
};
