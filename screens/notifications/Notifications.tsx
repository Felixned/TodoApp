import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MyHeader from '../../components/MyHeader'
import AppStyles from '../../styles/AppStyles'
import { StatusBar } from 'expo-status-bar'
import { getAdditionalUserInfo } from 'firebase/auth'
import { auth, firestore } from '../../firebase-config'
import { collection, DocumentData, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from 'firebase/firestore'

interface NotificationsProps {
    navigation: any
}

export default function Notifications({ navigation }: NotificationsProps) {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [receivedNotifs, setReceivedNotifs] = useState<DocumentData[]>([]);
    const [sentNotifs, setSentNotifs] = useState<DocumentData[]>([]);

    async function getAndSetReceivedNotifs() {
        if (auth.currentUser) {
            const localList: DocumentData[] = [];
            const queryReceivedNotifs = query(collection(firestore, "shareNotifications"), where("receivingUid", "==", auth.currentUser.uid));
            await getDocs(queryReceivedNotifs)
                .then((response) => {
                    response.forEach((doc) => {
                        if (!doc.data().viewedByReceiver) {
                            console.log(doc.data());
                            localList.push(doc.data());
                        }
                    });
                    console.log(localList);
                    setReceivedNotifs(localList);
                })
        }
    }

    async function getAndSetSentNotifs() {
        if (auth.currentUser) {
            const localList: DocumentData[] = [];
            const queryReceivedNotifs = query(collection(firestore, "shareNotifications"), where("sendingUid", "==", auth.currentUser.uid));
            await getDocs(queryReceivedNotifs)
                .then((response) => {
                    response.forEach((doc) => {
                        if (!doc.data().viewedByReceiver) {
                            localList.push(doc.data());
                        }
                    });
                    //console.log(localList);
                    setSentNotifs(localList);
                })
        }
    }

    async function setReceivedNotifViewed() {
        if (auth.currentUser) {
            const localList: DocumentData[] = [];
            const queryReceivedNotifs = query(collection(firestore, "shareNotifications"), where("receivingUid", "==", auth.currentUser.uid));
            await getDocs(queryReceivedNotifs)
                .then((response) => {
                    response.forEach(async (doc) => {
                        await updateDoc(doc.ref, {
                            viewedByReceiver: true
                        })
                    });
                })

        }
    }

    useEffect(() => {
        setReceivedNotifViewed()
            .then(() => {
                getAndSetReceivedNotifs()
                    .then(() => {
                        getAndSetSentNotifs()
                    })
            })
    }, [])

    return (
        <SafeAreaProvider style={AppStyles.safeAreaStyle}>
            <View style={AppStyles.fullScreenAppContainer}>
                <StatusBar style='light' backgroundColor='#000' />
                <MyHeader
                    navigation={navigation}
                    hasGoBackArrow={true}
                    title={'Notifications'}
                >
                </MyHeader>
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({})