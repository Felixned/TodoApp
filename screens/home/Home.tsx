import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import MyHeader from '../../components/MyHeader'
import { StatusBar } from 'expo-status-bar'
import AppStyles, { dangerColor, largeRadius, mainDarkBackgroundColor, mediumFontSize, mediumRadius, mediumSpacing, primaryColor, smallerSpacing, textFont, white } from '../../styles/AppStyles'
import User from '../../assets/icons/user.svg';
import Users from '../../assets/icons/users.svg';
import Message from '../../assets/icons/message.svg';
import Plus from '../../assets/icons/plus.svg';
import GripLines from '../../assets/icons/grip-lines.svg';
import Exclamation from '../../assets/icons/circle-exclamation.svg';
import { auth, firestore } from '../../firebase-config'
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, query, QueryDocumentSnapshot, updateDoc, where } from 'firebase/firestore'
import Loader from '../../components/Loader'

interface HomeProps {
  navigation: any,
}

export default function Home({ navigation }: HomeProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [areThereNewNotifs, setAreThereNewNotifs] = useState<boolean>(false);

  const [listsOrder, setListsOrder] = useState<string[]>([]);
  const [lists, setLists] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [OrderedLists, setOrderedLists] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);

  function createNewList() {
    if (auth.currentUser) {
      const userUid = auth.currentUser.uid;
      addDoc(collection(firestore, "lists"), {
        dataList: [],
        ownersUid: [userUid],
        listName: '',
      })
        .then(async (listDocRef) => {
          const currentUserDoc = doc(firestore, "users", userUid);
          await updateDoc(currentUserDoc, {
            ownListsOrderId: arrayUnion(listDocRef.id)
          })
            .then(() => {
              navigation.navigate('TodoList', { listId: listDocRef.id })
            })
        })
        .catch((error) => alert(error))
    }
  }

  function navigateToTodoList(listId: string) {
    navigation.navigate('TodoList', { listId: listId })
  }

  async function getUserOrderList() {
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      const docUser = await getDoc(userDocRef);
      setListsOrder(docUser.data()?.ownListsOrderId);
    }
    else {
      alert('impossible de récupérer l\'utilisateur');
      return (() => { })
    }
  }

  async function getReceivedNotifAndReturnIfSomeAreNew() {
    let hasNewNotifs = false;
    if (auth.currentUser) {
      //console.log('gettingNotifs of user', auth.currentUser.uid);
      const queryReceivedNotifs = query(collection(firestore, "shareNotifications"), where("receivingUid", "==", auth.currentUser.uid));
      getDocs(queryReceivedNotifs)
        .then((docs) => {
          docs.forEach((doc) => {
            //console.log('is this notif viewed ? ', doc.data().viewedByReceiver);
            if (!doc.data().viewedByReceiver) {
              //console.log('nouvelle notif');
              hasNewNotifs = true;
            }
          });
          return setAreThereNewNotifs(hasNewNotifs);
        })
    }
  }

  async function getAllOwnedLists() {
    if (auth.currentUser) {
      const listArray: QueryDocumentSnapshot<DocumentData>[] = [];
      const queryUserLists = query(collection(firestore, "lists"), where("ownersUid", "array-contains", auth.currentUser.uid));
      const querySnapshot = await getDocs(queryUserLists);
      querySnapshot.forEach((doc) => {
        //console.log(doc.id, " => ", doc.data());
        listArray.push(doc)
      });
      //console.log(listArray);
      setLists(listArray);
    }
  }

  async function sortListsAndCompleteOrderList() {
    const localLists: QueryDocumentSnapshot<DocumentData>[] = [];
    const uidToAddToListsOrder: string[] = [];

    console.log('list order :', listsOrder);

    //on met en premier les lists qui sont dans l'orderlist
    listsOrder.forEach((uid: string) => {
      const found = lists.find((list: QueryDocumentSnapshot<DocumentData>) => {
        //console.log('compare :', list.id, " and ", uid);
        return uid == (list.id);
      })
      //console.log(found);
      if (found) {
        //console.log('trouvé dans orderList : ', found.id);
        localLists.push(found);
      }
    })

    //on ajoute les autres
    lists.forEach((list: QueryDocumentSnapshot<DocumentData>) => {
      const found = localLists.find((localList: QueryDocumentSnapshot<DocumentData>) => {
        //console.log('compare :', list.id, " and ", localList.id);
        return (localList.id) == (list.id);
      })
      if (found) {
        //console.log('liste a ajouter :', list.id);

      } else {
        localLists.push(list);
        uidToAddToListsOrder.push(list.id);
      }
    })

    const localListsOrder: string[] = listsOrder;
    uidToAddToListsOrder.forEach((uidToAdd) => {
      //console.log('uid to add', uidToAdd);
      localListsOrder.push(uidToAdd);
    })
    //console.log('uids to add', localListsOrder);

    setOrderedLists(localLists);
    setListsOrder(localListsOrder);
    setIsLoading(false);

  }

  const displayOwnedLists = () => {
    return (
      OrderedLists.map((list, key) => {
        return (
          <Pressable
            key={key}
            style={styles.listContainerStyle}
            onPress={() => navigateToTodoList(list.id)}
          >
            <GripLines style={styles.gripeLinesStyle} width={30} height={30} fill={primaryColor} />
            <Text numberOfLines={1} style={styles.listTitleStyle}>{list.data().listName}</Text>
            {list.data().ownersUid?.length > 1 && <Users style={styles.usersLogoStyle} width={35} height={35} fill={primaryColor} />}
          </Pressable>
        )
      })
    )
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      setIsLoading(true);
      getReceivedNotifAndReturnIfSomeAreNew();
      await getUserOrderList()
        .then(async () => {
          await getAllOwnedLists()
        })
        .catch((error) => alert(error))
    });
    return unsubscribe;
  }, [navigation]); // runs on every focus on this screen


  async function updateUserOwnListsOrderId() {
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      //console.log('update lists order');
      await updateDoc(userDocRef, {
        ownListsOrderId: listsOrder
      });
    }
  }

  useEffect(() => {
    sortListsAndCompleteOrderList();
  }, [lists])

  useEffect(() => {
    updateUserOwnListsOrderId();
  }, [OrderedLists])

  return (
    <SafeAreaProvider style={AppStyles.safeAreaStyle}>
      <View style={AppStyles.fullScreenAppContainer}>
        <StatusBar style='light' backgroundColor='#000' />
        <MyHeader
          navigation={navigation}
          hasGoBackArrow={false}
        >
          <Pressable
            style={AppStyles.smallSpacingLeftAndRight}
            onPress={() => navigation.navigate('Profile')}
          >
            <User width={30} height={35} fill={primaryColor} />
          </Pressable>
          <Pressable
            style={[AppStyles.smallSpacingLeftAndRight, AppStyles.relative]}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Message width={30} height={30} fill={primaryColor} />
            {areThereNewNotifs &&
              <Exclamation style={{ position: 'absolute', right: -10, bottom: -5 }} width={20} height={20} fill={dangerColor} />
            }
          </Pressable>
        </MyHeader>
        {isLoading
          ? <View style={AppStyles.allScreenSpaceAvailableContainer}><Loader size={'medium'}></Loader></View>
          : OrderedLists.length == 0
            ?
            <View style={AppStyles.allScreenSpaceAvailableCenteredContainer}>
              <Text style={[AppStyles.white, AppStyles.smallText, AppStyles.centeredText]}>Les listes que vous ajouterez seront visible dans cette section</Text>
            </View>
            :
            <ScrollView contentContainerStyle={[AppStyles.botHugeMaring]} style={AppStyles.allScreenSpaceAvailableContainer}>
              <View style={[AppStyles.smallPaddingCenteredContainer, AppStyles.topMediumSpace]}>
                {displayOwnedLists()}
              </View>
            </ScrollView>
        }
        <TouchableOpacity onPress={createNewList} style={styles.addListButtonStyle}><Plus height={40} width={40} fill={primaryColor} /></TouchableOpacity>
      </View>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  addListButtonStyle: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: '10%',
    bottom: '5%',
    height: 60,
    width: 60,
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 30,
    backgroundColor: mainDarkBackgroundColor,
  },
  listContainerStyle: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingVertical: smallerSpacing,
    borderWidth: 1,
    borderColor: primaryColor,
    marginBottom: mediumSpacing,
    borderRadius: largeRadius,
  },
  gripeLinesStyle: {
    justifyContent: 'flex-start',
    flex: 1
  },
  usersLogoStyle: {
    marginHorizontal: smallerSpacing,
    flex: 1
  },
  listTitleStyle: {
    color: white,
    fontFamily: textFont,
    fontSize: mediumFontSize,
    flex: 1,
  }
})