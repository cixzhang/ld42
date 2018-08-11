/* globals Phaser _ Grid Blocks */
/* eslint no-console: 0 */

var DEBUG = true;
(function () {
  var mainState = {
    preload: function () {
      // game scaling
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(3, 3);

      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
    },

    create: function () {
      this.state = 'start';
      this.shape = 0;
      Grid.initialize(12, 8);
      Grid.start(Blocks.get(this.shape), 'x');

      this.cursor = game.input.keyboard.addKeys({
        'up': Phaser.KeyCode.W,
        'left': Phaser.KeyCode.A,
        'down': Phaser.KeyCode.S,
        'right': Phaser.KeyCode.D,
        'rotateCCW': Phaser.KeyCode.Q,
        'rotateCW': Phaser.KeyCode.E,
      });

      // Timers
      this.gridUpdateTime = 2000;
      this.gridUpdateCheck = null;

      this.inputTime = 200;
      this.inputCheck = null;
    },

    update: function () {
      var now = Date.now();

      this.checkInput(now);
      this.updateGrid(now);

      if (DEBUG) {
        Grid.print();
      }
    },

    checkInput(now) {
      this.inputCheck = this.inputCheck || now;
      if (this.inputCheck + this.inputTime > now) return;
      if (this.cursor.down.isDown) {
        Grid.update();
      } else if (this.cursor.left.isDown) {
        Grid.move(-1);
      } else if (this.cursor.right.isDown) {
        Grid.move(1);
      } else if (this.cursor.rotateCW.isDown) {
        Blocks.rotateCW(Blocks.get(this.shape));
      } else if (this.cursor.rotateCCW.isDown) {
        Blocks.rotateCCW(Blocks.get(this.shape));
      }

      this.inputCheck = now;
    },

    updateGrid(now) {
      // always detect for collision
      Grid.detect();

      this.gridUpdateCheck = this.gridUpdateCheck || now;
      if (this.gridUpdateCheck + this.gridUpdateTime > now) return;
      Grid.update();

      this.gridUpdateCheck = now;
    }
  };

  window.mainState = mainState;
})();
