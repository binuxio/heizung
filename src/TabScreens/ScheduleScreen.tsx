import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import EventsCalendar from '../utils/Schedule/StackScreens/EventsCalendar';
import theme from '../theme';
import { StatusBar } from 'expo-status-bar';
import { createStackNavigator } from '@react-navigation/stack';
import ScheduleEditor from '../utils/Schedule/StackScreens/ScheduleEditor';
import { ScheduleStackParamList, ScheduleStackScreenProps } from '../utils/Schedule/StackScreens/types';
import { RootStackScreenProps } from './types';
import { useAppDispatch } from '../storage/redux/hooks';
import { setScheduleStackScreenOpen } from '../storage/redux/slice.appData';

const Stack = createStackNavigator<ScheduleStackParamList>()

export default function ScheduleScreen({ navigation }: RootStackScreenProps<"SchedueScreen">) {
    const dispatch = useAppDispatch()

    return (
        <Stack.Navigator>
            <Stack.Screen component={EventsCalendar} name='EventsCalendar'
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen component={ScheduleEditor} name="ScheduleEditor"
                listeners={{
                    transitionStart: () => {
                        dispatch(setScheduleStackScreenOpen(false))
                    },
                    focus: () => {
                        dispatch(setScheduleStackScreenOpen(true))
                    }
                }}
                options={{
                    presentation: "card",
                    transitionSpec: {
                        open: { animation: "timing", config: { duration: 150, delay: 50 } },
                        close: { animation: "timing", config: { duration: 150 } }
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