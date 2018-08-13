// Playing grid
(function() {
  var size = [1, 1];
  var blocked = [];
  var cx;
  var cy;
  var cShape;
  var cData;
  var addHeight = 5;
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

    for (var i = 0; i < y + addHeight; i++) {
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
    cy = size[1] + 2;
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
    if (tryLand()) {
      return;
    }
    cy -= 1;
  }

  function detect() {
    if (!cShape) return;
    var left = false;
    var right = false;
    var bottom = false;
    cShape.blocks.forEach(function (block) {
      var x = block[0] + cx;
      var y = block[1] + cy;
      left = left || x === 0 || blocked[y][x - 1] != null;
      right = right || x === (size[0] - 1) || blocked[y][x + 1] != null;
      bottom = bottom || y === 0 || blocked[y - 1][x] != null;
    });
    touch.left = left;
    touch.right = right;
    touch.bottom = bottom;
  }

  function check(blocks) {
    var collision = false;
    blocks.forEach(function (block) {
      var x = block[0] + cx;
      var y = block[1] + cy;
      var outLeft = x < 0;
      var outRight = x > size[0] - 1;
      var outBottom = y < 0;
      collision = collision || blocked[y][x] != null ||
        outLeft || outRight || outBottom;
    });
    return collision;
  }

  function tryLand() {
    if (touch.bottom) {
      land();
      return true;
    }
    return false;
  }

  function land() {
    if (!cShape) return;
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

  function ready() {
    return !cShape;
  }

  function findFullRows() {
    var indices = [];
    blocked.forEach(function (row, i) {
      var isFull = row.every(function (cell) {
        return cell != null;
      });

      if (isFull) indices.push(i);
    });

    return indices;
  }

  function clearRow(index) {
    const row = blocked.splice(index, 1)[0];
    for (var i = 0; i < row.length; i++) {
      row[i] = null;
    }

    // add cleared row back to top
    blocked.push(row);
  }

  function findOverfilledColumns() {
    var indices = {};
    for (var i = 0; i < addHeight; i++) {
      var row = blocked[blocked.length - i - 1];
      row.forEach(function (cell, i) {
        if (cell != null) {
          indices[i] = true;
        }
      });
    }
    return Object.keys(indices).map(Number);
  }

  function clearColumn(index) {
    blocked.forEach(function (row) {
      row.forEach(function(cell, i) {
        if (i === index) {
          row[i] = null;
        }
      });
    });
  }

  window.Grid = {
    size: size,
    addHeight: addHeight,
    blocked: blocked,
    print: function () {
      console.log(cx, cy);
      console.log(JSON.stringify(touch));
    },
    initialize: initialize,
    start: start,
    move: move,
    update: update,
    tryLand: tryLand,
    detect: detect,
    check: check,
    evaluate: evaluate,
    evaluateShape: evaluateShape,
    ready: ready,
    findFullRows: findFullRows,
    clearRow: clearRow,
    findOverfilledColumns: findOverfilledColumns,
    clearColumn: clearColumn,
  };
})();