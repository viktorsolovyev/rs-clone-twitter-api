module.exports = (sequelize, Sequelize) => {
  const Tweet = sequelize.define("tweets", {
    parentId: {
      type: Sequelize.INTEGER,
    },
    text: {
      type: Sequelize.TEXT,
    },
    isRetweet: {
      type: Sequelize.BOOLEAN,
    },
  });

  return Tweet;
};
