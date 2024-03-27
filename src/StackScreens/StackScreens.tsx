import React from 'react'
import HomeScreen from './HomeScreen';
import EventEditorScreen from './EventEditorScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { RootStackParamList } from './types';


const Stack = createStackNavigator<RootStackParamList>()

const StackScreens = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen component={HomeScreen} name='HomeScreen'
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen component={EventEditorScreen} name="EventEditorScreen"
                options={{
                    presentation: "card",
                    transitionSpec: {
                        open: { animation: "timing", config: { duration: 150, delay: 50 } },
                        close: { animation: "timing", config: { duration: 150 } }
                    }
                }} />
        </Stack.Navigator>
    )
}

export default StackScreens