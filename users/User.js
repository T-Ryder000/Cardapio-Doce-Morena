const Sequelize = require('sequelize')
const connection = require('../database/database')

const User = connection.define('users', {
  name:{
    type: Sequelize.STRING,
    allowNull: false,
  },
  email:{
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false
  }
  ,
  admin:{
    type: Sequelize.BOOLEAN,
    allowNull: false
  }
})

// User.sync({force:false})
// User.sync({ alter: true });

module.exports = User;