/* globals _ */
// Block shapes and physics
(function () {
  var shapes = [
    { // 0
      blocks: [[0,0]],
      botLeft: [0,0],
      topRight: [0,0],
    },
    { // 1
      blocks: [[0,0],[1,0]],
      botLeft: [0,0],
      topRight: [1,0],
    },
    { // 2
      blocks: [[-2,0],[-1,0],[0,0],[1,0]],
      botLeft: [-2,0],
      topRight: [1,0],
    },
    { // 3
      blocks: [[-1,0],[0,0],[0,1],[-1,1]],
      botLeft: [-1,0],
      topRight: [0,1],
    },
  ];

  function rotate(shape, dir) {
    var minX = 0; var maxX = 0;
    var minY = 0; var maxY = 0;
    shape.blocks.forEach(function (block) {
      var x = block[0];
      var y = block[1];

      block[0] = -dir * y;
      block[1] = dir * x;

      minX = Math.min(block[0], minX);
      minY = Math.min(block[1], minY);
      maxX = Math.max(block[0], maxX);
      maxY = Math.max(block[1], maxY);
    });
    shape.botLeft[0] = minX;
    shape.botLeft[1] = minY;
    shape.topRight[0] = maxX;
    shape.topRight[1] = maxY;
  }

  function generateShape() {
    return _.random(0, shapes.length - 1);
  }

  var Blocks = {
    shapes: shapes,
    get: function (idx) {
      return shapes[idx];
    },
    getType: function (idx) {
      return types[idx];
    },
    rotateCW: function rotateCW(shape) {
      rotate(shape, -1);
    },
    rotateCCW: function rotateCCW(shape) {
      rotate(shape, 1);
    },
    generateShape: generateShape,
  };

  window.Blocks = Blocks;
})();
