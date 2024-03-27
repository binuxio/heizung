import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, StatusBar, Platform, Alert, ImageBackground, Image } from 'react-native';
import StatusTable from '../components/Home/StatusTable';
import theme from '../theme';
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import { RootStackScreenProps } from './types';
// import { BlurView } from '@react-native-community/blur';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Zeitplan from '../components/Home/Zeitplan';

const colorState = {
    on: "green",
    off: "yellow",
}

const Stack = createStackNavigator<HomeStackParamList>()

export default function ScheduleScreen({ navigation }: RootStackScreenProps<"SchedueScreen">) {
    const dispatch = useAppDispatch()

    return (
        <Stack.Navigator>
            <Stack.Screen component={HomeScreen} name='Home'
                options={{
                    headerShown: false,
                }} />
            <Stack.Screen component={ScheduleEditor} name="ScheduleEditor"
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

export default function HomeScreen({ navigation, route }: RootStackScreenProps<"HomeScreen">) {

    return <ScrollView contentContainerStyle={{}}>
        <StatusBar backgroundColor="transparent" translucent barStyle={"dark-content"} />
        <View style={styles.container}>
            {/* <Image source={require('../../assets/homeBackground.jpg')} style={{ width: "100%", height: "100%", resizeMode: 'stretch', position: "absolute" }} /> */}
            <View style={{ height: 230 }}>
                <ImageBackground source={require('../../assets/mosque.jpg')} resizeMode='cover' style={{ flex: 1 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.headerBoxContainer}>
                            <View style={styles.headerBox}>
                                <BlurView style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 4 }} tint="light" intensity={50} />
                                <View style={{ alignItems: "center" }}>
                                    <Ionicons name='power' size={35} style={{ marginRight: 5, color: colorState.on }} />
                                    <Text style={{ color: colorState.on, fontWeight: "400", fontSize: 12, textAlign: "center", }}>Heizung eingeschaltet</Text>
                                </View>
                            </View>
                            <View style={styles.headerBox}>
                                <BlurView style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 4 }} tint="light" intensity={50} />
                                <View style={{ alignItems: "center" }}>

                                </View>
                            </View>
                            <View style={styles.headerBox}>
                                <BlurView style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 4 }} tint="light" intensity={50} />
                                <View style={{ alignItems: "center" }}>
                                    <Ionicons name='power' size={35} style={{ marginRight: 5, color: colorState.on }} />
                                    <Text style={{ color: colorState.on, fontWeight: "400", fontSize: 12, textAlign: "center", }}>Heizung eingeschaltet</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
            <ImageBackground source={require('../../assets/homeBackground.jpg')} resizeMode='cover' style={{ flex: 1, }}>
                <Zeitplan />
            </ImageBackground>
        </View>
    </ScrollView>
}

const styles = StyleSheet.create({
    container: {
        // minHeight: "100%"
    },
    headerBoxContainer: {
        flexDirection: "row", marginTop: "auto", marginBottom: 30, paddingHorizontal: 16, gap: 16
    },
    headerBox: {
        width: 110, height: 110, borderRadius: 16, overflow: "hidden", justifyContent: "center", alignItems: "center"
    },
});