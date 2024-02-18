import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type ScheduleStackParamList = {
    ScheduleEditor: { weekDayDate?: string }
    EventsCalendar: undefined
}

export type ScheduleStackScreenProps<Screen extends keyof ScheduleStackParamList> = NativeStackScreenProps<ScheduleStackParamList, Screen>;