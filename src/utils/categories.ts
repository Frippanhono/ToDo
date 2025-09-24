export type CategoryKey =
  | "none"
  | "work"
  | "home"
  | "health"
  | "family"
  | "personal";

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  none: "— Select category —",
  work: "Work / Studies",
  home: "Home / Household",
  health: "Health / Well-being",
  family: "Family / Relationships",
  personal: "Personal Development / Interests",
};

export const CATEGORY_COLORS: Record<CategoryKey, string> = {
  none: "#9ca3af", // neutral grå (placeholder)
  work: "#2563eb", // blå
  home: "#10b981", // grön
  health: "#ef4444", // röd
  family: "#f59e0b", // orange
  personal: "#8b5cf6", // lila
};

export const CATEGORY_OPTIONS: Array<{ key: CategoryKey; label: string }> = [
  { key: "none", label: CATEGORY_LABELS.none },
  { key: "work", label: CATEGORY_LABELS.work },
  { key: "home", label: CATEGORY_LABELS.home },
  { key: "health", label: CATEGORY_LABELS.health },
  { key: "family", label: CATEGORY_LABELS.family },
  { key: "personal", label: CATEGORY_LABELS.personal },
];
