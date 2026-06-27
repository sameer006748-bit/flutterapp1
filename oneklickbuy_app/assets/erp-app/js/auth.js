import { auth, onAuthStateChanged, signOut } from './firebase.js';

export function requireAuth(onAuthenticated) {
  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = './index.html';
      return;
    }
    onAuthenticated(user);
  });
}

export async function logoutSession() {
  await signOut(auth);
  window.location.href = './index.html';
}
