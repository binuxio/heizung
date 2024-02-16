import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './Screen/HomeScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { StyleSheet, Text, View } from 'react-native';
import ScheduleScreen from './Screen/ScheduleScreen';
import theme from './theme';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {

  return (

    <Tab.Navigator initialRouteName='ScheduleScreen' screenOptions={{ tabBarShowLabel: false }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          header: () => <Header title='Heizung - Übersicht' />,
          tabBarIcon: ({ focused }) => {
            if (focused)
              return <Ionicons name={"home-sharp"} size={25} color={theme.colors.primary} />
            return <Ionicons name={"home-sharp"} size={25} />
          },
        }} />
      <Tab.Screen name="ScheduleScreen" component={ScheduleScreen}
        options={{
          header: () => null,
          tabBarIcon: ({ focused }) => {
            if (focused)
              return <Ionicons name={"calendar"} size={25} color={theme.colors.primary} />
            return <Ionicons name={"calendar"} size={25} />
          },
        }} />
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