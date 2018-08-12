var game = new Phaser.Game(800, 600, Phaser.AUTO, '', this, false, false);
game.state.add('main', mainState);
game.state.add('credit', creditState);
game.state.start('main');
