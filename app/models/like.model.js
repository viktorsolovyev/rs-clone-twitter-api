module.exports = (sequelize, Sequelize) => {
  const Like = sequelize.define("likes");

  return Like;
};
