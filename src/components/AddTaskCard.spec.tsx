import { fireEvent, render, screen } from "@testing-library/react";

import { CATEGORY_OPTIONS } from "@/utils/categories";

import AddTaskCard from "./AddTaskCard";

test("kan fylla i titel och datum och skicka formuläret", () => {
  const mockHandleAddTask = jest.fn();

  render(
    <AddTaskCard
      newTitle=""
      setNewTitle={jest.fn()}
      newDate=""
      setNewDate={jest.fn()}
      newTime=""
      setNewTime={jest.fn()}
      newAllDay={false}
      setNewAllDay={jest.fn()}
      newCategory={CATEGORY_OPTIONS[0].key}
      setNewCategory={jest.fn()}
      canSubmit={true}
      handleAddTask={mockHandleAddTask}
    />
  );

  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "Laga middag" },
  });

  fireEvent.change(screen.getByLabelText(/date/i), {
    target: { value: "2025-10-01" },
  });

  const form = screen.getByRole("form");
  fireEvent.submit(form);

  expect(mockHandleAddTask).toHaveBeenCalledTimes(1);
});

test("toggla 'All day' anropar setNewAllDay och inaktiverar tid", () => {
  const mockSetNewAllDay = jest.fn();

  render(
    <AddTaskCard
      newTitle=""
      setNewTitle={jest.fn()}
      newDate=""
      setNewDate={jest.fn()}
      newTime="14:00"
      setNewTime={jest.fn()}
      newAllDay={false}
      setNewAllDay={mockSetNewAllDay}
      newCategory={CATEGORY_OPTIONS[0].key}
      setNewCategory={jest.fn()}
      canSubmit={false}
      handleAddTask={jest.fn()}
    />
  );

  const timeInput = screen.getByLabelText(/time/i);
  expect(timeInput).toBeEnabled();

  const allDaySwitch = screen.getByRole("switch", { name: /all day/i });
  fireEvent.click(allDaySwitch);

  expect(mockSetNewAllDay).toHaveBeenCalledWith(true);
});
