import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./layout/Layout";
import NotificationsPage from "./pages/NotificationsPage";
import AiToolPage from "./pages/AiToolPage";
import ChatPage from "./pages/ChatPage";
import RealChatPage from "./pages/RealChat";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/notifications" replace />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/ai-tool" element={<AiToolPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/real-chat" element={<RealChatPage />} />
          <Route path="*" element={<Navigate to="/notifications" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
