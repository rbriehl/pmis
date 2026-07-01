"use client";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import LoginPage from "@/components/LoginPage";
import AppShell from "@/components/AppShell";

function App() {
  const { user } = useAuth();
  return user ? <AppShell /> : <LoginPage />;
}

export default function Home() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
