import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AppStyles, { primaryColor } from '../../../styles/AppStyles'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import MyHeader from '../../../components/MyHeader'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase-config'
import { resetNavigation } from '../../../utils/ResetNavigation'

interface LoginScreenProps {
  navigation: any,
}

export default function LoginScreen({ navigation }: LoginScreenProps) {

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function handleSignIn() {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        resetNavigation('Home', navigation);
      })
      .catch((error) => alert(error.message))
  }

  return (
    <SafeAreaProvider style={AppStyles.safeAreaStyle}>
      <View style={AppStyles.fullScreenAppContainer}>
        <StatusBar style='light' backgroundColor='#000' />
        <MyHeader
          navigation={navigation}
          title='Connection'
          hasGoBackArrow={true}
        />
        <View style={AppStyles.allScreenSpaceAvailableCenteredContainer}>
          <View style={AppStyles.paddingCenteredContainer}>
            <View style={AppStyles.inputWithTopLabelContainer}>
              <Text style={AppStyles.inputTopLabel}>Adresse e-mail</Text>
              <TextInput
                value={email}
                onChangeText={text => setEmail(text)}
                style={AppStyles.textInputStyle}
              />
            </View>
            <View style={AppStyles.inputWithTopLabelContainer}>
              <Text style={AppStyles.inputTopLabel}>Mot de passe</Text>
              <TextInput
                value={password}
                onChangeText={text => setPassword(text)}
                style={AppStyles.textInputStyle}
                secureTextEntry
              />
            </View>
            <View style={AppStyles.flexRowContainer}>
              <Text style={AppStyles.white}>Mot de passe oublié ? </Text>
              <Pressable
                onPress={() => navigation.navigate('ResetPasswordScreen')}
              >
                <Text style={AppStyles.linkColor}>Réinitialiser votre mot de passe.</Text>
              </Pressable>
            </View>
            <TouchableOpacity
              style={[AppStyles.topBigSpace, AppStyles.fatPressableStyle]}
              onPress={handleSignIn}
            >
              <Text style={[AppStyles.fatPressableTextStyle]}>Connection</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({})