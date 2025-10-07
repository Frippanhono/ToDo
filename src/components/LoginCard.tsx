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
      setEmailError("Please enter a valid email address");
      return;
    }

    if (email.trim()) {
      onLogin(email);
    }
  };

  return (
    <Container>
      <LoginCard>
        <Header>
          <LockIcon aria-hidden="true" />
          <Title data-testid="login-title">Login</Title>
        </Header>
        <Form noValidate onSubmit={handleSubmit}>
          <InputGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              required
              id="email"
              data-testid="email-input"
              type="email"
              value={email}
              placeholder="123@example.com"
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
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #011957 0%, #214e9c 100%);
`;

const LoginCard = styled.div`
  background: #fff;
  width: 100%;
  max-width: 380px;
  padding: 28px 26px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 18px;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  font-weight: 700;
  color: #15ce2eff;
`;

interface LockIconProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

const LockIcon = styled(({ className, ...props }: LockIconProps) => (
  <svg
    className={className}
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    {...props}
  >
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
))`
  color: #111827;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const InputGroup = styled.div`
  margin-bottom: 14px;
`;

const Label = styled.label`
  display: block;
  margin: 0 0 6px;
  color: #4b5563;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  font-size: 0.95rem;
  outline: none;
  box-sizing: border-box;
  background: #ffffff;

  &:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px 12px;
  margin-top: 4px;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 600;
  color: #ffffff;
  cursor: pointer;
  background: #5b3cc4;
  transition: filter 0.18s ease, transform 0.02s ease;

  &:hover {
    filter: brightness(0.95);
  }

  &:active {
    transform: translateY(0.5px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #b91c1c;
  font-size: 0.875rem;
  margin: 6px 0 8px;
  padding: 8px 10px;
  background-color: #fef2f2;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  text-align: center;
`;
