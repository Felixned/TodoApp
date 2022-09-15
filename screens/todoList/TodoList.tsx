import { Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { StatusBar } from 'expo-status-bar'
import MyHeader from '../../components/MyHeader'
import AppStyles, { largeRadius, largerSpacing, mainDarkBackgroundColor, mediumFontSize, mediumSpacing, primaryColor, smallerSpacing, tertiaryColor, textFont, white } from '../../styles/AppStyles'
import Trash from '../../assets/icons/trash.svg';
import Plus from '../../assets/icons/plus.svg';
import GripLines from '../../assets/icons/grip-lines.svg';
import Cross from '../../assets/icons/xmark.svg';
import Users from '../../assets/icons/users.svg';
import Share from '../../assets/icons/share.svg';
import Square from '../../assets/icons/square.svg';
import CheckedSquare from '../../assets/icons/checked-square.svg';
import VerticalDots from '../../assets/icons/dots-vertical.svg';
import { addDoc, arrayRemove, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, onSnapshot, query, QueryDocumentSnapshot, updateDoc, where } from 'firebase/firestore'
import { auth, firestore } from '../../firebase-config'
import { resetNavigation } from '../../utils/ResetNavigation'
import MyModal from '../../components/MyModal'
import Loader from '../../components/Loader'
import { getAuth } from 'firebase/auth'
import moment from 'moment'
import { deleteListsOwnedByNobody } from '../../utils/EraseListsOwnedByNobody'

interface TodoListProps {
    navigation: any,
    route: any,
}

interface TodoProps {
    isChecked: boolean,
    value: string,
}

export default function TodoList({ route, navigation }: TodoListProps) {

    const listId = route.params.listId;

    const [title, setTitle] = useState<string>('');
    const [dataList, setDataList] = useState<TodoProps[]>([]);
    const [ownersUid, setOwnersUid] = useState<string[]>([]);

    const [ownersDoc, setOwnersDoc] = useState<QueryDocumentSnapshot<DocumentData>[]>();

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isUsersModalVisible, setIsUsersModalVisible] = useState<boolean>(false);
    const [isShareModalVisible, setIsShareModalVisible] = useState<boolean>(false);

    const [displayOnlyChecked, setDisplayOnlyChecked] = useState<boolean>(false);
    const [displayOnlyUnchecked, setDisplayOnlyUnchecked] = useState<boolean>(false);

    const [emailToShareWith, setEmailToShareWith] = useState<string>('');

    async function deleteCurrentTodoList() {
        if (auth.currentUser) {
            const authCurrentUid = auth.currentUser.uid;
            await deleteDoc(doc(firestore, "lists", listId))
                .then(async () => {
                    const userRef = doc(firestore, "users", authCurrentUid);
                    await updateDoc(userRef, {
                        ownListsOrderId: arrayRemove(listId)
                    })
                        .then(() => {
                            deleteListsOwnedByNobody();
                        })
                })
                .catch((error) => alert(error))
        } else {
            alert('no auth.currentUser')
        }
    }

    async function retrieveAndSetOwnersDocFromOwnersUid() {
        const listArray: QueryDocumentSnapshot<DocumentData>[] = [];
        if (ownersUid && ownersUid.length > 0) {
            const queryGetUsersDoc = query(collection(firestore, "users"), where("userUid", "in", ownersUid));
            const querySnapshot = await getDocs(queryGetUsersDoc);
            querySnapshot.forEach((doc) => {
                listArray.push(doc)
            });
            //console.log(listArray);
            setOwnersDoc(listArray);
        }
    }

    async function updateTitle(writtenTitle: string) {
        const listRef = doc(firestore, "lists", listId);
        await updateDoc(listRef, {
            listName: writtenTitle
        });
    }

    async function updateDataList(todo: TodoProps, key: number) {
        const listRef = doc(firestore, "lists", listId);
        const dataListLocal = [...dataList];
        dataListLocal[key] = todo;
        await updateDoc(listRef, {
            dataList: dataListLocal
        });
    }

    async function deleteKeyInDataList(key: number) {
        const listRef = doc(firestore, "lists", listId);
        const dataListLocal = [...dataList];
        dataListLocal.splice(key, 1);
        await updateDoc(listRef, {
            dataList: dataListLocal
        });
    }

    async function newTodoInDataList() {
        const listRef = doc(firestore, "lists", listId);
        const dataListLocal = [...dataList];
        dataListLocal.push({ isChecked: false, value: '' });
        await updateDoc(listRef, {
            dataList: dataListLocal
        });
    }

    function displayTodoListData() {
        if (dataList) {
            return dataList.map((todo: TodoProps, key) => {
                return (
                    <View key={key} style={styles.todoLineStyle}>
                        <Pressable><GripLines style={{ flex: 1 }} width={30} height={30} fill={primaryColor} /></Pressable>
                        {todo.isChecked
                            ?
                            <Pressable
                                onPress={() => updateDataList({ isChecked: false, value: todo.value }, key)}
                            >
                                <CheckedSquare style={{ flex: 1 }} width={30} height={30} fill={primaryColor} />
                            </Pressable>
                            :
                            <Pressable
                                onPress={() => updateDataList({ isChecked: true, value: todo.value }, key)}
                            >
                                <Square style={{ flex: 1 }} width={30} height={30} fill={primaryColor} />
                            </Pressable>
                        }
                        <TextInput
                            numberOfLines={1}
                            style={todo.isChecked ? styles.todoInputStyleChecked : styles.todoInputStyle}
                            onChangeText={(text) => {
                                updateDataList({ isChecked: todo.isChecked, value: text }, key)
                            }}
                        >
                            {todo.value}
                        </TextInput>
                        <Pressable
                            onPress={() => deleteKeyInDataList(key)}
                        >
                            <Cross style={{ flex: 1, marginLeft: 'auto', marginRight: 3 }} width={28} height={28} fill={tertiaryColor} />
                        </Pressable>
                    </View >
                )
            })
        }
    }

    function shareList() {
        if (auth.currentUser?.email?.toLowerCase() == emailToShareWith.toLowerCase()) {
            alert('Vous ne pouvez pas partager avec vous-même');
        }
        else {
            const queryFindUserToShareWith = query(collection(firestore, "users"), where("email", "==", emailToShareWith), limit(1));
            getDocs(queryFindUserToShareWith)
                .then((querySnapshot) => {
                    if (!querySnapshot.empty) {
                        querySnapshot.forEach(async (doc) => {
                            if (auth.currentUser) {
                                const userToShareWithUid = doc.data().userUid;
                                const currentUserUid = auth.currentUser.uid;
                                const today = moment(new Date).format('DD-MM-YYYY HH:mm:ss').toString();
                                await addDoc(collection(firestore, "shareNotifications"), {
                                    isAccepted: false,
                                    isPending: true,
                                    receivingUid: userToShareWithUid,
                                    sendingUid: currentUserUid,
                                    listUid: listId,
                                    sendingDate: today,
                                    responseDate: '',
                                    viewedByReceiver: false,
                                    responseViewedBySender: false,
                                })
                                    .catch((error: any) => {
                                        alert(error)
                                    })
                                    .finally(() => {
                                        setEmailToShareWith('');
                                        setIsShareModalVisible(false);
                                    })
                            }
                            else {
                                alert('Erreur avec auth currentUser');
                            }
                        });
                    } else {
                        alert('Impossible de trouver l\'utilisateur');
                    }
                })

        }
    }

    useEffect(() => {
        const docRef = doc(firestore, "lists", listId);
        const unsubscribe = onSnapshot(
            docRef,
            { includeMetadataChanges: false },
            (doc) => {
                //const source = doc.metadata.hasPendingWrites ? "Local" : "Server";
                //console.log(source, " data: ", doc.data());
                setTitle(doc.data()?.listName);
                setDataList(doc.data()?.dataList);
                setOwnersUid(doc.data()?.ownersUid);
                setIsLoading(false);
            },
            (error) => { alert(error) });

        return () => {
            //console.log('unsubscribe');
            unsubscribe();
        }
    }, [])

    useEffect(() => {
        //console.log(ownersUid);
        retrieveAndSetOwnersDocFromOwnersUid();
    }, [ownersUid]);

    return (
        <SafeAreaProvider style={AppStyles.safeAreaStyle}>
            <View style={AppStyles.fullScreenAppContainer}>
                <StatusBar style='light' backgroundColor='#000' />
                <MyHeader
                    navigation={navigation}
                    hasGoBackArrow={true}
                >
                    <Pressable
                        style={AppStyles.smallSpacingLeftAndRight}
                        onPress={() => deleteCurrentTodoList().finally(() => resetNavigation('Home', navigation))}
                    >
                        <Trash width={30} height={30} fill={primaryColor} />
                    </Pressable>
                    <Pressable
                        style={AppStyles.smallSpacingLeftAndRight}
                        onPress={() => setIsShareModalVisible(true)}
                    >
                        <Share width={35} height={35} fill={primaryColor} />
                    </Pressable>
                    <Pressable
                        style={AppStyles.smallSpacingLeftAndRight}
                        onPress={() => setIsUsersModalVisible(true)}
                    >
                        <Users width={35} height={35} fill={primaryColor} />
                    </Pressable>
                </MyHeader>
                {isLoading
                    ? <View style={AppStyles.allScreenSpaceAvailableContainer}><Loader size={'medium'}></Loader></View>
                    :
                    <ScrollView style={AppStyles.allScreenSpaceAvailableContainer}>
                        <View style={[AppStyles.smallPaddingCenteredContainer]}>
                            <View style={[AppStyles.flexRowContainer, AppStyles.topMediumSpace]}>
                                <TextInput
                                    value={title}
                                    numberOfLines={1}
                                    onChangeText={text => {
                                        setTitle(text);
                                        updateTitle(text);
                                    }}
                                    style={[AppStyles.textInputStyleSmall, AppStyles.mediumText, styles.titleInputStyle]}
                                />
                                <Pressable><VerticalDots width={35} height={35} fill={white} /></Pressable>
                            </View>
                            <View style={styles.todoContainerStyle}>
                                {displayTodoListData()}
                            </View>
                            <View style={styles.addNewTodoStyle}>
                                <Pressable
                                    style={styles.todoLineStyle}
                                    onPress={() => newTodoInDataList()}
                                >
                                    <Pressable><GripLines style={{ flex: 1 }} width={30} height={30} /></Pressable>
                                    <Plus style={{ flex: 1 }} width={30} height={30} fill={primaryColor} />
                                    <Text style={[styles.todoInputStyle, AppStyles.primaryColor]}>Ajouter un élément</Text>
                                </Pressable >
                            </View>
                        </View>
                    </ScrollView>
                }
                <MyModal
                    isModalVisible={isUsersModalVisible}
                    setIsModalVisible={setIsUsersModalVisible}
                    title='Utilisateurs'
                >
                    <View>
                        <View style={styles.usersModalStyle}>
                            {ownersDoc?.map((doc, key) => {
                                return <Text key={key} style={[AppStyles.smallText, AppStyles.white]}>-  {doc.data().fullName}</Text>
                            })
                            }
                        </View>
                        <View style={AppStyles.flexRowContainer}>
                            <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundTertiary]} onPress={() => setIsUsersModalVisible(false)}>
                                <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Revenir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </MyModal>
                <MyModal
                    isModalVisible={isShareModalVisible}
                    setIsModalVisible={setIsShareModalVisible}
                    title='Partager la liste'
                >
                    <View style={AppStyles.ClassicContainer}>
                        <Text style={[AppStyles.shareModalCenteredText]}>
                            Veuillez rentrer l'adresse e-mail de l'utilisateur
                            avec lequel partager la liste
                        </Text>
                        <TextInput
                            value={emailToShareWith}
                            onChangeText={text => {
                                setEmailToShareWith(text)
                            }}
                            placeholder='adresse e-mail'
                            placeholderTextColor={tertiaryColor}
                            style={AppStyles.textInputStyleSmall}
                        />
                        <View style={[AppStyles.flexRowContainer, AppStyles.topMediumSpace]}>
                            <TouchableOpacity style={[AppStyles.ModalButton, AppStyles.backgroundTertiary]} onPress={() => shareList()}>
                                <Text style={[AppStyles.smallerText, AppStyles.white, AppStyles.centeredText]}>Partager</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </MyModal>
            </View>
        </SafeAreaProvider >
    )
}

const styles = StyleSheet.create({
    titleInputStyle: {
        backgroundColor: mainDarkBackgroundColor,
        flex: 1,
        borderWidth: 0,
        borderBottomWidth: 1,
    },
    todoInputStyle: {
        fontFamily: textFont,
        fontSize: mediumFontSize,
        color: white,
        flex: 1,
        flexGrow: 2,
        marginLeft: smallerSpacing
    },
    todoInputStyleChecked: {
        fontFamily: textFont,
        fontSize: mediumFontSize,
        color: tertiaryColor,
        flex: 1,
        flexGrow: 2,
        marginLeft: smallerSpacing,
        textDecorationLine: 'line-through',
    },
    usersModalStyle: {
        marginVertical: mediumSpacing,
        marginHorizontal: mediumSpacing
    },
    listContainerStyle: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        flexWrap: 'wrap',
        paddingVertical: smallerSpacing,
        marginBottom: mediumSpacing,
    },
    todoContainerStyle: {
        display: 'flex',
        width: '100%',
        marginTop: mediumSpacing,
    },
    todoLineStyle: {
        marginBottom: smallerSpacing,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
    },
    addNewTodoStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '100%',
    }
})