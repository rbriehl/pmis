"use client";
import { Spin } from "antd";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";
import AppShell from "@/components/AppShell";

function App() {
  const { user, initializing } = useAuth();
  if (initializing) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spin size="large" />
      </div>
    );
  }
  return user ? <AppShell /> : <LoginPage />;
}

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
