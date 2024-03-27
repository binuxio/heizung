export type Schedule = _Event[]
export type _Event = WeeklyEvent | SpecialEvent

export type WeeklyEvent = {
    _id: string
    isWeekly: boolean
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
    start: {
        date: string;
        time: string;
    };
    end: {
        time: string;
    }
};

export type UpdateScheduleRequest = {
    day: number
    newEvents: _Event[]
}