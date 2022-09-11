import { Alert, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppStyles, { primaryColor } from '../../../styles/AppStyles'
import LogoApp from '../../../assets/icons/logoApp.svg';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { auth } from '../../../firebase-config';
import Loader from '../../../components/Loader';
import { CommonActions } from '@react-navigation/native';

interface ReceptionScreenProps {
  navigation: any;
}

export default function ReceptionScreen({ navigation }: ReceptionScreenProps) {

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        navigation.replace('Home');
      }
      else {
        setIsLoading(false);
      }
    })
    return unsubscribe;
  }, [])

  return (
    <SafeAreaProvider style={AppStyles.safeAreaStyle}>
      <View style={AppStyles.fullScreenAppContainerCentered}>
        <StatusBar style='light' backgroundColor='#000' />
        {
          isLoading
            ? <View><Loader size={'large'} /></View>
            :
            <View style={[AppStyles.allScreenSpaceAvailableCenteredContainer]}>
              <View style={[styles.logoDiv]}>
                <LogoApp width={110} height={150} fill={primaryColor} />
                <Text style={[AppStyles.titleText, AppStyles.primaryColor]}>TODO LIST</Text>
              </View>
              <View style={AppStyles.paddingCenteredContainer}>
                <TouchableOpacity
                  style={[AppStyles.topBotSmallerMargin, AppStyles.fatPressableStyle]}
                  onPress={() => navigation.navigate('LoginScreen')}
                >
                  <Text style={[AppStyles.fatPressableTextStyle]}>Connection</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[AppStyles.topBotSmallerMargin, AppStyles.fatPressableStyle]}
                  onPress={() => navigation.navigate('RegistrationScreen')}
                >
                  <Text style={[AppStyles.fatPressableTextStyle]}>Inscription</Text>
                </TouchableOpacity>
              </View>
            </View>
        }
      </View>
    </SafeAreaProvider>

  )
}

const styles = StyleSheet.create({
  logoDiv: {
    position: 'absolute',
    top: '5%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
})