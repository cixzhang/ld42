/* globals Phaser game */
(function () {

  function preload() {
    game.load.spritesheet('symbols', 'assets/symbols.png', 9, 12);
    game.load.spritesheet('clear', 'assets/clear.png', 1, 1);
  }

  function makeCharSprite(char) {
    let index = 0;
    const code = char.charCodeAt(0);
    if (char === ',') index = 62;
    else if (char === '.') index = 63;
    else if (char === '!') index = 64;
    else if (char === '?') index = 65;
    else if (char === ' ') index = 66;
    else if (code < 65) {
      // numerics
      index = code - 48;
    }
    else if (code < 97) {
      // capital letters
      index = code - 65 + 10;
    }
    else {
      // lowercase letters
      index = code - 97 + 10 + 26;
    }
    return new Phaser.Sprite(game, 0, 0, 'symbols', index);
  }

  function makeTextSprite(text, width, height, color) {
    const sizeX = 9;
    const sizeY = 12;

    const textSprite = new Phaser.TileSprite(game, 0, 0, width, height, 'clear', 0);
    let currentX = 0;
    let currentY = 0;
    let words = String(text).split(' ');

    words.forEach((word, i) => {
      var isNotLast = Number(i !== word.length - 1);
      var wordWidth = word.length + isNotLast + sizeX;

      if (currentX + wordWidth > width) {
        // return
        currentY += sizeY;
        currentX = 0;
      }

      word.split('').forEach((char) => {
        const charSprite = makeCharSprite(char);
        charSprite.tint = color;
        charSprite.x = currentX;
        charSprite.y = currentY;
        textSprite.addChild(charSprite);
        currentX += sizeX;
      });

      if (isNotLast) {
        const charSprite = makeCharSprite(' ');
        charSprite.x = currentX;
        charSprite.y = currentY;
        textSprite.addChild(charSprite);
        currentX += sizeX;
      }
    });
    return textSprite;
  }

  window.TextRenderer = {
    preload,
    makeTextSprite,
  };
})();
