import moment from "moment";

export function parseDateStringInMoment(date: string, format = 'DD-MM-YYYY HH:mm:ss') {
    return moment(date, format);
}