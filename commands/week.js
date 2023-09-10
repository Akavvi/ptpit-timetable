const {Composer} = require("telegraf");
const axios = require('axios');
const db = require('../models')
module.exports = Composer.command('week', async (ctx) => {
    const { group } = await db.User.findByPk(ctx.from.id);
    if(!group) return ctx.reply('Вы не установили группу, воспользуйтесь /setgroup');

    let groups = await axios.get('https://api.ptpit.ru/groups')
    const groupId = groups.data.find(i => i.name === group).id;

    const lastMonday = getMonday(new Date()).toISOString().slice(0, 10);
    const url = `https://api.ptpit.ru/timetable/groups/${groupId}/${lastMonday}`
    const timetable = await axios.get(url);
    let message = `Расписание на неделю: \n`;

    dates(new Date()).forEach(date => {
        const lessons = timetable.data.filter(i => i.date === date);
        message += `\n ${date}: \n`;
        lessons.forEach(i => {
            message += `${emoji[i.num]} ${i.subject_name}\n`
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

function dates(current) {
    const week = [];
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay() + 1));
    for (let i = 0; i < 7; i++) {
        week.push(
            new Date(current).toISOString().slice(0, 10)
        );
        current.setDate(current.getDate() + 1);
    }
    return week;
}

const emoji = {
    1: '1⃣ ',
    2: '2⃣',
    3: '3⃣',
    4: '4⃣ ',
    5: '5⃣ ',
    6: '6⃣',
    7: '7️⃣',
}