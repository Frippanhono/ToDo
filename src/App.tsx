import React, { useEffect, useState } from "react";

import CalendarView from "./components/CalenderView";
import LoginCard from "./components/LoginCard";
import { authService } from "./utils/authService";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  // Check localStorage on component mount to restore login state
  useEffect(() => {
    const { isLoggedIn: storedLogin, userEmail: storedEmail } =
      authService.getStoredLoginState();
    if (storedLogin && storedEmail) {
      setIsLoggedIn(true);
      setUserEmail(storedEmail);
    }
  }, []);

  const handleLogin = (email: string) => {
    setLoginError("");

    const result = authService.login(email);

    if (result.success) {
      setUserEmail(email);
      setIsLoggedIn(true);
    } else {
      setLoginError(result.error || "Login failed");
    }
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setUserEmail("");
    setLoginError("");
  };

  return (
    <div>
      {isLoggedIn ? (
        <CalendarView userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginCard loginError={loginError} onLogin={handleLogin} />
      )}
    </div>
  );
}
