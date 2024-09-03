require('dotenv').config(); // Assegure-se de que o dotenv está sendo chamado

const Sequelize = require('sequelize');

const database = process.env.DATABASE;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const port = process.env.DB_PORT || 3306; // Use a porta correta do MySQL
const host = process.env.DB_HOST;

const connection = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: 'mysql',
  logging: false,
});

module.exports = connection;
