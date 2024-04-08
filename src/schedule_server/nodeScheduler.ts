import nodeScheduler from "node-schedule";

class SchedulerSingleton {
    private static instance: SchedulerSingleton;
    scheduler: typeof nodeScheduler;

    private constructor() {
        this.scheduler = nodeScheduler;
    }

    static getInstance(): SchedulerSingleton {
        if (!SchedulerSingleton.instance) {
            SchedulerSingleton.instance = new SchedulerSingleton();
        }
        return SchedulerSingleton.instance;
    }
}

const schedulerInstance = SchedulerSingleton.getInstance();

export default schedulerInstance.scheduler

export let runningEvent: undefined | string = undefined

// const eventsState = new Map<string, EventState>()

const PriorityEvent = undefined

// export const setRunningEvent = (_runningEvent) => runningEvent = _runningEvent