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

      game.load.spritesheet('dog', 'assets/dog.png', 64, 64);

      game.load.spritesheet('window', 'assets/window.png', 50, 50);
      game.load.image('desk', 'assets/desk.png');
      game.load.image('shelf', 'assets/shelf.png');
      game.load.image('skillboard', 'assets/skillboard.png');

      game.load.image('picture', 'assets/picture.png');
      game.load.image('textbook', 'assets/textbook.png');
      game.load.image('flask', 'assets/flask.png');
      game.load.image('pencil', 'assets/pencil.png');
      game.load.image('stick', 'assets/stick.png');
      game.load.image('phd', 'assets/phd.png');

      game.load.image('black', 'assets/black.png');

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
      this.gridUpdateTime = 1800;
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

      // Sprites
      this.window = game.add.sprite(230, 150, 'window', 0);
      this.window.scale.x = 3;
      this.window.scale.y = 3;
      this.window.animations.add('bg', [0, 1]);
      this.window.animations.play('bg', 1, true);

      this.skillboard = game.add.sprite(437, 255, 'skillboard');
      this.skillboard.scale.x = 3;
      this.skillboard.scale.y = 3;

      this.skillHeader = TextRenderer.makeTextSprite('Skill Board', 300, 50, 0x556270);
      this.skillHeader.x = 537;
      this.skillHeader.y = 525;
      game.world.addChild(this.skillHeader);

      // this.shelf = game.add.sprite(85, 273, 'shelf');
      // this.shelf.scale.x = 3;
      // this.shelf.scale.y = 3;

      this.phd = game.add.sprite(100, 200, 'phd');
      this.phd.scale.x = 3;
      this.phd.scale.y = 3;

      this.stick = game.add.sprite(310, 250, 'stick');
      this.stick.scale.x = 3;
      this.stick.scale.y = 3;

      this.childDog = game.add.sprite(125, 263, 'dog', 0);
      this.childDog.scale.x = 3;
      this.childDog.scale.y = 3;
      this.childDog.animations.add('sit', [0, 1, 2, 3, 4, 5, 6, 7, 8]);
      this.childDog.animations.add('goggles', [36, 37, 38, 39, 40, 41, 42, 43, 44]);
      this.childDog.animations.add('hat', [45, 46, 47, 48, 49, 50, 51, 52, 53]);
      this.childDog.animations.add('all', [54, 55, 56, 57, 58, 59, 60, 61, 62]);

      this.desk = game.add.sprite(72, 450, 'desk');
      this.desk.scale.x = 3;
      this.desk.scale.y = 3;

      this.picture = game.add.sprite(80, 354, 'picture');
      this.picture.scale.x = 3;
      this.picture.scale.y = 3;

      this.textbook = game.add.sprite(160, 402, 'textbook');
      this.textbook.scale.x = 3;
      this.textbook.scale.y = 3;

      this.flask = game.add.sprite(260, 354, 'flask');
      this.flask.scale.x = 3;
      this.flask.scale.y = 3;

      this.pencil = game.add.sprite(140, 442, 'pencil');
      this.pencil.scale.x = 3;
      this.pencil.scale.y = 3;

      this.adultDog = game.add.sprite(125, 300, 'dog', 0);
      this.adultDog.scale.x = 5;
      this.adultDog.scale.y = 5;
      this.adultDog.animations.add('stand', [27, 28, 29, 30, 31, 32, 33, 34, 35]);
      this.adultDog.animations.add('hat', [63, 64, 65, 66, 67, 68, 69, 70, 71]);
      this.adultDog.animations.add('transform', [
        9, 10, 11, 12, 13, 14, 15, 16, 17,
        18, 19, 20, 21, 23, 24, 25, 26
      ]);
      this.adultDog.alpha = 0;

      // Text
      this.dialogTimeout = null;
      this.clearText = this.clearText.bind(this);
      var dialogScale = 3;
      this.dialogPadding = 30;
      this.dialogBox = new Phaser.Group(game);
      this.dialogBoxBg = new Phaser.Sprite(game, 0, 0, 'dialogbox', 0);
      this.dialogBoxBg.scale.x = dialogScale;
      this.dialogBoxBg.scale.y = dialogScale;
      this.dialogBox.addChild(this.dialogBoxBg);
      this.dialogBox.x = (800 - this.dialogBox.width) / 2;
      this.dialogBox.y = 60;
      this.dialogBox.alpha = 0;

      // Grid
      this.renderBlock = this.renderBlock.bind(this);
      this.dropRow = this.dropRow.bind(this);
      this.dropColumn = this.dropColumn.bind(this);
      this.dropBlock = this.dropBlock.bind(this);
      var gridScale = 3;
      var gridX = 800 - (Grid.size[0] * gridScale * 8 + 120);
      var gridY = 480;
      this.grid = [];
      this.gridBG = [];
      this.animationGrid = [];
      Grid.evaluate((function (cell, i, j) {
        this.grid[i] = this.grid[i] || [];
        this.gridBG[i] = this.gridBG[i] || [];
        this.animationGrid[i] = this.animationGrid[i] || [];
        this.gridBG[i][j] = game.add.sprite(
          gridX + (j * (8 * gridScale + 1)),
          gridY - (i * (8 * gridScale + 1)),
          'blocks',
          i >= Grid.size[1] ? 8 : 6,
        );
        this.gridBG[i][j].width = 8 * gridScale;
        this.gridBG[i][j].height = 8 * gridScale;
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
      this.healthBar = game.add.tileSprite(game.width / 4, 20, game.width / 2, 3, 'palette', 28);
      this.healthBar.scale.y = 5;
      this.healthBarAmt = new Phaser.Sprite(game, 1, 1, 'palette', 27);
      this.healthBar.addChild(this.healthBarAmt);
      this.healthBarAmt.height = 1;
      this.healthBar.fixedToCamera = true;

      // Events
      this.tutorial = 0;
      this.eventReady = true;
      this.transformed = false;
      this.gameOverState = null;

      this.black = game.add.sprite(0, 0, 'black');
      this.black.width = 800;
      this.black.height = 600;
      this.black.alpha = 0;
    },

    update: function () {
      var now = Date.now();

      this.updateGrid(now);
      this.updateGridLand(now);
      this.updateDog(now);

      this.checkInput(now);
      this.checkEvent(now);

      this.renderDog(now);
      this.renderGrid(now);
      this.renderHealth(now);
      this.renderRewards(now);
    },

    checkInput(now) {
      this.inputCheck = this.inputCheck || now;
      if (this.inputCheck + this.inputTime > now) return;
      if (!this.shape) return;

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
        Grid.detect();
        this.inputCheck = now;
      } else if (this.cursor.rotateCCW.isDown) {
        Blocks.rotateCCW(Blocks.get(this.shape), Grid.check);
        Grid.detect();
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
      this.gridUpdateCheck = this.gridUpdateCheck || now;
      if (this.gridUpdateCheck + this.gridUpdateTime > now) return;

      Grid.update();

      this.gridUpdateCheck = now;
    },

    updateGridLand(now) {
      this.gridLandCheck = this.gridLandCheck || now;
      if (this.gridLandCheck + this.gridLandTime > now) return;

      Grid.updateIslands();
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

      if (this.tutorial >= GameEvents.startEvents.length) {
        Dog.update();
      }

      if (GameEvents.rewards.phd && this.childDog.alpha && !this.transformed) {
        this.childDog.alpha = 0;
        this.adultDog.alpha = 1;
        this.adultDog.animations.play('transform', 8, false)
        this.adultDog.animations.currentAnim.onComplete.addOnce(() => {
          this.transformed = true;
        });
      }


      if (Dog.life <= 0) {
        this.gameOver();
      }

      this.dogUpdateCheck = now;
    },

    updateSkill(idx) {
      if (idx == null) return;
      Dog.skills[Dog.getSkill(idx)] += 1;
    },

    renderDog(now) {
      if (!this.transformed) {
        var frame = 'sit';
        if (GameEvents.rewards.mayorHat) {
          frame = 'hat';
        }
        if (GameEvents.rewards.safetyGoggles) {
          frame = 'goggles';
        }
        if (GameEvents.rewards.mayorHat && GameEvents.rewards.safetyGoggles) {
          frame = 'all';
        }

        this.childDog.animations.play(frame, 8, true);
      } else {
        var frame = 'stand';
        if (GameEvents.rewards.mayorHat) {
          frame = 'hat';
        }
        this.adultDog.animations.play(frame, 8, true);
        this.adultDog.x = 125;
        this.adultDog.y = 285;
      }
    },

    renderGrid(now) {
      Grid.evaluate(this.renderBlock);
      Grid.evaluateShape(this.renderBlock);
    },

    renderBlock(cell, i, j) {
      this.grid[i][j].frame = cell != null ? cell : Dog.skillList.length + (2 * (i >= Grid.size[1]));
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
      this.healthBar.alpha = !(Dog.life === Dog.maxLife);
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

    renderRewards() {
      _.forEach(GameEvents.rewards, (val, key) => {
        if (this[key]) {
          this[key].alpha = Math.sign(val);
        }
      });
    },

    gameOver() {
      if (this.gameOverState) return;
      game.add.tween(this.black).to({ alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0)
        .onComplete.addOnce(() => { game.state.start('credit'); });
      // clone skills so we don't update during game over
      this.gameOverState = {...Dog.skills};
    }
  };

  window.mainState = mainState;
})();
