const {Composer} = require("telegraf");
const axios = require('axios');
const db = require('../models')
const {getTimetable, getGroupId, getRoom} = require("../utils/api");
const {getMonday, dates} = require("../utils/dates");
const {emoji} = require("../utils/constants");
module.exports = Composer.command('week', async (ctx) => {
    const {group} = await db.User.findByPk(ctx.from.id);
    if (!group) return ctx.reply('Вы не установили группу, воспользуйтесь /setgroup');

    const groupId = await getGroupId(group);
    if (!groupId) return ctx.reply('Похоже вашей группы не существует, вы пустота')

    const lastMonday = getMonday(new Date()).toISOString().slice(0, 10);
    const timetable = await getTimetable(groupId, lastMonday)
    let message = `<b>Расписание на неделю:</b>`;
    const week = dates(new Date());
    week.pop();
    // noinspection ES6MissingAwait
    for (const date of week) {
        const lessons = timetable.data.filter(i => i.date === date);
        message += `\n ${date}: \n`;
        for (const i of lessons) {
            let room;
            if(i.room_id)
                room = await getRoom(i.room_id)
            if(room) {
                if (room.includes('спорт'))
                    room = 'спорт.зал';
                else if (room.includes('ДО'))
                    room = `Дистанционное обучение ${i.moodle == null ? '' : JSON.parse(i.moodle)[0]?.url}`;
                else
                    room = `каб ${room}`;
            }
            if(i.teacher_name === null || i.room === null)
                continue;
            message += `${emoji[i.num]} - <b>${i.subject_name}</b>\n ${i.teacher_name} ${i.teacher_secondname} \n ${i.subgroup == 0 ? '' : 'подгруппа ' + i.subgroup + ' - '}\ ${room}\n`
        }
    }
    // timetable.data.forEach(i => {
    //     message += `${emoji[i.num]} ${i.subject_name}\n`
    // })
    ctx.replyWithHTML(message)
})