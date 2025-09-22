import React, { useState } from "react";

import CalendarView from "./components/CalenderView";
import LoginCard from "./components/LoginCard";
import { isValidEmail, validateUser } from "./utils/auth";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLogin = (email: string) => {
    setLoginError("");

    if (!isValidEmail(email)) {
      setLoginError("Please enter a valid email address");
      return;
    }

    if (validateUser(email)) {
      setUserEmail(email);
      setIsLoggedIn(true);
    } else {
      setLoginError("User not found. Please check your email address.");
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
