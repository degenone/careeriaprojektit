import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';
import React from 'react';
import { FontAwesome5 } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HelloWorld from './components/HelloWorld';
import JsonList from './components/JsonList';
import YleTekstiTV from './components/YleTekstiTV';
import { api_user, api_password } from "./ApiKeys";
import { BASE_URL } from "./connections";
import * as SecureStore from 'expo-secure-store';
import NWRouter from './components/northwind/NWRouter';
import { globalStyles, globalColors } from './styles/global';

const setToken = async () => {
  let tokenTO = await SecureStore.getItemAsync('token-timeout');
  // nyt - timeout < päivä millisekunteina ?
  if (tokenTO !== null && (Date.now() - +tokenTO) < 86400000) {
    // console.log('token still active');
    return;
  }
  // console.log('fetching token');
  const result = await fetch(BASE_URL + 'reactlogin/login', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'content-type': 'application/json'
    },
    body: JSON.stringify({ Username: api_user, Password: api_password })
  });
  if (result.status === 200) {
    let token = (await result.json()).token;
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('token-timeout', Date.now().toString());
  } else {
    console.log(`Something went wrong ${await result.json()}`);
  }
};
// setToken();

export default function App() {
  const { Navigator, Screen } = createMaterialTopTabNavigator();

  return (
    <NavigationContainer>
      <Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => {
            let iconName;
            switch (route.name) {
              case 'HelloWorld':
                iconName = 'home'
                break;
              case 'JsonList':
                iconName = 'tasks'
                break;
              case 'YleTekstiTV':
                iconName = 'newspaper'
                break;
              case 'NWRouter':
                iconName = 'database'
                break;
              default:
                iconName = 'question-circle'
                break;
            }

            return <FontAwesome5 name={iconName} size={20} color={color} />;
          }
        })}
        tabBarOptions={{
          activeTintColor: '#fff',
          inactiveTintColor: globalColors.muddyYellow,
          indicatorStyle: {
            height: 3,
            backgroundColor: '#fff',
          },
          style: globalStyles.tabBar,
          labelStyle: { fontSize: 12, },
          showIcon: true,
        }}
      >
        <Screen name='HelloWorld' component={HelloWorld} options={{ tabBarLabel: 'Home' }} />
        <Screen name='JsonList' component={JsonList} options={{ tabBarLabel: 'ToDo' }} />
        <Screen name='YleTekstiTV' component={YleTekstiTV} options={{ tabBarLabel: 'TekstiTV' }} />
        <Screen name='NWRouter' component={NWRouter} options={{ tabBarLabel: 'Tuotteet' }} />
      </Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}