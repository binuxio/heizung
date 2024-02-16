import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import EventsCalendar from '../components/Schedule/EventsCalendar';
import theme from '../theme';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from './types';
import ScheduleEditor from '../components/Schedule/ScheduleEditor';

const Stack = createStackNavigator<StackParamList>()

export default function ScheduleScreen() {
    return (
        <Stack.Navigator>
            <Stack.Screen component={EventsCalendar} name='EventsCalendar' options={{
                header: () => null
            }} />
            <Stack.Screen component={ScheduleEditor} name="ScheduleEditor" options={{
                transitionSpec: {
                    open: { animation: "timing", config: { duration: 200 } },
                    close: { animation: "timing", config: { duration: 200 } }
                }
            }} />
        </Stack.Navigator>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});