export type CategoryKey = "work" | "home" | "health" | "family" | "personal";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  work: "Work / Studies",
  home: "Home / Household",
  health: "Health / Well-being",
  family: "Family / Relationships",
  personal: "Personal Development / Interests",
};

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  work: "#2563eb", // blå
  home: "#10b981", // grön
  health: "#ef4444", // röd
  family: "#f59e0b", // orange
  personal: "#8b5cf6", // lila
};

export const CATEGORY_OPTIONS: Array<{ key: CategoryKey; label: string }> = [
  { key: "work", label: CATEGORY_LABELS.work },
  { key: "home", label: CATEGORY_LABELS.home },
  { key: "health", label: CATEGORY_LABELS.health },
  { key: "family", label: CATEGORY_LABELS.family },
  { key: "personal", label: CATEGORY_LABELS.personal },
];
