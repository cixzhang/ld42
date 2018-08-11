/* globals Phaser game */
var creditState = {
  preload: function() {
    // game scaling
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(3, 3);

    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  },
  create: function() {
    // TODO
  },
  update: function() {
    var now = Date.now();

    this.startTime = this.startTime || now;

    if (now - this.startTime > 5000) {
      game.state.start('main');
    }
  }
};
