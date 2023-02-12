module.exports = (sequelize, Sequelize) => {
  const Tweet = sequelize.define("tweets", {
    parent_ID: {
      type: Sequelize.INTEGER,
    },
    text: {
      type: Sequelize.TEXT,
    },
  });

  return Tweet;
};
