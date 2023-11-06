function getMonday(date) {
    date = new Date(date);
    const day = date.getDay(),
        diff = date.getDate() - day + (day === 0 ? -6:1); // adjust when day is sunday
    return new Date(date.setDate(diff));
}

function dates(current) {
    var week= new Array();
    // Starting Monday not Sunday
    current.setDate((current.getDate() - current.getDay() +1));
    for (var i = 0; i < 7; i++) {
        week.push(
            new Date(current).toISOString().slice(0,10)
        );
        current.setDate(current.getDate() +1);
    }
    return week;
}

module.exports = { dates, getMonday }