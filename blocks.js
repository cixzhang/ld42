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
      blocks: [[0,0][1,0]],
      botLeft: [0,0],
      topRight: [1,0],
    },
    { // 2
      blocks: [[0,0],[1,0],[2,0],[3,0]],
      botLeft: [0,0],
      topRight: [3,0],
    },
    { // 3
      blocks: [[0,0],[1,0],[1,1],[0,1]],
      botLeft: [0,0],
      topRight: [1,1],
    },
  ];

  var LIVING_TYPES = {0:1, 1:1, 2:1};
  var types = [
    'breathe',
    'eat',
    'poop',
    'mathphysics',
    'social',
    'dog',
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
    return _.random(0, shapes.length);
  }

  function generateType() {
    return _.random(0, types.length);
  }

  var Blocks = {
    LIVING_TYPES: LIVING_TYPES,
    shapes: shapes,
    types: types,
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
    generateType: generateType,
  };

  window.Blocks = Blocks;
})();
