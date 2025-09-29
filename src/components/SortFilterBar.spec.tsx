import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import SortFilterBar from "./SortFilterBar"
import '@testing-library/jest-dom';

test("renders both selects with default options", () => {
    render(
        <SortFilterBar
          activeCategory="all"
          onCategoryChange={() => {}}
          statusFilter="completed"
          onStatusChange={() => {}}
          />
        );

        const categorySelect = screen.getByRole("combobox", { name: /category filter/i });
        const statusSelect = screen.getByRole("combobox", { name: /status filter/i });

        expect(categorySelect).toBeInTheDocument();
        expect(statusSelect).toBeInTheDocument();

        expect(screen.getByRole("option", { name: /all categories/i })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /all status/i })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /completed/i })).toBeInTheDocument();
        expect(screen.getByRole("option", { name: /todo/i })).toBeInTheDocument();
});

test("changing status calls onStatusChange with selected value", async () => {
    const user = userEvent.setup();
    const onStatusChange = jest.fn();


    render(
        <SortFilterBar
          activeCategory="all"
          onCategoryChange={() => {}}
          statusFilter="all"
          onStatusChange={onStatusChange}
          />
        );

        const statusSelect = 
        screen.getByRole("combobox", { name: /status filter/i }) || 
        screen.getAllByRole("combobox")[1];

       await user.selectOptions(statusSelect, "completed")
        expect(onStatusChange).toHaveBeenCalledWith("completed");

        await user.selectOptions(statusSelect, "todo");
       expect(onStatusChange).toHaveBeenCalledWith("todo");
});

test("reflects controlled value in both selects", () => {
    render(
        <SortFilterBar
          activeCategory="work"
          onCategoryChange={() => {}}
          statusFilter="completed"
          onStatusChange={() => {}}
          />
    );
     const [categorySelect, statusSelect] = screen.getAllByRole("combobox");

      expect((categorySelect as HTMLSelectElement).value).toBe("work");
      expect((statusSelect as HTMLSelectElement).value).toBe("completed");
});