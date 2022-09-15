import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MyHeader from '../../components/MyHeader'
import AppStyles, { mediumFontSize, primaryColor, smallerSpacing, textFont } from '../../styles/AppStyles'
import { StatusBar } from 'expo-status-bar'
import { auth, firestore } from '../../firebase-config'
import { collection, doc, DocumentData, getDoc, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from 'firebase/firestore'
import Loader from '../../components/Loader'
import Circle from '../../assets/icons/circle.svg';
import moment from 'moment'
import { displayDateName } from '../../utils/DisplayDateName'
import OneNotification from './OneNotification'
import { parseDateStringInMoment } from '../../utils/parseDateStringInMoment'

interface NotificationsProps {
    navigation: any
}

export interface LocaleReceivedNotification {
    type: "received";
    date: string;
    isPending: boolean;
    isAccepted: boolean;
    sendingUid: string;
    listUid: string;
    uidNotif: string;
}

export interface LocaleSentNotification {
    type: "sent";
    date: string;
    listUid: string;
    receivingUid: string;
    uidNotif: string;
}

export interface LocaleSentNotificationAfterResponse {
    type: "sentResponse";
    isAccepted: boolean;
    listUid: string;
    receivingUid: string;
    date: string;
    uidNotif: string;
}

interface SortedByDateNotifications {
    date: string,
    notificationsOnThisDay: (LocaleSentNotificationAfterResponse | LocaleSentNotification | LocaleReceivedNotification)[]
}

export default function Notifications({ navigation }: NotificationsProps) {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isGetAllNotifsFinish, setIsGetAllNotifsFinish] = useState<boolean>(false);

    const [receivedNotifs, setReceivedNotifs] = useState<LocaleReceivedNotification[]>([]);
    const [sentNotifs, setSentNotifs] = useState<LocaleSentNotification[]>([]);
    const [sentNotifsAfterResponse, setSentNotifsAfterResponse] = useState<LocaleSentNotificationAfterResponse[]>([]);

    const [allSortedbyDateNotifications, setAllSortedByDateNotifications] = useState<SortedByDateNotifications[]>([]);

    async function getAndSetReceivedNotifs() {
        if (auth.currentUser) {
            const localList: LocaleReceivedNotification[] = [];
            const queryReceivedNotifs = query(collection(firestore, "shareNotifications"), where("receivingUid", "==", auth.currentUser.uid));
            //console.log(auth.currentUser.uid);
            await getDocs(queryReceivedNotifs)
                .then((response) => {
                    response.forEach((doc) => {
                        //console.log('received notif : ', doc.data());
                        localList.push({
                            type: "received",
                            date: doc.data().sendingDate,
                            isPending: doc.data().isPending,
                            isAccepted: doc.data().isAccepted,
                            sendingUid: doc.data().sendingUid,
                            listUid: doc.data().listUid,
                            uidNotif: doc.id,
                        });
                    });
                    //console.log('localList : ', localList);
                    setReceivedNotifs(localList);
                })
        }
    }

    async function getAndSetSentNotifs() {
        if (auth.currentUser) {
            const sentNotif: LocaleSentNotification[] = [];
            const sentNotifAfterResponse: LocaleSentNotificationAfterResponse[] = [];
            const queryReceivedNotifs = query(collection(firestore, "shareNotifications"), where("sendingUid", "==", auth.currentUser.uid));
            await getDocs(queryReceivedNotifs)
                .then((docs) => {
                    docs.forEach((doc) => {
                        sentNotif.push({
                            type: 'sent',
                            date: doc.data().sendingDate,
                            listUid: doc.data().listUid,
                            receivingUid: doc.data().receivingUid,
                            uidNotif: doc.id
                        });
                        if (!doc.data().isPending) {
                            sentNotifAfterResponse.push({
                                type: "sentResponse",
                                isAccepted: doc.data().isAccepted,
                                listUid: doc.data().listUid,
                                receivingUid: doc.data().receivingUid,
                                date: doc.data().responseDate,
                                uidNotif: doc.id
                            });
                        }
                    });
                    //console.log(sentNotif);
                    //console.log(sentNotifAfterResponse);
                    setSentNotifs(sentNotif);
                    setSentNotifsAfterResponse(sentNotifAfterResponse);
                })
        }
    }

    async function setReceivedNotifViewed() {
        if (auth.currentUser) {
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
        const localAllNotifs: (LocaleSentNotificationAfterResponse | LocaleSentNotification | LocaleReceivedNotification)[] = []
        //console.log('receivedNotifs :', receivedNotifs);
        receivedNotifs.forEach((notif) => {
            localAllNotifs.push(notif)
        })

        //console.log('sentNotifs:', sentNotifs);
        sentNotifs.forEach((notif) => {
            localAllNotifs.push(notif)
        })
        //console.log('sentNotifsAfterResponse :', sentNotifsAfterResponse);
        sentNotifsAfterResponse.forEach((notif) => {
            localAllNotifs.push(notif)
        })

        localAllNotifs.sort(
            (objA, objB) => {
                return parseDateStringInMoment(objB.date).diff(parseDateStringInMoment(objA.date)); // sort with date DD MM YYYY HH mm ss to have notifs in good order
            }
        )

        //console.log(localAllNotifs); // avec ça il faut réussir à les trier par date 
        const localallSortedbyDateNotifications: SortedByDateNotifications[] = []
        localAllNotifs.forEach((notif: LocaleSentNotificationAfterResponse | LocaleSentNotification | LocaleReceivedNotification) => {
            const notifDate = parseDateStringInMoment(notif.date, 'DD-MM-YYYY').format('DD-MM-YYYY').toString(); //format DD MM YYY to sort it by day
            if (localallSortedbyDateNotifications.some((element) => { return element.date === notifDate })) {
                //console.log('date index found')
                const indexObjectWithSameDate = localallSortedbyDateNotifications.findIndex((element) => { return element.date === notifDate })
                localallSortedbyDateNotifications[indexObjectWithSameDate].notificationsOnThisDay.push(notif)
            } else {
                //console.log('date not found')
                localallSortedbyDateNotifications.push({
                    date: notifDate,
                    notificationsOnThisDay: [notif],
                })
            }
        })

        setAllSortedByDateNotifications(localallSortedbyDateNotifications);
        //console.log('sortAllNotifs done');
        //console.log(localallSortedbyDateNotifications);
    }

    async function getAllNotifs() {
        await setReceivedNotifViewed()
            .then(async () => {
                //console.log('setReceivedNotifViewed done')
                await getAndSetReceivedNotifs()
                    .then(async () => {
                        //console.log('getAndSetReceivedNotifs done')
                        await getAndSetSentNotifs()
                            .then(async () => {
                                //console.log('getAndSetSentNotifs done')
                                setIsGetAllNotifsFinish(true);
                            })
                    })
            })
    }

    useEffect(() => {
        getAllNotifs()
    }, [])

    useEffect(() => {
        sortAllNotifs();
    }, [isGetAllNotifsFinish]);

    useEffect(() => { setIsLoading(false); }, [allSortedbyDateNotifications])

    function displayNotifications() {
        return (
            allSortedbyDateNotifications.map((sortedByDateNotifications: SortedByDateNotifications, key) => {
                return (
                    <View key={key}>
                        <View style={[AppStyles.flexRowContainer, AppStyles.paddingCenteredContainer, AppStyles.botSmallMaring]}>
                            <View style={styles.linesContainerStyle}><View style={styles.linesStyle}></View></View>
                            <Text style={styles.dateStyle}>{displayDateName(sortedByDateNotifications.date)}</Text>
                            <View style={styles.linesContainerStyle}><View style={styles.linesStyle}></View></View>
                        </View>
                        <View>
                            {
                                sortedByDateNotifications.notificationsOnThisDay.map((notif, key) => {
                                    return (
                                        <View key={key}>
                                            {key > 0 && <View style={styles.dotStyleContainer}><Circle width={10} height={10} fill={primaryColor} /></View>}
                                            <OneNotification notif={notif} />
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

const styles = StyleSheet.create({
    dateStyle: {
        flex: 1,
        flexGrow: 1.5,
        flexShrink: 1,
        textAlign: 'center',
        color: primaryColor,
        fontFamily: textFont,
        fontSize: mediumFontSize,
    },
    linesContainerStyle: {
        flex: 1,
        alignItems: 'center',
        alignContent: 'center',
        position: "relative"
    },
    linesStyle: {
        position: "absolute",
        borderWidth: 1,
        borderColor: primaryColor,
        width: '100%',
    },
    notifContainer: {
        marginBottom: smallerSpacing,
    },
    dotStyleContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: smallerSpacing,
    }
})