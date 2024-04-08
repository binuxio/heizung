export type ScheduleMap = Map<number, _Event[]>
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

export type EventMoment = {
    startMoment: moment.Moment
    endMoment: moment.Moment
    id: string
}