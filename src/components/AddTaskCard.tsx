import React from "react";
import * as styledComponents from "styled-components";

import { CATEGORY_OPTIONS, CategoryKey } from "../utils/categories";

interface AddTaskCardProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDate: string;
  setNewDate: (value: string) => void;
  newTime: string;
  setNewTime: (value: string) => void;
  newAllDay: boolean;
  setNewAllDay: (value: boolean) => void;

  newCategory: CategoryKey;
  setNewCategory: (value: CategoryKey) => void;

  canSubmit: boolean;
  handleAddTask: (e: React.FormEvent) => void;
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
}

export function addTask(tasks: Task[], title: string): Task[] {
  const newTask: Task = {
    id: Date.now(),
    title,
    completed: false,
  };
  return [...tasks, newTask];
}

export default function AddTaskCard({
  newTitle,
  setNewTitle,
  newDate,
  setNewDate,
  newTime,
  setNewTime,
  newAllDay,
  setNewAllDay,
  newCategory,
  setNewCategory,
  canSubmit,
  handleAddTask,
}: AddTaskCardProps) {
  // Hjälpfunktion för att toggla All day och hantera tid
  const toggleAllDay = () => {
    const next = !newAllDay;
    setNewAllDay(next);
    if (next) {
      // När All day slås PÅ: rensa tiden
      if (newTime) setNewTime("");
    }
    // När All day slås AV: lämna tiden orörd (ingen default 09:00)
  };

  const onAllDayKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggleAllDay();
    }
  };

  return (
    <Card aria-labelledby="addtask-heading" onSubmit={handleAddTask}>
      <CardHeader>
        <h3 id="addtask-heading">Add Task</h3>
      </CardHeader>

      <Row>
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input
            required
            id="title"
            data-testid="title-input"
            type="text"
            value={newTitle}
            placeholder="Enter a title…"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTitle(e.target.value)
            }
          />
        </Field>

        <Field>
          <Label htmlFor="date">Date</Label>
          <Input
            required
            id="date"
            data-testid="date-input"
            type="date"
            value={newDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewDate(e.target.value)
            }
          />
        </Field>

        <Field $disabled={newAllDay}>
          <Label htmlFor="time" aria-disabled={newAllDay}>
            Time
          </Label>
          <Input
            id="time"
            type="time"
            value={newTime}
            disabled={newAllDay}
            placeholder="—"
            // (placeholder syns inte i alla browsers för type="time", men skadar inte)
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTime(e.target.value)
            }
          />
        </Field>

        {/* Category */}
        <Field>
          <Label htmlFor="category">Category</Label>
          <Select
            required
            id="category"
            data-testid="add-task-category-filter"
            value={newCategory}
            aria-invalid={false}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setNewCategory(e.target.value as CategoryKey)
            } // <-- ändrat
          >
            {CATEGORY_OPTIONS
              // om CATEGORY_OPTIONS råkar innehålla "none", visa inte den i listan
              .filter(opt => opt.key !== ("none" as CategoryKey))
              .map(opt => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
          </Select>
        </Field>

        <Field>
          <Label as="span">All day</Label>
          <Switch
            role="switch"
            aria-checked={newAllDay}
            tabIndex={0}
            $checked={newAllDay}
            title="Toggle all day"
            onClick={toggleAllDay}
            onKeyDown={onAllDayKeyDown}
          >
            <SwitchThumb $checked={newAllDay} />
          </Switch>
        </Field>
      </Row>

      <Actions>
        <AddBtn type="submit" disabled={!canSubmit} aria-disabled={!canSubmit}>
          Add
        </AddBtn>
      </Actions>
    </Card>
  );
}

const styled = styledComponents.default;

/* --- Layout & Card --- */
const Card = styled.form`
  background: #ffffff;
  border-radius: 14px;
  padding: 18px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  border: 1px solid #eef2f7;
`;

const CardHeader = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  column-gap: 10px;
  margin-bottom: 14px;

  h3 {
    margin: 0;
    color: #111827;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
`;

/* +1 kolumn för Category */
const Row = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 0.8fr 0.8fr 1fr auto;
  column-gap: 40px;
  row-gap: 16px;

  @media (max-width: 920px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;

const Actions = styled.div`
  margin-top: 14px;
  display: flex;
  gap: 10px;
`;

/* --- Fields --- */
const Field = styled.div<{ $disabled?: boolean }>`
  display: grid;
  gap: 6px;
  opacity: ${p => (p.$disabled ? 0.6 : 1)};
`;

const Label = styled.label`
  font-size: 13px;
  color: #374151;
  font-weight: 600;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: box-shadow 120ms ease, border-color 120ms ease;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }

  &:disabled {
    background: #f9fafb;
    color: #6b7280;
    cursor: not-allowed;
  }
`;

const Select = styled.select`
  display: block;
  width: 100%;
  padding: 10px 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #111827;
  outline: none;
  transition: box-shadow 120ms ease, border-color 120ms ease;

  &:focus {
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
  }
`;

//const Hint = styled.span`
//  font-size: 12px;
//  color: #6b7280;
//`;

/* --- “All day” switch --- */
const Switch = styled.div<{ $checked: boolean }>`
  width: 44px;
  height: 26px;
  border-radius: 999px;
  background: ${p => (p.$checked ? "#2563eb" : "#e5e7eb")};
  position: relative;
  cursor: pointer;
  transition: background 140ms ease, box-shadow 140ms ease;
  outline: none;
  border: 1px solid ${p => (p.$checked ? "#1e40af" : "#e5e7eb")};

  &:focus-visible {
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.2);
  }
`;

const SwitchThumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 50%;
  left: ${p => (p.$checked ? "22px" : "2px")};
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  transition: left 140ms ease;
`;

/* --- Buttons --- */
const AddBtn = styled.button`
  padding: 10px 16px;
  background: #2563eb;
  color: #fff;
  border: 0;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.2px;
  transition: transform 80ms ease, background 120ms ease, box-shadow 120ms ease;

  &:hover:not(:disabled) {
    background: #1d4ed8;
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:disabled,
  &[aria-disabled="true"] {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
