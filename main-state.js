/* globals Phaser _ */
/* eslint no-console: 0 */

var mainState = {
  preload: function() {
    // game scaling
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(3, 3);

    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  },

  create: function() {
    this.state = 'start';

    // Keep track of keys pressed
    this.keyCheck = {
      up: false,
      down: false,
      left: false,
      right: false,
      space: false // rotate
    };
  },

  update: function() {
    var now = Date.now();
  },
};
