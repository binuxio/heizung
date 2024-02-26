import React, { memo } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './TabScreens/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import ScheduleScreen from './TabScreens/ScheduleScreen';
import theme from './theme';
import { RootStackParamList } from './TabScreens/types';
import { useAppSelector } from '../redux/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<RootStackParamList>();

const Main: React.FC = () => {
  const scheduleEditorOpen = useAppSelector(state => state.appState.scheduleEditorStackScreenOpen)

  return (
    <Tab.Navigator initialRouteName='HomeScreen' screenOptions={{
      tabBarShowLabel: false,
      tabBarStyle: {
        display: scheduleEditorOpen ? "none" : "flex"
      }
    }} >
      <Tab.Screen name="HomeScreen" component={HomeScreen}
        options={{
          header: () => <Header title='Heizung - Übersicht' />,
          tabBarIcon: ({ focused }) => <Ionicons name={"home-sharp"} size={25} color={focused ? theme.colors.primary : "black"} />
        }} />
      <Tab.Screen name="SchedueScreen" component={ScheduleScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons name={"calendar-edit"} size={25} color={focused ? theme.colors.primary : "black"} />
        }}
      />
    </Tab.Navigator>
  );
};

export default Main;


const Header: React.FC<{ title: string }> = ({ title }) => {
  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#0369a0",
      padding: 8
    },
    title: {
      fontSize: 21,
      color: "white",
      textAlign: "center"
    }
  })

  return <View style={styles.container}>
    <Text style={styles.title}>{title}</Text>
  </View>
}