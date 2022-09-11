import React, { useCallback } from 'react';
import ReceptionScreen from './screens/authScreens/receptionScreen/ReceptionScreen';
import { useFonts } from 'expo-font';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/authScreens/loginScreen/LoginScreen';
import RegistrationScreen from './screens/authScreens/registrationScreen/RegistrationScreen';
import * as SplashScreen from 'expo-splash-screen';
import Loader from './components/Loader';
import ResetPasswordScreen from './screens/authScreens/resetPasswordScreen/ResetPasswordScreen';
import Home from './screens/home/Home';
import Profile from './screens/profile/Profile';
import Notifications from './screens/notifications/Notifications';
import TodoList from './screens/todoList/TodoList';
import { LogBox } from 'react-native';


LogBox.ignoreAllLogs();//Ignore all log notifications
const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'CSMS': require('./assets/fonts/csms.ttf'),
    'Europa-Regular': require('./assets/fonts/europareg.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ReceptionScreen' screenOptions={{ animation: 'none' }}>
        <Stack.Screen options={{ headerShown: false }} name="ReceptionScreen" component={ReceptionScreen} />
        <Stack.Screen options={{ headerShown: false }} name="LoginScreen" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }} name="RegistrationScreen" component={RegistrationScreen} />
        <Stack.Screen options={{ headerShown: false }} name="ResetPasswordScreen" component={ResetPasswordScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Home" component={Home} />
        <Stack.Screen options={{ headerShown: false }} name="Profile" component={Profile} />
        <Stack.Screen options={{ headerShown: false }} name="Notifications" component={Notifications} />
        <Stack.Screen options={{ headerShown: false }} name="TodoList" component={TodoList} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
