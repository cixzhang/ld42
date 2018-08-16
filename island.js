(function() {
  var id = 0;

  function makeChain(child, isGround) {
    return { id: id++, children: [child], ground: { value: isGround } };
  }

  function joinChains(chainA, chainB) {
    // Merge children
    var union = _.union(chainA.children, chainB.children);
    chainA.children.splice(0, chainA.children.length);
    chainA.children.push.apply(chainA.children, union);
    chainB.children = chainA.children;

    // Pick truthy ground
    var ground = chainB.ground.value ? chainB.ground : chainA.ground;
    chainB.ground = ground;
    chainA.ground = ground;

    // Merge into A
    chainB.id = chainA.id;
    return chainA;
  }

  function setGround(chain, isGround) {
    chain.ground.value = chain.ground.value || isGround;
  }

  function detect(map, checkLand, checkGround) {
    const chainMap = [];
    map.forEach((row, i) => {
      chainMap[i] = chainMap[i] || [];
      row.forEach((cell, j) => {
        if (checkLand(cell,i, j)) {
          let isGround = checkGround(cell, i, j);
          let chain = makeChain([i, j], isGround);
          if (i > 0 && chainMap[i-1][j]) {
            chain = joinChains(chainMap[i - 1][j], chain);
          }
          if (j > 0 && chainMap[i][j-1]) {
            chain = joinChains(chainMap[i][j - 1], chain);
          }
          setGround(chain, isGround);
          chainMap[i][j] = chain;
        }
      });
    });

    var uniqueChains = {};
    _.flatten(chainMap).forEach(chain => {
      if (!chain || chain.id in uniqueChains) return;
      uniqueChains[chain.id] = chain;
    });

    return Object.values(uniqueChains);
  };

  window.Islands = {
    detect,
  };
})();
