const { Sequelize} = require("sequelize");
const fs = require("fs");
const path = require("path");
const sql = new Sequelize(process.env.DB_URL)

const db = {};
db.sql = sql;

const models = fs.readdirSync(path.join(__dirname, '..', 'models'));
for (const model of models) {
    if(model === 'index.js') continue;
    const required = require(path.join(__dirname, '..', 'models', model));
    db[model.split('.js')[0]] = required(sql);
}

try {
    sql.authenticate();
    sql.sync({ alter: true })
} catch(e) {
    console.log(e);
    process.exit(1);
}

module.exports = db