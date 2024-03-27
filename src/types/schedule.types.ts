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
    }
    id: string
    _prevTimeConflict?: boolean
};

export type EventMoment = {
    startMoment: moment.Moment
    endMoment: moment.Moment
    id: string
}