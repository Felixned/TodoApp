import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import AppStyles from '../../../styles/AppStyles'
import MyHeader from '../../../components/MyHeader'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '../../../firebase-config'

interface LoginScreenProps {
    navigation: any,
}

export default function ResetPasswordScreen({ navigation }: LoginScreenProps) {

    const [email, setEmail] = useState<string>('');

    function forgotPassword() {
        return sendPasswordResetEmail(auth, email)
            .then(navigation.navigate('LoginScreen'))
            .catch(error => alert(error))
    }

    return (
        <SafeAreaProvider style={AppStyles.safeAreaStyle}>
            <View style={AppStyles.fullScreenAppContainer}>
                <StatusBar style='light' backgroundColor='#000' />
                <MyHeader
                    navigation={navigation}
                    title='Réinitialisation de mot de passe'
                    hasGoBackArrow={true}
                />
                <View style={AppStyles.allScreenSpaceAvailableCenteredContainer}>
                    <View style={AppStyles.paddingCenteredContainer}>
                        <View style={AppStyles.inputWithTopLabelContainer}>
                            <Text style={AppStyles.inputTopLabel}>Adresse e-mail</Text>
                            <TextInput
                                value={email}
                                onChangeText={(text) => setEmail(text)}
                                style={AppStyles.textInputStyle}
                            />
                        </View>
                        <TouchableOpacity
                            style={[AppStyles.topBigSpace, AppStyles.mediumPressableStyle, AppStyles.backgroundPrimary]}
                            onPress={forgotPassword}
                        >
                            <Text style={[AppStyles.mediumPressableTextStyle, AppStyles.mediumText]}>Recevoir un mail de réinitialisation</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({})