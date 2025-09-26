import React, { useState } from "react";
import * as styledComponents from "styled-components";

interface LoginCardProps {
  onLogin: (email: string) => void;
  loginError?: string;
}

export default function LoginCardComponent({
  onLogin,
  loginError,
}: LoginCardProps) {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    // Clear error when user starts typing
    if (emailError) {
      setEmailError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate before submitting
    if (!email.trim()) {
      setEmailError("Email is required");
      return;
    }

    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Title data-testid="login-title">Login</Title>
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              required
              id="email"
              type="email"
              value={email}
              placeholder="Ingresa tu email"
              onChange={handleEmailChange}
            />
          </InputGroup>
          {emailError && <ErrorMessage>{emailError}</ErrorMessage>}
          {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
          <Button type="submit">Login</Button>
        </Form>
      </LoginCard>
    </Container>
  );
}

// Styles for the LoginCard component
const styled = styledComponents.default;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
`;

const LoginCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
  margin-top: 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;

  &:focus {
    border-color: #007bff;
  }

  &::placeholder {
    color: #999;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004494;
  }

  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.5rem;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  text-align: center;
`;
