export type Schedule = _Event[]

export type WeeklyEvent = {
    type?: "weekly",
    start: {
        day: number;
        time: string;
    };
    duration: string;
    excludedDays?: string[];
};

export type SpecialEvent = {
    type?: "special",
    start: {
        date: string;
        time: string;
    };
    duration: string;
};

export type _Event = WeeklyEvent | SpecialEvent

export type EventDetails = {
    isWeekly: boolean
    startMoment: moment.Moment
    endMoment: moment.Moment
    weekDayDate: string
    prevEvent?: _Event
}