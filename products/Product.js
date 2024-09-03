const Sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Category')

const Product = connection.define('products', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  slug: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  description: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true
  },
  stock: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  additional: {
    type: Sequelize.JSON,
    allowNull: true, // Ou false se for obrigatório
    defaultValue: [] // Define um array vazio como padrão
  },
  flavor: {
    type: Sequelize.JSON,
    allowNull: true,
    defaultValue: []
  },  
  ratings: {
    type: Sequelize.JSON,
    defaultValue: { media: 0, total: 0 }
  },
  tags: {
    type: Sequelize.JSON,
    defaultValue: []
  },
  shortDescription: {
    type: Sequelize.STRING,
    allowNull: true
  },
  status: {
    type: Sequelize.STRING,
  }
})

Product.belongsTo(Category) //Um produto pertence a uma categoria
Category.hasMany(Product) //Uma categoria possui varios produtos

// Product.sync({ force:true })
// Product.sync({ alter: true });


module.exports = Product