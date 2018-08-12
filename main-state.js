/* globals Phaser game _ Grid Blocks */
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

      game.load.spritesheet('blocks', 'assets/blocks.png', 8, 8);
      game.load.spritesheet('palette', 'assets/palette.png', 14, 14);
    },

    create: function () {
      this.state = 'start';
      this.shape;
      this.skill;
      Grid.initialize(12, 8);

      Dog.initialize();

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

      this.dogUpdateTime = 1000;
      this.dogUpdateCheck = null;

      this.inputTime = 200;
      this.inputCheck = null;

      // Grid
      this.renderBlock = this.renderBlock.bind(this);
      var gridX = 80;
      var gridY = 160;
      this.grid = [];
      Grid.evaluate((function (cell, i, j) {
        this.grid[i] = this.grid[i] || [];
        this.grid[i][j] = game.add.sprite(
          gridX + (j * 9),
          gridY - (i * 9),
          'blocks',
          0,
        );
        this.renderBlock(cell, i, j);
      }).bind(this));

      // Health
      this.healthBar = game.add.tileSprite(game.width / 4, 8, game.width / 2, 3, 'palette', 28);
      this.healthBarAmt = new Phaser.Sprite(game, 1, 1, 'palette', 27);
      this.healthBar.addChild(this.healthBarAmt);
      this.healthBarAmt.height = 1;
      this.healthBar.fixedToCamera = true;
    },

    update: function () {
      var now = Date.now();

      this.checkInput(now);
      this.updateGrid(now);
      this.updateDog(now);

      this.renderGrid(now);
      this.renderHealth(now);

      this.startShape(now);

      Grid.print();
    },

    startShape(now) {
      if (Grid.ready()) {
        this.shape = Blocks.generateShape();
        this.skill = Dog.generateSkill();
        Grid.start(Blocks.get(this.shape), this.skill);
      }
    },

    checkInput(now) {
      this.inputCheck = this.inputCheck || now;
      if (this.inputCheck + this.inputTime > now) return;
      if (this.cursor.down.isDown) {
        Grid.update();
        Grid.tryLand();
        this.inputCheck = now;
      } else if (this.cursor.left.isDown) {
        Grid.move(-1);
        this.inputCheck = now;
      } else if (this.cursor.right.isDown) {
        Grid.move(1);
        this.inputCheck = now;
      } else if (this.cursor.rotateCW.isDown) {
        Blocks.rotateCW(Blocks.get(this.shape), Grid.check);
        this.inputCheck = now;
      } else if (this.cursor.rotateCCW.isDown) {
        Blocks.rotateCCW(Blocks.get(this.shape), Grid.check);
        this.inputCheck = now;
      }
    },

    updateGrid(now) {
      // always detect for collision
      Grid.detect();

      this.gridUpdateCheck = this.gridUpdateCheck || now;
      if (this.gridUpdateCheck + this.gridUpdateTime > now) return;

      Grid.update();

      this.gridUpdateCheck = now;
    },

    updateDog(now) {
      this.dogUpdateCheck = this.dogUpdateCheck || now;
      if (this.dogUpdateCheck + this.dogUpdateTime > now) return;

      Dog.update();
      Dog.clearSkills();
      Grid.evaluate(this.updateSkill);

      this.dogUpdateCheck = now;
    },

    updateSkill(idx) {
      if (idx == null) return;
      Dog.skills[Dog.getSkill(idx)] += 1;
    },

    renderGrid(now) {
      Grid.evaluate(this.renderBlock);
      Grid.evaluateShape(this.renderBlock);
    },

    renderBlock(cell, i, j) {
      this.grid[i][j].frame = cell != null ? cell : Dog.skillList.length + (i >= Grid.size[1]);
    },

    renderHealth(now) {
      this.healthBarAmt.width = (this.healthBar.width - 1) * Math.max(Dog.life / Dog.maxLife, 0);
    },
  };

  window.mainState = mainState;
})();
