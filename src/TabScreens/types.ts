import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { _Event } from '../components/types';
import moment from 'moment';

export type RootStackParamList = {
    HomeScreen: undefined
    SchedueScreen: undefined
}

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<RootStackParamList, Screen>;