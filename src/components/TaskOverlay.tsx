// TaskOverlay.tsx
import React, { useState } from "react";
import * as styledComponents from "styled-components";

import { Task } from "../controllers/taskController";
import { CATEGORY_OPTIONS, CategoryKey } from "../utils/categories";

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
    if (next && time) setTime("");
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

          <HeaderCenter>
            <HeaderLabel>Completed</HeaderLabel>
            <Switch
              data-testid="overlay-toggle"
              role="switch"
              aria-checked={completed}
              aria-label="Completed"
              tabIndex={0}
              $checked={completed}
              onClick={() => {
                setCompleted(c => !c);
                onToggleComplete();
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
          </HeaderCenter>

          <Close
            data-testid="overlay-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </Close>
        </Header>

        {/* Stacked fields */}
        <TitleField data-completed={completed ? "true" : "false"}>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            data-testid="overlay-title-input"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setTitle(e.target.value)
            }
          />
        </TitleField>

        <Field>
          <Label htmlFor="overlay-date">Date</Label>
          <Input
            id="overlay-date"
            data-testid="overlay-date"
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
          />
        </Field>

        <Field $disabled={allDay}>
          <Label htmlFor="overlay-time" aria-disabled={allDay}>
            Time
          </Label>
          <Input
            id="overlay-time"
            data-testid="overlay-time"
            type="time"
            value={time}
            disabled={allDay}
            onChange={e => setTime(e.target.value)}
          />
        </Field>

        <Field>
          <Label htmlFor="overlay-category">Category</Label>
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
        </Field>

        <Field style={{ marginBottom: 28 }}>
          <Label as="span">All day</Label>
          <Switch
            role="switch"
            aria-label="All day"
            aria-checked={allDay}
            data-testid="overlay-allday"
            tabIndex={0}
            $checked={allDay}
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

/* ========== Styles (all styling here) ========== */
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
  max-width: 480px;
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
`;

const Header = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr; /* left | center | right */
  align-items: center;
  margin-bottom: 16px;

  h2 {
    margin: 0;
    font-size: 22px;
    justify-self: start;
  }
`;

const HeaderCenter = styled.div`
  justify-self: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
`;

const HeaderLabel = styled.span`
  font-size: 12px;
  color: #666;
`;

const Close = styled.button`
  justify-self: end;
  border: none;
  background: transparent;
  font-size: 18px;
  cursor: pointer;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
  margin: 6px 0 6px;
`;

const Field = styled.div<{ $disabled?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  opacity: ${p => (p.$disabled ? 0.6 : 1)};
`;

const TitleField = styled(Field)`
  &[data-completed="true"] input {
    text-decoration: line-through;
    color: #6b7280; /* valfritt: dämpa färgen när completed */
  }
`;

const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  background: #fff;
`;

const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  margin-top: 24px; /* extra space från All Day */
`;

const LeftGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const RightGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const Primary = styled.button<{ disabled?: boolean }>`
  background: ${p => (p.disabled ? "#a78bfa" : "#6d28d9")}; /* purple Save */
  color: #fff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  cursor: ${p => (p.disabled ? "not-allowed" : "pointer")};
  transition: background 0.2s ease;
  &:hover {
    background: ${p => (p.disabled ? "#a78bfa" : "#5b21b6")};
  }
`;

const Danger = styled(Primary)`
  background: #dc3545;
  &:hover {
    background: #b91c1c;
  }
`;

/* Toggles – gröna när aktiva */
const Switch = styled.div<{ $checked: boolean }>`
  width: 48px;
  height: 26px;
  border-radius: 999px;
  background: ${p => (p.$checked ? "#6d28d9" : "#e5e7eb")};
  position: relative;
  cursor: pointer;
  border: 1px solid ${p => (p.$checked ? "#6d28d9" : "#e5e7eb")};
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
