export type Schedule = {
    [day: number]: _Event[]
}

export type _Event = {
    _id: string
    start: {
        day: number;
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