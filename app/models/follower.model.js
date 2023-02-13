module.exports = (sequelize, Sequelize) => {
  const Follower = sequelize.define("followers", {
    leader: {
      type: Sequelize.INTEGER,
    },
    follower: {
      type: Sequelize.INTEGER,
    },
  });

  return Follower;
};
