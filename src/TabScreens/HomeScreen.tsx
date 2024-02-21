import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, StatusBar, Platform, Alert } from 'react-native';
import StatusTable from '../components/StatusTable';
import theme from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackScreenProps } from './types';
import AlertRNPaper from '../components/Schedule/UI/AlertRNPaper';

export default function HomeScreen({ navigation, route }: RootStackScreenProps<"HomeScreen">) {

    return <ScrollView style={styles.container}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle={"light-content"} />
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusTable />
            <View style={{ padding: 10, backgroundColor: theme.colors.primary }}>
                <Text>Heizung jetzt Einschalten</Text>
            </View>
        </View>
        <AlertRNPaper title='Test'
            actions={[{
                text: "OK", onPress() {
                    console.log("hi")
                },
                buttonStyle: { color: "red", backgroundColor: "green" }
            },
            {
                text: "OK", onPress() {
                    console.log("hi")
                },
                buttonStyle: { color: "red", backgroundColor: "green" }
            }]} />
    </ScrollView>

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 10,
        alignItems: 'center',
    },
    headerText: {
        color: 'white', // Set your desired header text color
        fontSize: 18,
        fontWeight: 'bold',
    },
});