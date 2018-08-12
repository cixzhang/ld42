(function() {
  const rewards = {
    scienceFairRibbon: 0,
    dogTreat: 0,
    beaker: 0,
    pencil: 0,
    fidgetSpinner: 0,
    textbook: 0,
    hat: 0,
  };

  function clearRewards() {
    _.each(rewards, (val, key) => {
      rewards[key] = 0;
    });
  }

  const startEvents = [
    {
      text: 'Hello dearie! Before you go off to dog college, let me teach you the most important life skills.',
    },
    {
      skill: Dog.skillIndices.breathing,
      shape: 1,
      text: 'First, you\'ll want to learn how to breathe.',
    },
    {
      skill: Dog.skillIndices.eating,
      shape: 2,
      text: 'Eat your dinner.',
    },
    {
      skill: Dog.skillIndices.pooping,
      shape: 3,
      text: 'Finally, don\'t forget to poop.',
    },
    {
      test: {
        [Dog.skillIndices.breathing]: 1,
        [Dog.skillIndices.eating]: 1,
        [Dog.skillIndices.pooping]: 1,
      },
      success: 'I believe in you sweetie! I\'ll call you once in a while to remind you.',
      fail: 'What, you\'ve already forgotten what I just told you? You never listen, just like your father!',
      reward: () => {
        rewards.dogTreat += 1;
      },
      unreward: () => {
        clearRewards();
      },
    }
  ];

  const events = [
    {
      skill: Dog.skillIndices.breathing,
      shape: 2,
      text: 'Hey sweetie, just reminding you to use your diaphragm.',
    },
    {
      skill: Dog.skillIndices.breathing,
      shape: 4,
      text: 'Popped into the advanced meditation class. Ohmm...',
    },
  ];

  window.GameEvents = {
    rewards,
    startEvents,
    events,
    initialize: () => {
      clearRewards();
    },
    generate: () => {
      return _.sample(events);
    },
    resolve: (event) => {
      if (event.shape) return event.text;
      if (event.test) {
        var passed = _.every(event.test, (val, key) => {
          return Dog.skills[Dog.getSkill(key)] >= val;
        });

        if (passed) return event.success;
        else return event.fail;
      }

      return event.text;
    },
  };
})();
