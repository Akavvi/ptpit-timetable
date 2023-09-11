const {Composer} = require("telegraf");
const axios = require('axios');
const db = require('../models')
module.exports = Composer.command('week', async (ctx) => {
    const { group } = await db.User.findByPk(ctx.from.id);
    if(!group) return ctx.reply('Вы не установили группу, воспользуйтесь /setgroup');

    let groups = await axios.get('https://api.ptpit.ru/groups')
    const groupId = groups.data.find(i => i.name === group)?.id;
    if(!groupId) return ctx.reply('Похоже вашей группы не существует, вы пустота')

    const lastMonday = getMonday(new Date()).toISOString().slice(0, 10);
    const url = `https://api.ptpit.ru/timetable/groups/${groupId}/${lastMonday}`
    const timetable = await axios.get(url);
    let message = `Расписание на неделю: \n`;

    const week = dates(new Date())
    week.shift()
    week.forEach(date => {
        const lessons = timetable.data.filter(i => i.date === date);
        message += `\n ${date}: \n`;
        lessons.forEach(i => {
            message += `${emoji[date === getMonday(date).toISOString().slice(0,10) ? `${i.num}monday` : i.num]} ${i.subject_name}\n`
        })
    })
    // timetable.data.forEach(i => {
    //     message += `${emoji[i.num]} ${i.subject_name}\n`
    // })
    ctx.reply(message)
})

function getMonday(date) {
    date = new Date(date);
    const day = date.getDay(),
        diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff));
}

function dates(date) {
    return Array(7).fill(new Date(date)).map((el, idx) =>
    new Date(el.setDate(el.getDate() - el.getDay() + idx)).toISOString().slice(0,10))
}

const emoji = {
    1: '1⃣ 8:30-9:15',
    2: '2⃣ 10:15-11:50',
    3: '3⃣ 12:10-13:45',
    4: '4⃣ 14:05-15:40',
    5: '5⃣ 16:00-17:35',
    6: '6⃣ 17:45-19:20',
    7: '7️⃣ 17:00-18:00',
    '1monday': '1⃣ 8:30-9:30',
    '2monday': '2⃣ 9:40-10:40',
    '3monday': '3⃣ 11:00-12:00',
    '4monday': '4⃣ 12:10-13:10',
    '5monday': '5⃣ 14:30-15:30',
    '6monday': '6⃣ 15:50-16:50',
    '7monday': '7️⃣ 17:00-18:00'
}