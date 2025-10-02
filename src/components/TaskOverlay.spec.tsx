import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Task } from "../controllers/taskController";
import TaskOverlay from "./TaskOverlay";

const baseEvent: Task = {
  id: 1,
  title: "My task",
  completed: false,
  date: "2025-10-02",
  time: "",
  allDay: true,
  category: "work",
};

test("renders title and category", () => {
  render(
    <TaskOverlay
      event={baseEvent}
      onClose={jest.fn()}
      onSave={jest.fn()}
      onToggleComplete={jest.fn()}
      onDelete={jest.fn()}
    />
  );

  // Title input värde
  expect(screen.getByDisplayValue(/my task/i)).toBeInTheDocument();

  // Kategori-label i selecten (matchar t.ex. "Work / Studies")
  expect(screen.getByText(/work/i)).toBeInTheDocument();
});

test("calls onSave with trimmed title and fields", async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();

  render(
    <TaskOverlay
      event={baseEvent}
      onClose={jest.fn()}
      onSave={onSave}
      onToggleComplete={jest.fn()}
      onDelete={jest.fn()}
    />
  );

  const input = screen.getByRole("textbox", { name: /title/i });
  await user.clear(input);
  await user.type(input, "  New title  ");

  await user.click(screen.getByRole("button", { name: /save/i }));

  // Komponentens handleSave trimmar title och skickar fler fält.
  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({ title: "New title" })
  );
});

test("calls onDelete when clicking delete", async () => {
  const user = userEvent.setup();
  const onDelete = jest.fn();

  render(
    <TaskOverlay
      event={baseEvent}
      onClose={jest.fn()}
      onSave={jest.fn()}
      onToggleComplete={jest.fn()}
      onDelete={onDelete}
    />
  );

  await user.click(screen.getByRole("button", { name: /delete/i }));
  expect(onDelete).toHaveBeenCalled();
});
