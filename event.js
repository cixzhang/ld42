(function() {
  const rewards = {
    picture: 0,
    flask: 0,
    pencil: 0,
    textbook: 0,
    stick: 0,
    phd: 0,
    mayorHat: 0,
    safetyGoggles: 0,
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
      text: '"Hello dear! Before you go off to dog college, let me teach you the most important life skills." Mom',
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
        rewards.picture = 1;
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
      skill: Dog.skillIndices.mathscience,
      shape: 7,
      text: 'The professor goes over Chewton\'s method.',
    },
    {
      skill: Dog.skillIndices.mathscience,
      shape: 8,
      text: 'The professor is explaining the laws of thermodognamics.',
    },
    {
      skill: Dog.skillIndices.dog,
      shape: 3,
      text: 'Someone threw frisbee in the park. Gotta go catch it!',
    },
    {
      skill: Dog.skillIndices.dog,
      shape: 7,
      text: 'There\'s a squirrel in the park! Chase after it!',
    },
    {
      skill: Dog.skillIndices.dog,
      shape: 0,
      text: 'Your classmate taught you to "sit". Maybe one day you\'ll also learn to stand',
    },
    {
      skill: Dog.skillIndices.social,
      shape: 0,
      text: `"Hey there dog! Let me give you a pat on the head."`,
    },
    {
      skill: Dog.skillIndices.social,
      shape: 1,
      text: `You meet your professor, Dr. ${_.sample(names)}, today.`,
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
      success: 'You were able to answer the first question in the exam "Name"',
      fail: 'You think really hard but couldn\'t answer the first question in the pop-quiz "Name"',
      reward: () => {
        rewards.pencil += 1;
      },
      unreward: () => {},
    },
    {
      test: {
        [Dog.skillIndices.social]: 4,
        [Dog.skillIndices.dog]: 4,
      },
      success: 'After getting to know all your classmates and demonstrating your dog prowess, you\'re voted to be the mascot of the Stick Thrower\'s Club.',
      fail: 'You watch longingly as your classmates throws sticks at each other.',
      reward: () => {
        rewards.stick += 1;
      },
      unreward: () => {
        rewards.stick = 0;
      },
    },
    {
      test: {
        [Dog.skillIndices.social]: 16,
      },
      success: 'You\'re voted to be the student body Mayor without even knowing about this position. Comes with a cool hat!',
      fail: 'What a nice sunny day. Your classmates are placing strips of paper in boxes, but you\'re not sure why.',
      reward: () => {
        rewards.mayorHat += 1;
      },
      unreward: () => {
        rewards.mayorHat = 0;
      },
    },
    {
      test: {
        [Dog.skillIndices.mathscience]: 6,
      },
      success: 'You were rewarded for answering a question in class! Incorrectly, though...',
      fail: `Professor ${_.sample(names)} gave you a textbook in hopes that you'll study more.`,
      reward: () => {
        rewards.textbook += 1;
      },
      unreward: () => {
        rewards.textbook += 1;
      },
    },
    {
      test: {
        [Dog.skillIndices.mathscience]: 12,
      },
      success: 'All that dog cramming was worth it. You passed the exam!',
      fail: 'You weren\'t sure what to do with the piece of paper with the word "exam" on it. So, you ate it, of course.',
      reward: () => {
        rewards.flask += 1;
      },
      unreward: () => {},
    },
    {
      test: {
        [Dog.skillIndices.mathscience]: 24,
      },
      success: 'In lab, you correctly mixed the right materials together! The TA made you put on some safety goggles.',
      fail: 'You put your mystery concoction on the bunsen burner. Sensing danger, the professor comes and scolds you.',
      reward: () => {
        rewards.safetyGoggles = 1;
      },
      unreward: () => {
        rewards.flask = 0;
      },
    },
    {
      test: {
        [Dog.skillIndices.mathscience]: 32,
      },
      success: 'After completing and defending your dissertation, you\'re rewarded with a Ph. D. in Dogscience',
      fail: 'You try to explain how dog gravity is faster than human gravity. The professor gives you a quizzical look.',
      reward: () => {
        rewards.phd += 1;
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
      if (event.shape != null) return event.text;
      if (event.test != null) {
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
