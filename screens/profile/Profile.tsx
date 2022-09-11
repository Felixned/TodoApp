import { Modal, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import MyHeader from '../../components/MyHeader'
import Disconnect from '../../assets/icons/disconnect.svg';
import AppStyles, { primaryColor } from '../../styles/AppStyles'
import { auth, firestore } from '../../firebase-config'
import MyModal from '../../components/MyModal'
import ReAuthenticateModal from '../../components/ReAuthenticateModal'
import { resetNavigation } from '../../utils/ResetNavigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { updateCurrentUser, updateEmail, updatePassword } from 'firebase/auth'
import Loader from '../../components/Loader'

interface ProfileProps {
    navigation: any;
}

export default function Profile({ navigation }: ProfileProps) {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isSignOutModalVisible, setIsSignOutModalVisible] = useState<boolean>(false);
    const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] = useState<boolean>(false);
    const [isConfirmDeleteAccountModalVisible, setIsConfirmDeleteAccountModalVisible] = useState<boolean>(false);
    const [isConfirmModifyAccountModalVisible, setIsConfirmModifyAccountModalVisible] = useState<boolean>(false);

    const [fullName, setFullName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    const [hasEmailBeenModified, setHasEmailBeenModified] = useState<boolean>(false);
    const [hasFullNameBeenModified, setHasFullNameBeenModified] = useState<boolean>(false);

    function handleSignOut() {
        auth
            .signOut()
            .then(() => {
                resetNavigation('ReceptionScreen', navigation);
            })
            .catch(error => alert(error.message))
    }

    function handleDeleteAccount() {
        auth.currentUser?.delete()
            .then(() => {
                resetNavigation('ReceptionScreen', navigation);
            })
            .catch(() => setIsConfirmDeleteAccountModalVisible(true))
    }

    function handleConfirmDeleteAccountWithAuthentication() {
        auth.currentUser?.delete()
            .then(() => {
                resetNavigation('ReceptionScreen', navigation);
            })
            .catch(error => alert(error))
    }

    async function handleModifyProfileInfo() {
        if (auth.currentUser) {
            if (newPassword.length !== 0) {
                updatePassword(auth.currentUser, newPassword).then(() => {
                    console.log('password updated')
                }).catch((error) => {
                    alert(error)
                });
            }
            if (hasEmailBeenModified) {
                updateEmail(auth.currentUser, "user@example.com").then(() => {
                    console.log('email updated')
                }).catch((error) => {
                    alert(error)
                });
            }
            if (hasFullNameBeenModified) {
                const currentUserDoc = doc(firestore, "users", auth.currentUser.uid);
                await updateDoc(currentUserDoc, {
                    fullName: fullName
                });
            }
        }
    }

    async function getUserInfo() {
        if (auth.currentUser?.uid && auth.currentUser?.email) {
            setEmail(auth.currentUser?.email);
            try {
                const docRef = doc(firestore, "users", auth.currentUser?.uid);
                const userDoc = await getDoc(docRef);
                let dataObj = userDoc.data();
                setFullName(dataObj?.fullName);
            } catch (err) {
                alert(err)
            }
        }
    }

    useEffect(() => {
        getUserInfo()
            .finally(() => setIsLoading(false))
    }, []);

    return (
        <SafeAreaProvider style={AppStyles.safeAreaStyle}>
            <View style={AppStyles.fullScreenAppContainer}>
                <StatusBar style='light' backgroundColor='#000' />
                <MyHeader
                    navigation={navigation}
                    hasGoBackArrow={true}
                    title={'Profil'}
                >
                    <Pressable
                        style={AppStyles.smallSpacingLeftAndRight}
                        onPress={() => setIsSignOutModalVisible(true)}
                    >
                        <Disconnect width={35} height={35} fill={primaryColor} />
                    </Pressable>
                </MyHeader>
                {isLoading
                    ? <View style={AppStyles.allScreenSpaceAvailableContainer}><Loader size={'medium'}></Loader></View>
                    :
                    <View style={AppStyles.allScreenSpaceAvailableContainer}>
                        <View style={[AppStyles.paddingCenteredContainer, AppStyles.topMediumSpace]}>
                            <View style={AppStyles.inputWithTopLabelContainer}>
                                <Text style={AppStyles.inputTopLabelSmall}>Prénom et nom</Text>
                                <TextInput
                                    value={fullName}
                                    onChangeText={text => {
                                        setHasFullNameBeenModified(true);
                                        setFullName(text);
                                    }}
                                    style={AppStyles.textInputStyleSmall}
                                />
                            </View>
                            <View style={AppStyles.inputWithTopLabelContainer}>
                                <Text style={AppStyles.inputTopLabelSmall}>Adresse e-mail</Text>
                                <TextInput
                                    value={email}
                                    onChangeText={text => {
                                        setHasEmailBeenModified(true)
                                        setEmail(text)
                                    }}
                                    style={AppStyles.textInputStyleSmall}
                                />
                            </View>
                            <View style={AppStyles.inputWithTopLabelContainer}>
                                <Text style={AppStyles.inputTopLabelSmall}>Nouveau mot de passe</Text>
                                <TextInput
                                    value={newPassword}
                                    onChangeText={text => setNewPassword(text)}
                                    style={AppStyles.textInputStyleSmall}
                                    secureTextEntry
                                />
                            </View>
                            <TouchableOpacity
                                style={[AppStyles.topMediumSpace, AppStyles.mediumPressableStyle, AppStyles.backgroundPrimary]}
                                onPress={() => setIsConfirmModifyAccountModalVisible(true)}
                            >
                                <Text style={[AppStyles.mediumPressableTextStyle]}>Modifier le profil</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[AppStyles.topBigSpace, AppStyles.mediumPressableStyle, AppStyles.backgroundDanger]}
                                onPress={() => setIsDeleteAccountModalVisible(true)}
                            >
                                <Text style={[AppStyles.mediumPressableTextStyle]}>Supprimer mon compte</Text>
                            </TouchableOpacity>
                        </View>
                        <MyModal
                            isModalVisible={isSignOutModalVisible}
                            setIsModalVisible={setIsSignOutModalVisible}
                            title='Confirmer la déconnection'
                        >
                            <View>
                                <Text style={[AppStyles.modalCenteredText]}>Confirmer la déconnection{"\n"}s'il vous plaît</Text>
                                <View style={AppStyles.flexRowContainer}>
                                    <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundDanger]} onPress={handleSignOut}>
                                        <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Déconnection</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundTertiary]} onPress={() => setIsSignOutModalVisible(false)}>
                                        <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Annuler</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </MyModal>
                        <MyModal
                            isModalVisible={isDeleteAccountModalVisible}
                            setIsModalVisible={setIsDeleteAccountModalVisible}
                            title='Confirmer la suppression'
                        >
                            <View>
                                <Text style={[AppStyles.modalCenteredText]}>
                                    Veuillez confirmer la suppression de votre compte s'il vous plaît
                                </Text>
                                <View style={AppStyles.flexRowContainer}>
                                    <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundDanger]} onPress={handleDeleteAccount}>
                                        <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Confirmer</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundTertiary]} onPress={() => setIsDeleteAccountModalVisible(false)}>
                                        <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Annuler</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </MyModal>
                        <ReAuthenticateModal isModalVisible={isConfirmDeleteAccountModalVisible} setIsModalVisible={setIsConfirmDeleteAccountModalVisible} thenFunction={handleConfirmDeleteAccountWithAuthentication} textConfirm={true} />
                        <ReAuthenticateModal
                            isModalVisible={isConfirmModifyAccountModalVisible}
                            setIsModalVisible={setIsConfirmModifyAccountModalVisible}
                            thenFunction={() => {
                                handleModifyProfileInfo().finally(() => resetNavigation('Home', navigation));
                            }}
                            textConfirm={true} />
                    </View>
                }
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({})