// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyA4qnpf04zpw3Pc3eE2WI1MYx4DL-U3og4",
  authDomain: "pushnotification-e1f4d.firebaseapp.com",
  projectId: "pushnotification-e1f4d",
  storageBucket: "pushnotification-e1f4d.firebasestorage.app",
  messagingSenderId: "112422107800",
  appId: "1:112422107800:web:1b4792d9858a1f3dbdaeed",
  measurementId: "G-584C14RD4D",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const messaging = getMessaging(app);

// Request Notification Permission and get Token
export const requestPermission = async () => {
  console.log("Requesting permission...");
  const permission = await Notification.requestPermission();

  if (permission === "granted") {
    console.log("Notification permission granted.");
    const token = await getToken(messaging, {
      vapidKey:
        "BBtnkluAxYNsG0Q9vriUp2c8y5exrq9nvscD7gMOdnC1Yp246MNM60O5FAAZi-T5NBWwj5TsKnpUbculos-sYO0",
    });
    console.log("FCM Token:", token);
    return token;
  } else {
    console.log("Notification permission denied.");
    return null;
  }
};

// Listen for foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received in foreground: ", payload);
});
