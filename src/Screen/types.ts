import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EventDetails } from '../components/types';
import moment from 'moment';

export type StackParamList = {
    Home: undefined
    ScheduleEditor: { events?: EventDetails[], weekDayDate?: moment.Moment }
    EventsCalendar: {}
}

export type StackScreenProps<Screen extends keyof StackParamList> = NativeStackScreenProps<StackParamList, Screen>;