const Sequelize = require('sequelize')

const database = process.env.DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD; // Verifique se este é o nome correto
const port = process.env.DB_PORT; // Porta padrão para MySQL
const host = process.env.DB_HOST

const connection = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  logging: false,
});


module.exports = connection;