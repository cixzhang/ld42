(function() {
  const rewards = {
    scienceFairRibbon: 0,
    bestInClassRibbon: 0,
    dogTreat: 0,
    beaker: 0,
    pencil: 0,
    fidgetSpinner: 0,
    textbook: 0,
    hat: 0,
    labCoat: 0,
    safetyGoggles: 0,
    coffee: 0,
    hoop: 0,
  };

  function clearRewards() {
    _.each(rewards, (val, key) => {
      rewards[key] = 0;
    });
  }

  const names = [
    'Learnsalot VII',
    'Mathenson',
    'Bot',
    'Butts',
    'Winkybottom',
  ];

  const startEvents = [
    {
      text: '"Hello dearie! Before you go off to dog college, let me teach you the most important life skills." Mom',
    },
    {
      skill: Dog.skillIndices.breathing,
      shape: 1,
      text: '"First, you\'ll want to learn how to breathe." Mom',
    },
    {
      skill: Dog.skillIndices.eating,
      shape: 2,
      text: '"Eat your dinner." Mom',
    },
    {
      skill: Dog.skillIndices.pooping,
      shape: 3,
      text: '"Finally, don\'t forget to poop once in a while." Mom',
    },
    {
      test: {
        [Dog.skillIndices.breathing]: 1,
        [Dog.skillIndices.eating]: 1,
        [Dog.skillIndices.pooping]: 1,
      },
      success: '"I believe in you sweetie! I\'ll call you once in a while to remind you." Mom',
      fail: '"What, you\'ve already forgotten what I just told you? You never listen, just like your father!" Mom',
      reward: () => {
        rewards.dogTreat = 1;
      },
      unreward: () => {},
    }
  ];

  const events = [
    {
      skill: Dog.skillIndices.breathing,
      shape: 1,
      text: '"Hey sweetie, just reminding you to use your diaphragm." Mom',
    },
    {
      skill: Dog.skillIndices.eating,
      shape: 2,
      text: '"Did you get enough to eat today? I don\'t mean junk food!" Mom',
    },
    {
      skill: Dog.skillIndices.pooping,
      shape: 1,
      text: '"Have you taken a dump yet? You gotta stay regular!" Mom',
    },
    {
      skill: Dog.skillIndices.breathing,
      shape: 8,
      text: 'Popped into the advanced meditation class. Ohmm...',
    },
    {
      skill: Dog.skillIndices.mathscience,
      shape: 1,
      text: 'You count the lines in your Linear Algebra textbook.',
    },
    {
      skill: Dog.skillIndices.dog,
      shape: 3,
      text: 'Someone threw frisbee in the park. Gotta go catch it!',
    },
    {
      skill: Dog.skillIndices.dog,
      shape: 7,
      text: 'Squirrel!',
    },
    {
      skill: Dog.skillIndices.dog,
      shape: 0,
      text: 'Someone says to "sit".',
    },
    {
      skill: Dog.skillIndices.social,
      shape: 0,
      text: `"Hey there dog! Let me give you a pat on the head."`,
    },
    {
      skill: Dog.skillIndices.social,
      shape: 1,
      text: `You meet your substitute professor, Dr. ${_.sample(names)}, today.`,
    },
    {
      skill: Dog.skillIndices.social,
      shape: 7,
      text: `You participate in an argument about whether shadows are real.`,
    },
    {
      test: {
        [Dog.skillIndices.social]: 1,
      },
      success: 'You were able to answer the first question in the exam: "Name"',
      fail: 'You think really hard but couldn\'t answer the first question in the pop-quiz: "Name"',
      reward: () => {
        rewards.pencil += 1;
      },
      unreward: () => {},
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

        if (passed) {
          event.reward();
          return event.success;
        } else {
          event.unreward();
          return event.fail;
        }
      }

      return event.text;
    },
  };
})();
