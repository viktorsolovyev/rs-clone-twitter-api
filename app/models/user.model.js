export default (sequelize, Sequelize) => {
  const User = sequelize.define("users", {
    username: {
      type: Sequelize.STRING,
      unique: true,
    },
    email: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
    },
    about: {
      type: Sequelize.TEXT,
    },
    location: {
      type: Sequelize.STRING,
    },
    site: {
      type: Sequelize.STRING,
    },
    birthday: {
      type: Sequelize.DATE,
    },
  });

  return User;
};
