module.exports = (sequelize, Sequelize) => {
  const Tweet = sequelize.define("tweets", {
    parent_ID: {
      type: Sequelize.INTEGER,
    },
    user_ID: {
      type: Sequelize.INTEGER,
      onDelete: "CASCADE",
      references: {
        model: "Users",
        key: "id",
        as: "userId",
      },
    },
    text: {
      type: Sequelize.TEXT,
    },
  });

  return Tweet;
};
