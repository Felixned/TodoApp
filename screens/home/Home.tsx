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
import { auth, firestore } from '../../firebase-config'
import { addDoc, arrayUnion, collection, doc, DocumentData, getDoc, getDocs, query, QueryDocumentSnapshot, setDoc, updateDoc, where } from 'firebase/firestore'
import Loader from '../../components/Loader'

interface HomeProps {
  navigation: any,
}

export default function Home({ navigation }: HomeProps) {

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [lists, setLists] = useState<QueryDocumentSnapshot<DocumentData>[]>([]);
  const [listsOrder, setListsOrder] = useState<[]>([]);

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
      const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid))
      if (userDoc.exists()) {
        setListsOrder(userDoc.data().ownListsOrderId);
      }
      else {
        alert('impossible de récupérer l\'utilisateur');
      }
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

  }

  const displayOwnedLists = () => {
    return (
      lists.map((list, key) => {
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsLoading(true);
      getUserOrderList()
        .then(() => {
          getAllOwnedLists()
            .then(() => {
              sortListsAndCompleteOrderList()
                .then(() => setIsLoading(false))
            })
        })
        .catch((error) => alert(error))
    });
    return unsubscribe;
  }, [navigation]); // runs on every focus on this screen

  useEffect(() => {

  }, [listsOrder])

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
            style={AppStyles.smallSpacingLeftAndRight}
            onPress={() => navigation.navigate('Notifications')}
          >
            <Message width={30} height={30} fill={primaryColor} />
          </Pressable>
        </MyHeader>
        {isLoading
          ? <View style={AppStyles.allScreenSpaceAvailableContainer}><Loader size={'medium'}></Loader></View>
          : lists.length == 0
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