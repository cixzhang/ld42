/* globals Phaser game */
var creditState = {
  preload: function() {
    // game scaling
    game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    game.scale.setUserScale(1, 1);

    game.renderer.renderSession.roundPixels = true;
    Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  },
  create: function() {
    game.stage.backgroundColor = '#000000';

    var gameOverText = 'Game Over';
    var forgotten = [];
    if (mainState.gameOverState.breathing === 0) {
      forgotten.push('breathe');
    }
    if (mainState.gameOverState.eating === 0) {
      forgotten.push('eat');
    }
    if (mainState.gameOverState.pooping === 0) {
      forgotten.push('poop');
    }
    var gameOverReason = 'You forgot how to ';
    forgotten.forEach((forgot, i) => {
      var join = '';
      if (i > 0) {
        join = ', ';
      }
      if (forgotten.length > 1 && i === forgotten.length - 1) {
        join = ' and ';
      }
      gameOverReason += join + forgot;
    });

    this.gameOver = TextRenderer.makeTextSprite(gameOverText, 100, 40, 0xFFFFFF);
    this.gameOverReason = TextRenderer.makeTextSprite(gameOverReason, 200, 80, 0xCCCCCC);

    game.world.addChild(this.gameOver);
    game.world.addChild(this.gameOverReason);

    this.gameOver.x = (800 - this.gameOver.width) / 2;
    this.gameOver.y = 240;

    this.gameOverReason.x = (800 - this.gameOverReason.width) / 2;
    this.gameOverReason.y = 300;

    this.startTime = null;
  },
  update: function() {
    var now = Date.now();

    this.startTime = this.startTime || now;

    if (now - this.startTime > 5000) {
      game.state.start('main');
    }
  }
};
