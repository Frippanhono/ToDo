import React, { useEffect, useState } from "react";
import { createGlobalStyle } from "styled-components";

import CalendarView from "./components/CalendarView";
import LoginCard from "./components/LoginCard";
import { authService } from "./utils/authService";

const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #111827;
    background: #fff;
  }
  button, input, textarea, select {
    font: inherit; /* gör att formulär ärver Inter */
  }
`;

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
    <>
      <GlobalStyle />
      {isLoggedIn ? (
        <CalendarView userEmail={userEmail} onLogout={handleLogout} />
      ) : (
        <LoginCard loginError={loginError} onLogin={handleLogin} />
      )}
    </>
  );
}
