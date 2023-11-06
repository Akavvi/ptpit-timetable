const {Composer} = require("telegraf");
const db = require("../models");
const {getGroupId, getTimetable, getRoom} = require("../utils/api");
const {getMonday, dates} = require("../utils/dates");
const {emoji} = require("../utils/constants");
module.exports = Composer.command('today', async (ctx) => {
    const {group} = await db.User.findByPk(ctx.from.id);
    if (!group) return ctx.reply('Вы не установили группу, воспользуйтесь /setgroup');

    const groupId = await getGroupId(group);
    if (!groupId) return ctx.reply('Похоже вашей группы не существует, вы пустота')

    const lastMonday = getMonday(new Date()).toISOString().slice(0, 10);
    const timetable = await getTimetable(groupId, lastMonday)
    let message = `Расписание на сегодня: \n`;
    const lessons = timetable.data.filter(i => i.date === new Date().toISOString().slice(0, 10))
    for (const i of lessons) {
        let room = await getRoom(i.room_id);
        if (room.includes('спорт'))
            room = 'спорт.зал';
        else if(room.includes('ДО'))
            room = `Дистанционное обучение ${i.moodle == null ? '' : JSON.parse(i.moodle)[0]?.url}`;
        else
            room = `каб ${room}`;

        message += `${emoji[i.num]} - <b>${i.subject_name}</b>
        ${i.teacher_name} ${i.teacher_secondname} 
        ${i.subgroup == 0 ? '' : 'подгруппа ' + i.subgroup}\ ${room}\n`
    }
    // week.forEach(date => {
    //     const lessons = timetable.data.filter(i => i.date === date);
    //     message += `\n ${date}: \n`;
    //     lessons.forEach(i => {
    //         message += `${emoji[date === getMonday(date).toISOString().slice(0,10) ? `${i.num}monday` : i.num]} ${i.subject_name}\n`
    //     })
    // })
    // timetable.data.forEach(i => {
    //     message += `${emoji[i.num]} ${i.subject_name}\n`
    // })
    ctx.replyWithHTML(message)
})