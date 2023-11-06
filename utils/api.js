const axios = require("axios");

async function getGroupId(group) {
    let groups = await axios.get('https://api.ptpit.ru/groups')
    return groups.data.find(i => i.name === group)?.id;
}

async function getTimetable(groupId, week) {
    const url = `https://api.ptpit.ru/timetable/groups/${groupId}/${week}`
    return await axios.get(url)
}

async function getRoom(roomId) {
    const rooms = await axios.get(`https://api.ptpit.ru/rooms`)
    return rooms.data.find(i => i.id === roomId).name
}

module.exports = { getGroupId, getTimetable, getRoom }