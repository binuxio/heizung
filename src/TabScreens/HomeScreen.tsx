import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView, StatusBar, Platform } from 'react-native';
import StatusTable from '../components/StatusTable';
import theme from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackScreenProps } from './types';

export default function HomeScreen({ navigation, route }: RootStackScreenProps<"HomeScreen">) {

    return <ScrollView style={styles.container}>
        <StatusBar backgroundColor={theme.colors.primary} barStyle={"light-content"} />
        <View style={{ flex: 1, backgroundColor: theme.colors.primary }}>
            <StatusTable />
            <View style={{ padding: 10, backgroundColor: theme.colors.primary }}>
                <Text>Heizung jetzt Einschalten</Text>
            </View>
        </View>
    </ScrollView>
    {/* <View style={{ backgroundColor: "red", height: 50, alignItems: "center" }}>
            <TouchableOpacity style={{ flex: 1 }}>
                {navigation.isFocused() ?
                    <Ionicons name={"home-sharp"} size={25} color={theme.colors.primary} />
                    : <Ionicons name={"home-sharp"} size={25} />}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
                {navigation.isFocused() ?
                    <Ionicons name={"calendar"} size={25} color={theme.colors.primary} />
                    : <Ionicons name={"calendar"} size={25} />}
            </View>
        </View> */}
    {/* </View > */ }
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