import moment from "moment";

export default function (baseMoment: moment.Moment, compMoment: moment.Moment): boolean {
    const mainMoment = moment()
    const baseM = mainMoment.clone().set("hours", baseMoment.hours()).set("minutes", baseMoment.minutes())
    const compM = mainMoment.clone().set("hours", compMoment.hours()).set("minutes", compMoment.minutes())
    return baseM.isSameOrBefore(compM)
}