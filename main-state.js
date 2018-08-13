/* globals Phaser game _ Grid Blocks TextRenderer Dog GameEvents */
/* eslint no-console: 0 */

var DEBUG = true;
(function () {
  var mainState = {
    preload: function () {
      // game scaling
      game.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
      game.scale.setUserScale(1, 1);

      game.renderer.renderSession.roundPixels = true;
      Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);

      game.load.spritesheet('blocks', 'assets/blocks.png', 8, 8);
      game.load.spritesheet('palette', 'assets/palette.png', 14, 14);
      game.load.spritesheet('dialogbox', 'assets/dialogbox.png', 160, 40);

      game.load.spritesheet('window', 'assets/window.png', 50, 50);
      game.load.image('desk', 'assets/desk.png');

      TextRenderer.preload();
    },

    create: function () {
      game.stage.backgroundColor = '#53777a';

      this.state = 'start';
      this.shape;
      this.skill;
      Grid.initialize(8, 8);

      Dog.initialize();
      GameEvents.initialize();

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
      this.gridLandTime = 900;
      this.gridLandCheck = null;

      this.dogUpdateTime = 1000;
      this.dogUpdateCheck = null;

      this.inputTime = 200;
      this.inputCheck = null;

      this.eventReadyWillResetTime = 3500;
      this.eventReadyWillReset = null;

      this.clearDialogTime = 3000;

      this.bgUpdateTime = 800;
      this.bgUpdateCheck = null;

      // Text
      this.dialogTimeout = null;
      this.clearText = this.clearText.bind(this);
      var dialogScale = 2;
      this.dialogPadding = 8;
      this.dialogBox = new Phaser.Group(game);
      this.dialogBoxBg = new Phaser.Sprite(game, 0, 0, 'dialogbox', 0);
      this.dialogBoxBg.scale.x = dialogScale;
      this.dialogBoxBg.scale.y = dialogScale;
      this.dialogBox.addChild(this.dialogBoxBg);
      this.dialogBox.x = (800 - this.dialogBox.width) / 2;
      this.dialogBox.y = 60;
      this.dialogBox.alpha = 0;

      // Sprites
      this.window = game.add.sprite(230, 150, 'window', 0);
      this.window.scale.x = 3;
      this.window.scale.y = 3;
      this.window.animations.add('bg', [0, 1]);
      this.window.animations.play('bg', 1, true);

      this.desk = game.add.sprite(80, 450, 'desk');
      this.desk.scale.x = 3;
      this.desk.scale.y = 3;

      // Grid
      this.renderBlock = this.renderBlock.bind(this);
      this.dropRow = this.dropRow.bind(this);
      this.dropColumn = this.dropColumn.bind(this);
      this.dropBlock = this.dropBlock.bind(this);
      var gridScale = 3;
      var gridX = 800 - (Grid.size[0] * gridScale * 8 + 80);
      var gridY = 520;
      this.grid = [];
      this.animationGrid = [];
      Grid.evaluate((function (cell, i, j) {
        this.grid[i] = this.grid[i] || [];
        this.animationGrid[i] = this.animationGrid[i] || [];
        this.grid[i][j] = game.add.sprite(
          gridX + (j * (8 * gridScale + 1)),
          gridY - (i * (8 * gridScale + 1)),
          'blocks',
          0,
        );
        this.grid[i][j].width = 8 * gridScale;
        this.grid[i][j].height = 8 * gridScale;
        // keep the animation grid clear until we need to animate
        this.animationGrid[i][j] = game.add.sprite(
          gridX + (j * (8 * gridScale + 1)),
          gridY - (i * (8 * gridScale + 1)),
          'blocks',
          8,
        );
        this.animationGrid[i][j].width = 8 * gridScale;
        this.animationGrid[i][j].height = 8 * gridScale;
        this.renderBlock(cell, i, j);
      }).bind(this));

      // Health
      this.healthBar = game.add.tileSprite(game.width / 4, 8, game.width / 2, 3, 'palette', 28);
      this.healthBarAmt = new Phaser.Sprite(game, 1, 1, 'palette', 27);
      this.healthBar.addChild(this.healthBarAmt);
      this.healthBarAmt.height = 1;
      this.healthBar.fixedToCamera = true;

      // Events
      this.tutorial = 0;
      this.eventReady = true;
    },

    update: function () {
      var now = Date.now();

      this.updateGrid(now);
      this.updateGridLand(now);
      this.updateDog(now);

      this.checkInput(now);
      this.checkEvent(now);

      this.renderGrid(now);
      this.renderHealth(now);

      Grid.print();
    },

    checkInput(now) {
      this.inputCheck = this.inputCheck || now;
      if (this.inputCheck + this.inputTime > now) return;
      if (this.cursor.down.isDown) {
        Grid.update();
        Grid.tryLand();
        this.inputCheck = now;
      }

      if (this.cursor.left.isDown) {
        Grid.move(-1);
        this.inputCheck = now;
      } else if (this.cursor.right.isDown) {
        Grid.move(1);
        this.inputCheck = now;
      }

      if (this.cursor.rotateCW.isDown || this.cursor.up.isDown) {
        Blocks.rotateCW(Blocks.get(this.shape), Grid.check);
        this.inputCheck = now;
      } else if (this.cursor.rotateCCW.isDown) {
        Blocks.rotateCCW(Blocks.get(this.shape), Grid.check);
        this.inputCheck = now;
      }
    },

    checkEvent(now) {
      if (this.eventReady) {
        var event;
        if (this.tutorial < GameEvents.startEvents.length) {
          event = GameEvents.startEvents[this.tutorial];
          this.tutorial += 1;
        } else {
          event = GameEvents.generate();
        }

        if (event.shape != null) {
          this.shape = event.shape;
          this.skill = event.skill;
          Grid.start(Blocks.get(this.shape), this.skill);
        } else {
          this.eventReadyWillReset = now + this.eventReadyWillResetTime;
        }

        var text = GameEvents.resolve(event);
        this.renderText(text);
        this.eventReady = false;
      }

      if (
        this.eventReadyWillReset &&
        this.eventReadyWillReset <= now
      ) {
        this.eventReady = true;
        this.eventReadyWillReset = null;
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

    updateGridLand(now) {
      this.gridLandCheck = this.gridLandCheck || now;
      if (this.gridLandCheck + this.gridLandTime > now) return;

      Grid.tryLand();

      var fullRows = Grid.findFullRows();
      fullRows.forEach(this.dropRow);

      var fullColumns = Grid.findOverfilledColumns();
      fullColumns.forEach(this.dropColumn);

      Dog.clearSkills();
      Grid.evaluate(this.updateSkill);

      if (
        !this.eventReady &&
        !this.eventReadyWillReset &&
        Grid.ready() &&
        !fullRows.length
      ) {
        this.eventReadyWillReset = now + 100;
      }

      this.gridLandCheck = now;
    },

    updateDog(now) {
      this.dogUpdateCheck = this.dogUpdateCheck || now;
      if (this.dogUpdateCheck + this.dogUpdateTime > now) return;

      Dog.update();

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

    dropRow(i) {
      var dropBlock = this.dropBlock;
      this.animationGrid[i].forEach(function (block, j) {
        dropBlock(block, i, j);
      });
      Grid.clearRow(i);
    },

    dropColumn(j) {
      var dropBlock = this.dropBlock;
      this.animationGrid.forEach(function (row, i) {
        var block = row[j];
        dropBlock(block, i, j);
      });
      Grid.clearColumn(j);
    },

    dropBlock(block, i, j) {
      var gridFrame = this.grid[i][j].frame;
      if (gridFrame >= Dog.skillList.length) {
        gridFrame = 8;
      }
      block.frame = gridFrame;
      game.add.tween(block)
        .to(
          {
            y: block.y + 300,
            x: block.x + _.random(-10, 10),
            angle: _.random(-200, 200),
          },
          2000, Phaser.Easing.Linear.None, true, 0, 0)
        .onComplete.addOnce(() => {
          block.frame = 8;
          block.x = this.grid[i][j].x;
          block.y = this.grid[i][j].y;
        });
    },

    renderHealth(now) {
      this.healthBarAmt.width = (this.healthBar.width - 1) * Math.max(Dog.life / Dog.maxLife, 0);
    },

    renderText(text) {
      clearTimeout(this.dialogTimeout);
      this.dialogBox.removeChild(this.dialog);
      this.dialog = TextRenderer.makeTextSprite(
        text,
        this.dialogBox.width - 2 * this.dialogPadding,
        this.dialogBox.height - 2 * this.dialogPadding,
        0x000000
      );
      this.dialog.x = this.dialogPadding;
      this.dialog.y = this.dialogPadding;
      this.dialogBox.addChild(this.dialog);

      this.dialogBox.alpha = 1;

      this.dialogTimeout = setTimeout(this.clearText, this.clearDialogTime);
    },

    clearText() {
      this.dialogBox.alpha = 0;
      this.dialogBox.removeChild(this.dialog);
    },
  };

  window.mainState = mainState;
})();
