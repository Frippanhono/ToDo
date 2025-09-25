// src/components/SortFilterBar.tsx
import * as styledComponents from "styled-components";

import {
  CATEGORY_LABELS,
  CATEGORY_OPTIONS,
  CategoryKey,
} from "../utils/categories";

const styled = styledComponents.default;

export type SortMode =
  | "default"
  | "title-asc"
  | "title-desc"
  | "completed-last";
export type StatusFilter = "all" | "todo" | "completed";

type Props = {
  activeCategory: CategoryKey | "all";
  onCategoryChange: (v: CategoryKey | "all") => void;
  statusFilter: StatusFilter;
  onStatusChange: (v: StatusFilter) => void;
};

export default function SortFilterBar({
  activeCategory,
  onCategoryChange,
  statusFilter,
  onStatusChange,
}: Props) {
  return (
    <Bar>
      <Select
        value={activeCategory}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onCategoryChange(e.target.value as CategoryKey | "all")
        }
      >
        <option value="all">All categories</option>
        {CATEGORY_OPTIONS.map(o => (
          <option key={o.key} value={o.key}>
            {CATEGORY_LABELS[o.key]}
          </option>
        ))}
      </Select>

      <Select
        value={statusFilter}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          onStatusChange(e.target.value as StatusFilter)
        }
      >
        <option value="all">All status</option>
        <option value="todo">Todo</option>
        <option value="completed">Completed</option>
      </Select>
    </Bar>
  );
}

const Bar = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  margin: 12px 0;
`;
const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
`;