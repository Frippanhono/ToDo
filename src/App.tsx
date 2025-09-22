import React, { useState } from "react";

import CalendarView from "./components/CalenderView";
import LoginCard from "./components/LoginCard";
import { authService } from "./utils/authService";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loginError, setLoginError] = useState("");

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
