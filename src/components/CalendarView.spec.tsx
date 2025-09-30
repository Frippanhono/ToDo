import { fireEvent, render, screen } from "@testing-library/react";

import CalendarView from "./CalendarView";

test("renderar Calendar med titel och användarens e-post", () => {
  const mockLogout = jest.fn();
  const testEmail = "test@example.com";

  render(<CalendarView userEmail={testEmail} onLogout={mockLogout} />);

  expect(screen.getByTestId("calendar-title")).toHaveTextContent(/calendar/i);
  expect(screen.getByText(testEmail)).toBeInTheDocument();
});

test("anropar onLogout vid klick på logout-knappen", () => {
  const mockLogout = jest.fn();

  render(<CalendarView userEmail="test@example.com" onLogout={mockLogout} />);

  const logoutButton = screen.getByRole("button", { name: /logout/i });
  fireEvent.click(logoutButton);

  expect(mockLogout).toHaveBeenCalledTimes(1);
});
