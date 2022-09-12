import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MyHeader from '../../components/MyHeader'
import AppStyles, { primaryColor } from '../../styles/AppStyles'
import { StatusBar } from 'expo-status-bar'
import { auth, firestore } from '../../firebase-config'
import { collection, DocumentData, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from 'firebase/firestore'
import Loader from '../../components/Loader'
import Circle from '../../assets/icons/circle.svg';

interface NotificationsProps {
    navigation: any
}

interface LocaleReceivedNotification {
    type: "received"
}

interface LocaleSentNotification {
    type: "sent"
}

interface LocaleSentNotificationAfterResponse {
    type: "sentResponse"
}

interface SortedByDateNotifications {
    date: string,
    notificationsOnThisDay: (LocaleSentNotificationAfterResponse | LocaleSentNotification | LocaleReceivedNotification)[]
}

export default function Notifications({ navigation }: NotificationsProps) {

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [receivedNotifs, setReceivedNotifs] = useState<LocaleReceivedNotification[]>([]);
    const [sentNotifs, setSentNotifs] = useState<LocaleSentNotification[]>([]);
    const [sentNotifsAfterResponse, setSentNotifsAfterResponse] = useState<LocaleSentNotificationAfterResponse[]>([]);

    const [allSortedbyDateNotifications, setAllSortedByDateNotifications] = useState<SortedByDateNotifications[]>([]);

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

    function sortAllNotifs() {

    }

    useEffect(() => {
        setReceivedNotifViewed()
            .then(() => {
                getAndSetReceivedNotifs()
                    .then(() => {
                        getAndSetSentNotifs()
                            .then(() => {
                                sortAllNotifs();
                            })
                    })
            })
    }, [])
    function displayOneNotification() {
        return (
            <View></View>
        )
    }

    function displayNotifications() {
        return (
            allSortedbyDateNotifications.map((sortedByDateNotifications: SortedByDateNotifications, key) => {
                return (
                    <View key={key}>
                        <View>
                            <View>Ligne</View>
                            <Text>{sortedByDateNotifications.date}</Text>
                            <View>Ligne</View>
                        </View>
                        <View>
                            {
                                sortedByDateNotifications.notificationsOnThisDay.map((notif, key) => {
                                    return (
                                        <View>
                                            {key > 0 && <View><Circle width={10} height={10} fill={primaryColor} /></View>}
                                            {displayOneNotification()}
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                )
            })
        )
    }

    return (
        <SafeAreaProvider style={AppStyles.safeAreaStyle}>
            <View style={AppStyles.fullScreenAppContainer}>
                <StatusBar style='light' backgroundColor='#000' />
                <MyHeader
                    navigation={navigation}
                    hasGoBackArrow={true}
                    title={'Notifications'}
                />
                {isLoading
                    ? <View style={AppStyles.allScreenSpaceAvailableContainer}><Loader size={'medium'}></Loader></View>
                    : allSortedbyDateNotifications.length == 0
                        ?
                        <View style={AppStyles.allScreenSpaceAvailableCenteredContainer}>
                            <Text style={[AppStyles.white, AppStyles.smallText, AppStyles.centeredText]}>Vous n'avez aucune notification</Text>
                        </View>
                        :
                        <ScrollView style={AppStyles.allScreenSpaceAvailableContainer}>
                            <View style={[AppStyles.smallPaddingCenteredContainer, AppStyles.topMediumSpace]}>
                                {displayNotifications()}
                            </View>
                        </ScrollView>
                }
            </View>
        </SafeAreaProvider>
    )
}

const styles = StyleSheet.create({})