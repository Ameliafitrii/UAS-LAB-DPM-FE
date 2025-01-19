import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HomeScreen from '../screens/HomeScreen';
import HealthManagementScreen from '../screens/HealthManagementScreen';
import HealthRecordScreen from '../screens/HealthRecordScreen';
import { View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const CustomTabBarLabel = ({ label, color }: { label: string; color: string }) => (
  <Text style={[styles.tabLabel, { color }]}>{label}</Text>
);

const BottomNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#EFEFEF',
          height: 90,
          paddingBottom: 10,
          paddingTop: 10,
          borderTopColor: '#333',
          borderTopWidth: 2,
        },
        tabBarActiveTintColor: '#333',
        tabBarInactiveTintColor: '#777', 
        tabBarLabel: ({ focused, color }) => {
          const label =
            route.name === 'Home'
              ? 'Home'
              : route.name === 'Health Management'
              ? 'Health Management'
                : route.name === 'Health Record'
              ? 'Health Record'
              : 'Health Record';
          return <CustomTabBarLabel label={label} color={color} />;
        },
          tabBarIcon: ({ color, size }) => {
            let iconName: string;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Health Management') {
              iconName = 'medicinebox';
            } else if (route.name === 'Health Record') {
              iconName = 'folder1';
            } else {
              iconName = 'question'; 
            }

            return <AntDesign name={iconName} size={size} color={color} />;
          },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Health Management" component={HealthManagementScreen} />
      <Tab.Screen name="Health Record" component={HealthRecordScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: 'bold',
  },
});

export default BottomNavigator;
