import { collection, deleteDoc, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../firebase-config";

export async function deleteListsOwnedByNobody() {
    const queryAllSentNotifs = query(collection(firestore, "lists"), where("ownersUid", "==", []));
    await getDocs(queryAllSentNotifs)
        .then((docs) => {
            docs.forEach((doc) => {
                const docRef = doc.ref;
                deleteDoc(docRef);
            });
        });
}