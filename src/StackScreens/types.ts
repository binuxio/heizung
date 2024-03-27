import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Schedule, _Event } from '../types/schedule.types';

export type RootStackParamList = {
    HomeScreen: undefined
    EventEditorScreen: { events: _Event[], day: number, selectedEventID: string | undefined }
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Screen>;