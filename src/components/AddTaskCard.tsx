import React from "react";
import * as styledComponents from "styled-components";

interface AddTaskCardProps {
  newTitle: string;
  setNewTitle: (value: string) => void;
  newDate: string;
  setNewDate: (value: string) => void;
  newTime: string;
  setNewTime: (value: string) => void;
  newAllDay: boolean;
  setNewAllDay: (value: boolean) => void;
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
  canSubmit,
  handleAddTask,
}: AddTaskCardProps) {
  return (
    <Card onSubmit={handleAddTask} aria-labelledby="addtask-heading">
      <CardHeader>
        <h3 id="addtask-heading">Add Task</h3>
      </CardHeader>

      <Row>
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            type="text"
            value={newTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTitle(e.target.value)
            }
            placeholder="Enter a title…"
            required
          />
        </Field>

        <Field>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={newDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewDate(e.target.value)
            }
            required
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
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewTime(e.target.value)
            }
            disabled={newAllDay}
          />
          {newAllDay}
        </Field>

        <Field>
          <Label as="span">All day</Label>
          <Switch
            role="switch"
            aria-checked={newAllDay}
            tabIndex={0}
            onClick={(e: React.MouseEvent<HTMLDivElement>) =>
              setNewAllDay(!newAllDay)
            }
            onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setNewAllDay(!newAllDay);
              }
            }}
            $checked={newAllDay}
            title="Toggle all day"
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

const Row = styled.div`
  display: grid;
  grid-template-columns: 1.3fr 0.8fr 0.8fr auto;
  column-gap: 40px; /* mer luft mellan Title / Date / Time / All day */
  row-gap: 16px; /* om det bryts till flera rader på mindre skärmar */

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

const Hint = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

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
