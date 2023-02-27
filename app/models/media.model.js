module.exports = (sequelize, Sequelize) => {
  const Media = sequelize.define("medias", {
    type: {
      type: Sequelize.STRING,      
    },
    name: {
      type: Sequelize.STRING,
    },
    data: {
      type: Sequelize.BLOB('long'),
    },    
  });

  return Media;
};