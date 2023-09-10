const {Composer} = require("telegraf");
const sql = require('../models');
module.exports = Composer.command('setgroup', async ctx => {
    if(!ctx.payload) return ctx.reply('Укажите группу после команды, в формате /setgroup <группа>');
    const user = await sql.User.findByPk(ctx.from.id);
    user.group = ctx.payload.split(' ')[0]?.toUpperCase();
    await user.save()
    ctx.reply(`Установил твою группу на ${ctx.payload.split(' ')[0]?.toUpperCase()}`);
})