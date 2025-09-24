// src/components/TaskCard.tsx
import React from "react";
import * as styledComponents from "styled-components";

export type DatedTask = {
  id: number;
  title: string;
  completed: boolean;
  date: Date;
};

type Props = {
  task: DatedTask;
  onToggle?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const styled = styledComponents.default;

export default function TaskCard({ task, onToggle, onDelete }: Props) {
  return (
    <Row $completed={task.completed} role="listitem">
      <Left>
        <Checkbox
          aria-label={task.completed ? "Mark as not done" : "Mark as done"}
          onClick={() => onToggle?.(task.id)}
          $checked={task.completed}
        >
          {task.completed ? "✓" : ""}
        </Checkbox>

        <TextBlock>
          <Title $completed={task.completed}>{task.title}</Title>
          <Meta>
            {task.date.toLocaleDateString("sv-SE", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Meta>
        </TextBlock>
      </Left>

      <Right>
        <Pill $completed={task.completed}>
          {task.completed ? "Klar" : "Att göra"}
        </Pill>
        <IconBtn
          aria-label="Delete task"
          onClick={() => onDelete?.(task.id)}
          title="Ta bort"
        >
          ×
        </IconBtn>
      </Right>
    </Row>
  );
}

/* --- styles: list-row look, inte kort --- */

const Row = styled.div<{ $completed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;

  /* subtil hover, ingen fet kortskugga */
  transition: background 120ms ease, border-color 120ms ease;
  &:hover {
    background: #f9fafb;
    border-color: #d1d5db;
  }
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0; /* så text kan trunceras */
`;

const Checkbox = styled.button<{ $checked: boolean }>`
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1.5px solid ${p => (p.$checked ? "#16a34a" : "#9ca3af")};
  background: ${p => (p.$checked ? "#16a34a" : "#fff")};
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
  cursor: pointer;
`;

const TextBlock = styled.div`
  display: grid;
  gap: 2px;
  min-width: 0;
`;

const Title = styled.div<{ $completed: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${p => (p.$completed ? "#9ca3af" : "#111827")};
  text-decoration: ${p => (p.$completed ? "line-through" : "none")};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Meta = styled.div`
  font-size: 12px;
  color: #6b7280;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Pill = styled.span<{ $completed: boolean }>`
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
  background: ${p => (p.$completed ? "#dcfce7" : "#fee2e2")};
  color: ${p => (p.$completed ? "#166534" : "#991b1b")};
  border: 1px solid ${p => (p.$completed ? "#86efac" : "#fecaca")};
`;

const IconBtn = styled.button`
  width: 26px;
  height: 26px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  line-height: 1;
  font-size: 16px;
  color: #6b7280;

  &:hover {
    background: #f3f4f6;
  }
`;
