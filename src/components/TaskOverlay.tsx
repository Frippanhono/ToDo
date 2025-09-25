// TaskOverlay.tsx
import React, { useState } from "react";
import * as styledComponents from "styled-components";

import {
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  CategoryKey,
} from "../utils/categories";

const styled = styledComponents.default;

type OverlayProps = {
  event: {
    id: string;
    title: string;
    start: string; // ISO
    allDay: boolean;
    category: CategoryKey;
    backgroundColor?: string;
  };
  onClose: () => void;
  onSave: (patch: { title?: string; start?: string; allDay?: boolean }) => void;
  onToggleComplete: () => void;
  onDelete: () => void;
};

export default function TaskOverlay({
  event,
  onClose,
  onSave,
  onToggleComplete,
  onDelete,
}: OverlayProps) {
  const [title, setTitle] = useState(event.title);

  return (
    <Backdrop
      onClick={(e: { target: any; currentTarget: any }) =>
        e.target === e.currentTarget && onClose()
      }
    >
      <Card role="dialog" aria-modal="true">
        <Header>
          <h2>Task</h2>
          <Close onClick={onClose}>✕</Close>
        </Header>

        {/* Kategori (read-only badge) */}
        <BadgeRow>
          <Dot style={{ background: CATEGORY_COLORS[event.category] }} />
          <span>{CATEGORY_LABELS[event.category]}</span>
        </BadgeRow>

        <Label>Titel</Label>
        <Input
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
/>

        <Actions>
          <LeftGroup>
            <Danger onClick={onDelete}>Radera</Danger>
            <Ghost onClick={onToggleComplete}>Markera klar/ej klar</Ghost>
          </LeftGroup>
          <RightGroup>
            <Ghost onClick={onClose}>Avbryt</Ghost>
            <Primary onClick={() => onSave({ title })}>Spara</Primary>
          </RightGroup>
        </Actions>
      </Card>
    </Backdrop>
  );
}

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
const BadgeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
`;
const Dot = styled.span`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
`;
const Label = styled.label`
  display: block;
  font-size: 12px;
  color: #666;
`;
const Input = styled.input`
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 6px 0 14px;
`;
const Actions = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
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
const Ghost = styled.button`
  background: #fff;
  border: 1px solid #ddd;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
`;
const Danger = styled(Primary)`
  background: #dc3545;
`;
