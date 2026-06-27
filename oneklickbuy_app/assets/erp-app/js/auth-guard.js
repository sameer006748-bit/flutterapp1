import { auth, onAuthStateChanged } from './firebase.js';

export function protectPage(redirectTo = './index.html') {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        window.location.href = redirectTo;
        resolve(false);
        return;
      }
      resolve(true);
    });
  });
}
