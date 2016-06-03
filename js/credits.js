"use strict";

var CreditsState = {
    
    preload: function() {
        game.load.image("creditScreen", "assets/images/Credit-Screen.jpg");
    },

    create: function() {
        var bg = game.add.image(0,0, "creditScreen");
        var button = game.add.button(614, 310, null, function(){game.state.start("play");});
        button.width = 139;
        button.height = 62;
        button.input.useHandCursor = true;
    },
};
