const Sequelize = require('sequelize')

const connection = new Sequelize('guiaperguntas', 'root', 'Gabilu0', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection