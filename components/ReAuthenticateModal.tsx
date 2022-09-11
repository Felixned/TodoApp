import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import MyModal from './MyModal'
import AppStyles from '../styles/AppStyles';
import { EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { auth } from '../firebase-config';

interface ReAuthenticateModalProps {
    isModalVisible: boolean;
    setIsModalVisible: (arg: boolean) => void;
    thenFunction: any;
    children?: any;
    textConfirm?: boolean;
}

export default function ReAuthenticateModal({ isModalVisible, setIsModalVisible, thenFunction, textConfirm, children }: ReAuthenticateModalProps) {

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    function reAuthenticate() {
        if (auth.currentUser) {
            const credential = EmailAuthProvider.credential(email, password)
            reauthenticateWithCredential(auth.currentUser, credential)
                .then(thenFunction)
                .catch(error => alert(error))
        }
    }


    return (
        <MyModal title='Identifiants de connection' isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible}>
            {children}
            {textConfirm && <Text style={[AppStyles.centeredText, AppStyles.white, , AppStyles.smallerText, AppStyles.topBotMediumMargin]}>Veuillez confirmer avec vos indentifiants de connection :</Text>}
            <View style={AppStyles.inputWithTopLabelContainer}>
                <Text style={AppStyles.inputTopLabelSmall}>Adresse e-mail</Text>
                <TextInput
                    value={email}
                    onChangeText={text => setEmail(text)}
                    style={AppStyles.textInputStyleSmall}
                />
            </View>
            <View style={AppStyles.inputWithTopLabelContainer}>
                <Text style={AppStyles.inputTopLabelSmall}>Mot de passe</Text>
                <TextInput
                    value={password}
                    onChangeText={text => setPassword(text)}
                    style={AppStyles.textInputStyleSmall}
                    secureTextEntry
                />
            </View>
            <View style={AppStyles.flexRowContainer}>
                <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundPrimary]} onPress={reAuthenticate}>
                    <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Confirmer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundTertiary]} onPress={() => setIsModalVisible(false)}>
                    <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Annuler</Text>
                </TouchableOpacity>
            </View>
        </MyModal >
    )
}

const styles = StyleSheet.create({})