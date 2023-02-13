module.exports = (sequelize, Sequelize) => {
  const Follower = sequelize.define("followers", {
    leader: {
      type: Sequelize.STRING,
    },
    follower: {
      type: Sequelize.STRING,
    },
  });

  return Follower;
};
