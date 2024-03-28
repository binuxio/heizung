import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, StatusBar, Platform, Alert, ImageBackground, Image } from 'react-native';
import StatusTable from '../../components/Home/StatusTable';
import theme from '../../theme';
import { StackScreenProps, createStackNavigator } from '@react-navigation/stack';
import { RootStackScreenProps } from '../types';
// import { BlurView } from '@react-native-community/blur';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import Zeitplan from './components/Zeitplan';
import fetchSchedule from '@/api/schedule/fetchSchedule';
import { useAppDispatch } from '@/redux/hooks';
import errorHandlerUI from '@/components/UI/errorHandlerUI';

const powerStateColor = {
    on: "green",
    off: "orange",
}

export default function HomeScreen(stackProps: RootStackScreenProps<"HomeScreen">) {
    const dispatch = useAppDispatch()


    useEffect(() => {
        (async () => {
            const res = await fetchSchedule(dispatch)
            errorHandlerUI(res)
        })()
    }, [])

    return <View style={{ flex: 1 }}>
        <StatusBar backgroundColor="transparent" translucent barStyle={"dark-content"} />
        <View style={styles.container}>
            <View style={{ height: 230 }}>
                <ImageBackground source={require('@assets/mosque.jpg')} resizeMode='cover' style={{ flex: 1 }}>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View style={styles.headerBoxContainer}>
                            {/* <View style={styles.headerBox}>
                                <BlurView style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 4 }} tint="light" intensity={50} />

                                <View style={{ alignItems: "center" }}>
                                    <Ionicons name='power' size={35} style={{ marginRight: 5, color: colorState.on }} />
                                    <Text style={{ color: colorState.on, fontWeight: "400", fontSize: 12, textAlign: "center", }}>Heizung eingeschaltet</Text>
                                </View>
                            </View> */}
                            <View style={styles.headerBox}>
                                <Image source={require("@assets/249.jpg")}
                                    style={{ backgroundColor: "white", position: "absolute", left: 0, top: 0, right: 0, bottom: 0, opacity: .6, resizeMode: "cover" }} />
                                <View style={{ alignItems: "center" }}>
                                    <Ionicons name='power' size={35} style={{ marginRight: 5, color: powerStateColor.off }} />
                                    <Text style={{ color: powerStateColor.off, fontWeight: "500", fontSize: 12, textAlign: "center" }}>Heizung eingeschaltet</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </ImageBackground>
            </View>
            <ImageBackground source={require('@assets/homeBackground.jpg')} resizeMode='cover' style={{ flex: 1 }}>
                <Zeitplan stackProps={stackProps} />
            </ImageBackground>
        </View>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    headerBoxContainer: {
        flexDirection: "row", marginTop: "auto", marginBottom: 30, paddingHorizontal: 16, gap: 16
    },
    headerBox: {
        width: 110,
        height: 110,
        borderRadius: 16,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center"
    },
});