import React, { useState } from "react";
import { logEvent } from "firebase/analytics";
import { analytics, requestPermission } from "../firebase/firebase";

const FirebaseNotifications = () => {
  const [token, setToken] = useState("");

  const handleRequest = async () => {
    try {
      const userToken = await requestPermission();
      if (userToken) {
        setToken(userToken);
        logEvent(analytics, "notification_permission_granted");
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      alert("Failed to request notification permission. Please check your browser settings.");
    }
  };

  const handleTestNotification = () => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Test Notification", {
        body: "This is a sample notification from your app!",
        icon: "/vite.svg"
      });
    } else {
      alert("Please enable notifications first!");
    }
  };

  return (
    <div className="flex flex-col">
      <p className="text-gray-600 mb-4">
        Click below to enable notifications and test one.
      </p>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleRequest}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all"
        >
          Enable Notifications
        </button>
        <button
          onClick={handleTestNotification}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all"
        >
          Test Notification
        </button>
      </div>

      {/* {token && (
        <div className="mt-4 p-3 bg-gray-50 border rounded text-xs break-all">
          <strong>Token:</strong> {token.substring(0, 50)}...
        </div>
      )} */}
    </div>
  );
};

export default FirebaseNotifications;
