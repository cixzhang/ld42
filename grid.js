// Playing grid
(function() {
  var size = [1, 1];
  var blocked = [];
  var cx;
  var cy;
  var cShape;
  var cData;
  var touch = {
    left: false,
    right: false,
    bottom: false,
  };

  function initialize(x, y) {
    size[0] = x;
    size[1] = y;
    cx = 0;
    cy = 0;
    cShape = null;

    for (var i = 0; i < y + 5; i++) {
      blocked[i] = [];
      for (var j = 0; j < x; j++) {
        blocked[i][j] = null;
      }
    }
  }

  function start(shape, data) {
    cShape = shape;
    cData = data;
    cx = Math.floor(size[0] / 2);
    cy = size[1] + 1;
    touch.left = false;
    touch.right = false;
    touch.bottom = false;
  }

  function move(dx) {
    if (dx > 0 && !touch.right) {
      cx += 1;
    }
    if (dx < 0 && !touch.left) {
      cx -= 1;
    }
  }

  function update() {
    if (!cShape) return;
    if (touch.bottom) {
      land();
    }
    cy -= 1;
  }

  function detect() {
    if (!cShape) return;
    cShape.blocks.forEach(function (block) {
      var x = block[0] + cx;
      var y = block[1] + cy;
      touch.left = touch.left || x === 0 || blocked[y][x - 1];
      touch.right = touch.right || x === (size[1] - 1) || blocked[y][x + 1];
      touch.bottom = touch.bottom || y === 0 || blocked[y - 1][x];
    });
  }

  function land() {
    cShape.blocks.forEach(function (block) {
      blocked[block[1] + cy][block[0] + cx] = cData;
    });
    cShape = null;
    cData = null;
  }

  function evaluate(record) {
    blocked.forEach(function (row, i) {
      row.forEach(function (cell, j) {
        record(cell, i, j);
      });
    });
  }

  function evaluateShape(record) {
    if (!cShape) return;
    cShape.blocks.forEach(function (block) {
      var x = block[0] + cx;
      var y = block[1] + cy;
      record(cData, y, x);
    });
  }

  window.Grid = {
    size: size,
    blocked: blocked,
    print: function () {
      console.log(cx, cy);
      console.log(JSON.stringify(blocked));
    },
    initialize: initialize,
    start: start,
    move: move,
    update: update,
    detect: detect,
    evaluate: evaluate,
    evaluateShape: evaluateShape,
  };
})();