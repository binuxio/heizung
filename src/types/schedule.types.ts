export type Schedule = {
    [day: number]: _Event[]
}

export type _Event = {
    start: {
        day: number;
        time: string;
    };
    end: {
        time: string;
        day: number
    }
    id: string
};

export type UpdateScheduleRequest = {
    day: number
    newEvents: _Event[]
    deletedEventsId: string[]
}