export type Schedule = _Event[]

export type WeeklyEvent = {
    _id: string
    isWeekly: boolean
    start: {
        day: number;
        time: string;
    };
    end: {
        day: number;
        time: string;
    }
};

export type SpecialEvent = {
    _id: string
    isWeekly: boolean
    start: {
        date: string;
        time: string;
    };
    end: {
        date: string;
        time: string;
    }
};

export type _Event = WeeklyEvent | SpecialEvent

export type EventMoments = {
    isWeekly: boolean
    startMoment: moment.Moment
    endMoment: moment.Moment
    _id: string | undefined
}