import React from 'react'
import FirebaseNotifications from '../components/FirebaseNotifications'

export default function NotificationsPage() {
  return (
    <div className="p-5 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Firebase Notifications</h2>
      <FirebaseNotifications />
    </div>
  )
}

