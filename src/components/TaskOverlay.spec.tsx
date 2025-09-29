import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskOverlay from "./TaskOverlay";

const baseEvent = {
    id: "1",
    title: "My task",
    start: "2025-10-01",
    allDay: true,
    category: "work" as const,
};

test("renders title and category", () => {
    render(
        <TaskOverlay
         event={baseEvent}
         onClose={() => {}}
         onSave={() => {}}
         onToggleComplete={() => {}}
         onDelete={() => {}}
         />
    )
    expect(screen.getByDisplayValue(/my task/i)).toBeInTheDocument();
    expect(screen.getByText(/work/i)).toBeInTheDocument();
});

test("calls onSave ...", async () => {
    const user = userEvent.setup();
    const onSave = jest.fn();

    render(
        <TaskOverlay
        event={baseEvent}
        onClose={() => {}}
        onSave={onSave}
        onToggleComplete={() => {}}
        onDelete={() => {}}
        />
    ); 
    const input = screen.getByRole("textbox");
    await user.clear(input);
    await user.type(input, "  New title  ");
    await user.click(screen.getByRole("button", { name: /spara/i }));

    expect(onSave).toHaveBeenCalledWith({ title: "  New title  " });
});

test("calls onDelete when clicking delete", async () => {
    const user = userEvent.setup();
    const onDelete = jest.fn();

    render(
        <TaskOverlay
          event={baseEvent}
          onClose={() => {}}
          onSave={() => {}}
          onToggleComplete={() => {}}
          onDelete={onDelete}
        />  
    );

    await user.click(screen.getByRole("button", { name: /radera/i }));
    expect(onDelete).toHaveBeenCalled();
});