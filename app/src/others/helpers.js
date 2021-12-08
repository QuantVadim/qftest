export default {
    getDataHash(name) {
        const pattern = /([.$?*|{}()[]\\\/\+^])/g;
        let matches = window.location.href.split('#')[1].match(new RegExp(
            "(?:^|&)" + name.replace(pattern, '\\$1') + "=([^&]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([.$?*|{}()[]\/+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    },
}

export function getNormalDate(date) { //"2020-05-25 20:00:00" -> "25 мая в 20:00"
    let d = date;
    if (date != undefined) {
        let cur = new Date();
        let pDate = date.split(' ')[0].split('-');
        let tDate = date.split(' ')[1].split(':');
        const ms = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
        let iDate = {
            year: +pDate[0],
            month: +pDate[1],
            day: +pDate[2],
            _month: pDate[1],
            _day: pDate[2],
            h: +tDate[0],
            m: tDate[1],
        }
        let curDate = {
            year: cur.getFullYear(),
            month: cur.getMonth() + 1,
            day: cur.getDate(),
        }
        if (iDate.year == curDate.year) {
            if (iDate.month == curDate.month) {
                if (iDate.day == curDate.day) d = `сегодня в ${iDate.h}:${iDate.m}`;
                else if (iDate.day == (curDate.day - 1)) d = `вчера в ${iDate.h}:${iDate.m}`;
                else if (iDate.day == (curDate.day - 2)) d = `позавчера в ${iDate.h}:${iDate.m}`;
                else if (iDate.day == (curDate.day + 1)) d = `завтра в ${iDate.h}:${iDate.m}`;
                else if (iDate.day == (curDate.day + 2)) d = `послезавтра в ${iDate.h}:${iDate.m}`;
                else d = `${iDate.day} ${ms[iDate.month - 1]} в ${iDate.h}:${iDate.m}`;
            } else d = `${iDate.day} ${ms[iDate.month - 1]} в ${iDate.h}:${iDate.m}`;
        } else d = `${iDate.day} ${ms[iDate.month - 1]} в ${iDate.h}:${iDate.m} ${iDate.year}`;
    }
    return d;
}