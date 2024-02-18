import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '../../../storage';
import { Schedule } from '../../types';
import createEventsMap from './createEventsMap';
import { Alert } from 'react-native';

export default async function (): Promise<{ status: number, error?: string }> {
    const url = "http://192.168.178.64:6500/getSchedule"
    try {
        const res = await fetch(url)
        if (res.status == 200) {
            const schedule = await res.json()
            createEventsMap(schedule)
            return { status: 200 }
        } else return { status: res.status, error: await res.text() }
    } catch (error: any) {
        return { status: 404, error: "Server kann nicht erreicht werden" }
    }
}