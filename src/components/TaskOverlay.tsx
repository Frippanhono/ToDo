// TaskOverlay.tsx
import React, { useState } from "react";
import * as styledComponents from "styled-components";

import { Task } from "../controllers/taskController";
import {
  CATEGORY_COLORS,
  CATEGORY_OPTIONS,
  CategoryKey,
} from "../utils/categories";

const styled = styledComponents.default;

export interface OverlayProps {
  event: Task;
  onClose: () => void;
  onSave: (patch: Partial<Omit<Task, "id">>) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
}

export default function TaskOverlay({
  event,
  onClose,
  onSave,
  onToggleComplete,
  onDelete,
}: OverlayProps) {
  const [title, setTitle] = useState(event.title);
  const [category, setCategory] = useState<CategoryKey>(
    (event.category as CategoryKey) ?? "none"
  );
  const [date, setDate] = useState<string>(event.date ?? "");
  const [time, setTime] = useState<string>(event.time ?? "");
  const [allDay, setAllDay] = useState<boolean>(!!event.allDay);
  const [completed, setCompleted] = useState<boolean>(!!event.completed);

  const toggleAllDay = () => {
    const next = !allDay;
    setAllDay(next);
    if (next && time) setTime(""); // rensa tid om All Day sätts på
  };

  const handleSave = () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    if (time && !date) return;

    onSave({
      title: trimmed,
      category,
      date,
      time: allDay ? undefined : time || undefined,
      allDay,
      completed,
    });
  };

  const isSaveDisabled = !title.trim() || (!!time && !date);

  return (
    <Backdrop
      data-testid="task-overlay"
      onClick={(e: React.MouseEvent<HTMLDivElement>) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <Card role="dialog" aria-modal="true" aria-labelledby="overlay-title">
        <Header>
          <h2 id="overlay-title" data-testid="overlay-header">
            Task
          </h2>
          <Close data-testid="overlay-close" onClick={onClose}>
            ✕
          </Close>
        </Header>

        {/* Top row: Category (left) + Completed (right) */}
        <RowBetween>
          <Field>
            <Label htmlFor="overlay-category">Category</Label>
            <RowInline>
              <Dot style={{ background: CATEGORY_COLORS[category] }} />
              <Select
                id="overlay-category"
                data-testid="overlay-category"
                value={category}
                onChange={e => setCategory(e.target.value as CategoryKey)}
              >
                {CATEGORY_OPTIONS.filter(
                  opt => opt.key !== ("none" as CategoryKey)
                ).map(opt => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </RowInline>
          </Field>

          <Field>
            <Label as="span">Completed</Label>
            <Switch
              data-testid="overlay-toggle"
              aria-label="Completed"
              role="switch"
              aria-checked={completed}
              tabIndex={0}
              $checked={completed}
              title="Toggle completed"
              onClick={() => {
                setCompleted(c => !c); // optimistiskt UI
                onToggleComplete(); // persistera
              }}
              onKeyDown={e => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  setCompleted(c => !c);
                  onToggleComplete();
                }
              }}
            >
              <SwitchThumb $checked={completed} />
            </Switch>
          </Field>
        </RowBetween>

        {/* Title */}
        <Field>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            data-testid="overlay-title-input"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </Field>

        {/* Date (left) + Time (middle) + All Day (right, label above switch) */}
        <GridThree>
          <Field>
            <Label htmlFor="overlay-date">Date</Label>
            <Input
              id="overlay-date"
              data-testid="overlay-date"
              type="date"
              value={date}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setDate(e.target.value)
              }
            />
          </Field>

          <Field $disabled={allDay}>
            <Label htmlFor="overlay-time" aria-disabled={allDay}>
              Time
            </Label>
            <TimeInput
              id="overlay-time"
              data-testid="overlay-time"
              type="time"
              value={time}
              disabled={allDay}
              placeholder="—"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setTime(e.target.value)
              }
            />
          </Field>

          <Field>
            <Label as="span">All Day</Label>
            <Switch
              role="switch"
              aria-label="All day"
              aria-checked={allDay}
              data-testid="overlay-allday"
              tabIndex={0}
              $checked={allDay}
              title="Toggle all day"
              onClick={toggleAllDay}
              onKeyDown={e => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggleAllDay();
                }
              }}
            >
              <SwitchThumb $checked={allDay} />
            </Switch>
          </Field>
        </GridThree>

        {/* Bottom actions */}
        <Actions>
          <LeftGroup>
            <Danger data-testid="overlay-delete" onClick={onDelete}>
              Delete
            </Danger>
          </LeftGroup>
          <RightGroup>
            <Primary
              data-testid="overlay-save"
              disabled={isSaveDisabled}
              aria-disabled={isSaveDisabled}
              onClick={handleSave}
            >
              Save
            </Primary>
          </RightGroup>
        </Actions>
      </Card>
    </Backdrop>
  );
}

/* ========== Styles ========== */
const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 50;
`;
const Card = styled.div`
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;
const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  h2 {
    margin: 0;
    font-size: 20px;
  }
`;
const Close = styled.button`
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
`;
const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 8px;
`;
const Field = styled.div<{ $disabled?: boolean }>`
  display: grid;
  gap: 6px;
  opacity: ${p => (p.$disabled ? 0.6 : 1)};
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 6px 0 14px;
`;
const TimeInput = styled(Input)`
  max-width: 120px;
  min-width: 100px;
`;
const Select = styled.select`
  display: block;
  width: 100%;
  max-width: 240px;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
`;
const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;
const RowInline = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
const RowBetween = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 16px;
  gap: 16px;
  flex-wrap: wrap;
`;
const GridThree = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 160px;
  gap: 14px;
  align-items: end;
  justify-items: start;
`;
const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 20px;
`;
const LeftGroup = styled.div`
  display: flex;
  gap: 8px;
`;
const RightGroup = styled.div`
  display: flex;
  gap: 8px;
`;
const Primary = styled.button`
  background: #2563eb;
  color: #fff;
  border: none;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
`;
const Danger = styled(Primary)`
  background: #dc3545;
`;

/* Switch – stabilt mått och korrekt thumb-position */
const Switch = styled.div<{ $checked: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 999px;
  background: ${p => (p.$checked ? "#2563eb" : "#e5e7eb")};
  position: relative;
  cursor: pointer;
  border: 1px solid ${p => (p.$checked ? "#1e40af" : "#e5e7eb")};
  transition: background 140ms ease, border-color 140ms ease;
`;
const SwitchThumb = styled.span<{ $checked: boolean }>`
  position: absolute;
  top: 50%;
  left: ${p => (p.$checked ? "26px" : "2px")};
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.18);
  transition: left 140ms ease;
`;
