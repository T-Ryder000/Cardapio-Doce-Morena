const Sequelize = require('sequelize')
const connection = require('../database/database')
const User = require('../users/User')
const Product = require('../products/Product')

const Cart = connection.define('carts', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  idProduct: {
    type: Sequelize.INTEGER
  },
  idUser: {
    type: Sequelize.INTEGER
  },
})


// Cart.sync({ force:true })

module.exports = Cart