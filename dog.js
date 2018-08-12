/* globals _ */
// Hello this is dog
(function() {
  var skills = {
    breathing: 0,
    eating: 0,
    pooping: 0,
    mathscience: 0,
    social: 0,
    dog: 0,
  };

  var skillList = Object.keys(skills);
  var skillIndices = {};
  skillList.forEach((skill, i) => {
    skillIndices[skill] = i;
  });

  var Dog = {
    skills: skills,
    skillList: skillList,
    skillIndices: skillIndices,
    life: 100,
    maxLife: 100,
    initialize: function initialize() {
      Dog.clearSkills();
      Dog.life = 100;
      Dog.maxLife = 100;
    },
    update: function update() {
      if (!skills.breathing || !skills.eating || !skills.pooping) {
        Dog.life = Math.max(Dog.life - 1, 0);
      } else {
        Dog.life = Math.min(Dog.life + 1, Dog.maxLife);
      }
    },
    clearSkills: function clearSkills(idx) {
      skills.breathing = 0;
      skills.eating = 0;
      skills.pooping = 0;
      skills.mathscience = 0;
      skills.social = 0;
      skills.dog = 0;
    },
    getSkill: function getSkill(idx) {
      return Dog.skillList[idx];
    },
    generateSkill: function generateSkill() {
      return _.random(0, Dog.skillList.length - 1);
    },
  }
  window.Dog = Dog;
})();
