require('dotenv').config();
const { Telegraf } = require('telegraf');
const fs = require("fs");
const path = require("path");
const sql = require('./models')

const bot = new Telegraf(process.env.BOT_TOKEN)

bot.start(async (ctx) => {
    if(await sql.User.findByPk(ctx.from.id) === null)
        await sql.User.create({ userId: ctx.message.from.id });

    ctx.reply(`Для установки своей группы, напишите /setgroup <название группы>`)
});

const commands = fs.readdirSync(path.join(__dirname, 'commands'));
for (const command of commands) {
    const module = require(path.join(__dirname, 'commands', command));

    bot.use(module)
}

bot.launch();
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
