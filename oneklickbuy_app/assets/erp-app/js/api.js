import { db, collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from './firebase.js';

export async function fetchCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
}

export async function createDocument(name, payload) {
  return addDoc(collection(db, name), payload);
}

export async function updateDocument(name, id, payload) {
  await updateDoc(doc(db, name, id), payload);
}

export async function deleteDocument(name, id) {
  await deleteDoc(doc(db, name, id));
}
