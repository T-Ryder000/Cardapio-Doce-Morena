const Sequelize = require('sequelize')
const connection = require('../database/database')

const Category = connection.define('categories', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  slug:{
    type: Sequelize.STRING,
    allowNull: false
  },
  icon: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  }
})

// Category.sync({ force:true })
// Category.sync({ alter: true });

module.exports = Category