export type CategoryKey =
  | "work"
  | "home"
  | "health"
  | "family"
  | "personal"
  | "other";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  work: "Work / Studies",
  home: "Home / Household",
  health: "Health / Well-being",
  family: "Family / Relationships",
  personal: "Personal Development / Interests",
  other: "Other",
};

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  work: "#2563eb", // blå
  home: "#10b981", // grön
  health: "#ef4444", // röd
  family: "#f59e0b", // orange
  personal: "#8b5cf6", // lila
  other: "#ec4899", // rosa
};

export const CATEGORY_OPTIONS: Array<{ key: CategoryKey; label: string }> = [
  { key: "work", label: CATEGORY_LABELS.work },
  { key: "home", label: CATEGORY_LABELS.home },
  { key: "health", label: CATEGORY_LABELS.health },
  { key: "family", label: CATEGORY_LABELS.family },
  { key: "personal", label: CATEGORY_LABELS.personal },
  { key: "other", label: CATEGORY_LABELS.other },
];
