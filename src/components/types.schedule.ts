export type Schedule = _Event[]
export type _Event = WeeklyEvent | SpecialEvent

export type WeeklyEvent = {
    _id: string
    isWeekly: boolean
    excludedDays: string[]
    start: {
        day: number;
        time: string;
    };
    end: {
        time: string;
    }
};

export type SpecialEvent = {
    _id: string
    isWeekly: boolean
    excludedDays: string[]
    start: {
        date: string;
        time: string;
    };
    end: {
        time: string;
    }
};

export type EventMoments = {
    isWeekly: boolean
    excludedDays: string[]
    startMoment: moment.Moment
    endMoment: moment.Moment
    _id: string | undefined
}