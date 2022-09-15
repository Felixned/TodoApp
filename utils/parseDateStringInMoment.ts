import moment from "moment";

export function parseDateStringInMoment(date: string) {
    return moment(date, 'DD-MM-YYYY HH:mm:ss');
}