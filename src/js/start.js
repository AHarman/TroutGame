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
        this.button = new Phaser.Rectangle(167, 493, 443, 117);
        game.input.onDown.add(this.handleClick.bind(startState));
    },

    render: function() {
        game.debug.geom(this.button,'#000000');
    },

    handleClick: function(pointer) {
        if (this.button.contains(pointer.x, pointer.y)) { 
            console.log('here'); 
        } 
    }

}
    
