import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AppStyles from '../../../styles/AppStyles'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import MyHeader from '../../../components/MyHeader'
import { auth, firestore } from '../../../firebase-config'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { doc, setDoc } from 'firebase/firestore'

interface RegistrationScreenProps {
  navigation: any,
}

export default function RegistrationScreen({ navigation }: RegistrationScreenProps) {

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [areBothPasswordsTheSame, setAreBothPasswordsTheSame] = useState<boolean>(true);
  const [areAllInputsCompleted, setAreAllInputsCompleted] = useState<boolean>(false);
  const [hasTriedToSignUpWithoutAllInput, setHasTriedToSignUpWithoutAllInput] = useState<boolean>(false);

  function handleSignUp() {
    if (checkIfAllInputsAreCompleted()) {
      if (areBothPasswordsTheSame) {
        createUserWithEmailAndPassword(auth, email, password)
          .then(userCredential => {
            const user = userCredential.user;
            setDoc(doc(firestore, "users", user.uid), {
              fullName: fullName,
              userUid: user.uid,
              ownListsOrderId: [],
            });
          })
          .catch((error) => alert(error.message))
      }
    }
  }

  function checkIfBothPasswordsMatch() {
    if (password === confirmPassword) {
      return true
    }
    return false
  }

  function checkIfAllInputsAreCompleted() {
    if (password.length === 0 || confirmPassword.length === 0 || email.length === 0 || fullName.length === 0) {
      return false;
    }
    return true;
  }

  useEffect(() => {
    setAreBothPasswordsTheSame(checkIfBothPasswordsMatch());
    setAreAllInputsCompleted(checkIfAllInputsAreCompleted());
    setHasTriedToSignUpWithoutAllInput(false);
  }, [email, fullName, password, confirmPassword]);

  return (
    <SafeAreaProvider style={AppStyles.safeAreaStyle}>
      <View style={AppStyles.fullScreenAppContainer}>
        <StatusBar style='light' backgroundColor='#000' />
        <MyHeader
          navigation={navigation}
          title='Inscription'
          hasGoBackArrow={true}
        />
        <KeyboardAwareScrollView enableOnAndroid={true} contentContainerStyle={{ flex: 1 }}>
          <View style={AppStyles.allScreenSpaceAvailableCenteredContainer}>
            <View style={AppStyles.paddingCenteredContainer}>
              <View style={AppStyles.inputWithTopLabelContainer}>
                <Text style={AppStyles.inputTopLabel}>Prénom et nom</Text>
                <TextInput
                  value={fullName}
                  onChangeText={text => setFullName(text)}
                  style={AppStyles.textInputStyle}
                />
              </View>
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
                  onChangeText={
                    text => {
                      setPassword(text);
                    }
                  }
                  style={AppStyles.textInputStyle}
                  secureTextEntry
                />
              </View>
              <View style={AppStyles.inputWithTopLabelContainer}>
                <Text style={AppStyles.inputTopLabel}>Confirmer le mot de passe</Text>
                <TextInput
                  value={confirmPassword}
                  onChangeText={
                    text => {
                      setConfirmPassword(text);
                    }
                  }
                  style={AppStyles.textInputStyle}
                  secureTextEntry
                />
                {!areBothPasswordsTheSame && <Text style={[AppStyles.dangerColor, AppStyles.centeredText]}>Les mots de passe ne sont pas les mêmes</Text>}
              </View>
              <View style={[AppStyles.ClassicContainer, AppStyles.topBigSpace]}>
                <TouchableOpacity
                  style={AppStyles.fatPressableStyle}
                  onPress={() => {
                    setHasTriedToSignUpWithoutAllInput(!areAllInputsCompleted);
                    handleSignUp();
                  }}
                  activeOpacity={!areAllInputsCompleted ? 1 : 0}
                  disabled={!areAllInputsCompleted}
                >
                  <Text style={[AppStyles.fatPressableTextStyle]}>Inscription</Text>
                </TouchableOpacity>
                {hasTriedToSignUpWithoutAllInput && <Text style={[AppStyles.dangerColor, AppStyles.centeredText]}>Veuillez remplir tous les champs</Text>}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View >
    </SafeAreaProvider >
  )
}

const styles = StyleSheet.create({})