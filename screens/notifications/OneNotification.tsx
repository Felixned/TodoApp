import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { LocaleReceivedNotification, LocaleSentNotification, LocaleSentNotificationAfterResponse } from './Notifications';
import { arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase-config';
import AppStyles, { dangerColor, largeRadius, mediumFontSize, primaryColor, smallerSpacing, smallFontSize, smallSpacing, tertiaryColor, textFont, white } from '../../styles/AppStyles';
import moment from 'moment';


interface NotificationProps {
    notif: LocaleSentNotificationAfterResponse | LocaleSentNotification | LocaleReceivedNotification;
}

export default function OneNotification({ notif }: NotificationProps) {

    const [notifLocal, setNotifLocal] = useState<LocaleSentNotificationAfterResponse | LocaleSentNotification | LocaleReceivedNotification>(notif);

    const [listName, setListName] = useState<string>('');
    const [senderName, setSenderName] = useState<string>('');
    const [receiverName, setReceiverName] = useState<string>('');

    useEffect(() => {
        const listDocRef = doc(firestore, 'lists', notifLocal.listUid);
        getDoc(listDocRef)
            .then((doc) => {
                //console.log('listName')
                setListName(doc.data()?.listName);
            })

        if (notifLocal.type == 'received') {
            const senderUserDocRef = doc(firestore, 'users', notifLocal.sendingUid);
            getDoc(senderUserDocRef)
                .then((doc) => {
                    //console.log('senderName')
                    setSenderName(doc.data()?.fullName);
                })
        }
        if (notifLocal.type == ('sent' || 'sentResponse')) {
            const senderUserDocRef = doc(firestore, 'users', notifLocal.receivingUid);
            getDoc(senderUserDocRef)
                .then((doc) => {
                    //console.log('senderName')
                    setReceiverName(doc.data()?.fullName);
                })
        }
    }, [])

    async function acceptShare() {
        if (auth.currentUser) {
            const currentUserUid = auth.currentUser.uid;
            const refDocList = doc(firestore, "lists", notifLocal.listUid);
            const refDocNotif = doc(firestore, "shareNotifications", notifLocal.uidNotif)
            const today = moment(new Date).format('DD-MM-YYYY').toString();

            await updateDoc(refDocNotif, {
                isAccepted: true,
                isPending: false,
                responseDate: today,
            })
                .then(async () => {
                    const userRef = doc(firestore, "users", currentUserUid);
                    await updateDoc(userRef, {
                        ownListsOrderId: arrayUnion(notifLocal.listUid)
                    })
                        .then(async () => {
                            await updateDoc(refDocList, {
                                ownersUid: arrayUnion(currentUserUid)
                            })
                        })

                })
                .catch((error) => alert(error))
                .finally(() => {
                    if (notifLocal.type === 'received') {
                        setNotifLocal({
                            type: "received",
                            date: notifLocal.date,
                            isAccepted: true,
                            isPending: false,
                            sendingUid: notifLocal.sendingUid,
                            listUid: notifLocal.listUid,
                            uidNotif: notifLocal.uidNotif,
                        })
                    }
                })
        }
    }

    function refuseShare() {
        const refDocNotif = doc(firestore, "shareNotifications", notifLocal.uidNotif)
        const today = moment(new Date).format('DD-MM-YYYY').toString();
        updateDoc(refDocNotif, {
            isAccepted: false,
            isPending: false,
            responseDate: today,
        })
            .finally(() => {
                if (notifLocal.type === 'received') {
                    setNotifLocal({
                        type: "received",
                        date: notifLocal.date,
                        isAccepted: false,
                        isPending: false,
                        sendingUid: notifLocal.sendingUid,
                        listUid: notifLocal.listUid,
                        uidNotif: notifLocal.uidNotif,
                    })
                }
            })
    }

    return (
        <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            {notifLocal.type == 'received' &&
                <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={[styles.notifContainer, AppStyles.smallText, AppStyles.white]}>Vous avez reçu une invitation de {senderName} pour la liste "{listName}"</Text>
                    {
                        notifLocal.isPending
                            ?
                            <View style={[styles.notifContainer, AppStyles.flexRowContainer]}>
                                <TouchableOpacity
                                    style={[styles.boutonPartage, AppStyles.backgroundPrimary]}
                                    onPress={acceptShare}
                                >
                                    <Text style={styles.textBoutonPartage}>Accepter</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.boutonPartage, AppStyles.backgroundDanger]}
                                    onPress={refuseShare}
                                >

                                    <Text style={styles.textBoutonPartage}>Supprimer</Text>
                                </TouchableOpacity>
                            </View>
                            :
                            <View style={styles.notifContainer}>
                                {notifLocal.isAccepted
                                    ? <Text style={[styles.notifContainer, AppStyles.smallText, AppStyles.primaryColor]}>Vous avez accepté l'invitation</Text>
                                    : <Text style={[styles.notifContainer, AppStyles.smallText, AppStyles.primaryColor]}>Vous avez refusé l'invitation</Text>}
                            </View>
                    }
                </View>
            }
            {
                notifLocal.type == 'sent' &&
                <Text style={[styles.notifContainer, AppStyles.smallText, AppStyles.white]}>Vous avez invité {receiverName} à rejoindre la liste "{listName}"</Text>
            }
            {
                notifLocal.type == 'sentResponse' &&
                <Text style={[styles.notifContainer, AppStyles.smallText, AppStyles.white]}>{receiverName} a {notifLocal.isAccepted ? 'Accepté' : 'Refusé'} votre invitation à la liste "{listName}"</Text>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    dateStyle: {
        flex: 1,
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
        textAlign: 'center',
    },
    dotStyleContainer: {
        width: '100%',
        display: 'flex',
        justifyContent: "center",
        alignItems: 'center',
        marginBottom: smallerSpacing,
    },
    boutonPartage: {
        flex: 1,
        marginHorizontal: smallSpacing,
        borderRadius: largeRadius,
        borderWidth: 1,
        borderColor: tertiaryColor,
    },
    textBoutonPartage: {
        fontFamily: textFont,
        fontSize: smallFontSize,
        color: white,
        textAlign: 'center',
        padding: smallerSpacing,
    }
})