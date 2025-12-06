// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"
);
// eslint-disable-next-line no-undef
importScripts(
  "https://www.gstatic.com/firebasejs/9.6.10/firebase-messaging-compat.js"
);

// eslint-disable-next-line no-undef
firebase.initializeApp({
  apiKey: "AIzaSyA4qnpf04zpw3Pc3eE2WI1MYx4DL-U3og4",
  authDomain: "pushnotification-e1f4d.firebaseapp.com",
  projectId: "pushnotification-e1f4d",
  storageBucket: "pushnotification-e1f4d.firebasestorage.app",
  messagingSenderId: "112422107800",
  appId: "1:112422107800:web:1b4792d9858a1f3dbdaeed",
});

// eslint-disable-next-line no-undef
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: "/logo.png",
  });
});
