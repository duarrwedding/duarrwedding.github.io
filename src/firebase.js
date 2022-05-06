import firebase from 'firebase'
import { ref, onUnmounted } from 'vue'

const config = {
  apiKey: "AIzaSyD2nM5OFE7AUa6BucNbMscE2LboGe0C3Yk",
  authDomain: "wedding-rr-invitation.firebaseapp.com",
  projectId: "wedding-rr-invitation",
  storageBucket: "wedding-rr-invitation.appspot.com",
  messagingSenderId: "244705181450",
  appId: "1:244705181450:web:dadd58fe135022469f04f3",
  measurementId: "G-XZNKGSZXEV",
}

const firebaseApp = firebase.initializeApp(config)

const db = firebaseApp.firestore()
const usersCollection = db.collection('users')

export const createUser = user => {
  return usersCollection.add(user)
}

export const getUser = async id => {
  const user = await usersCollection.doc(id).get()
  return user.exists ? user.data() : null
}

export const updateUser = (id, user) => {
  return usersCollection.doc(id).update(user)
}

export const deleteUser = id => {
  return usersCollection.doc(id).delete()
}

export const useLoadUsers = () => {
  const users = ref([])
  const close = usersCollection.onSnapshot(snapshot => {
    users.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  })
  onUnmounted(close)
  return users
}
