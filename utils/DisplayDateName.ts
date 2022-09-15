import moment from "moment";

export function displayDateName(date: string) {
    if (moment(date, 'DD-MM-YYYY').diff(moment(), 'days') == 0) {
        return 'Aujourd\'hui'
    }
    if (moment(date, 'DD-MM-YYYY').diff(moment(), 'days') == - 1) {
        return 'Hier'
    }
    return (date);
}