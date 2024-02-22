export type Schedule = _Event[]

export type WeeklyEvent = {
    isWeekly: boolean
    start: {
        day: number;
        time: string;
    };
    end: {
        date: number;
        time: string;
    }
    excludedDays?: string[];
};

export type SpecialEvent = {
    isWeekly: boolean
    start: {
        date: string;
        time: string;
    };
    end: {
        date: number;
        time: string;
    }
    duration: string;
};

export type _Event = WeeklyEvent | SpecialEvent

export type EventDetails = {
    isWeekly: boolean
    startMoment: moment.Moment
    endMoment: moment.Moment
}