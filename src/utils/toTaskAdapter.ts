// src/utils/toTaskAdapter.ts
import { Task } from "../controllers/taskController";
import { CategoryKey } from "../utils/categories";

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  allDay: boolean;
  category: CategoryKey;
  completed?: boolean; // ⬅️ lägg till
}

export function toTaskFromCalendar(ev: CalendarEvent): Task {
  return {
    id: Number(ev.id),
    title: ev.title,
    completed: ev.completed ?? false, // ⬅️ behåll completed om den fanns
    date: ev.start.split("T")[0],
    time: ev.allDay ? undefined : ev.start.split("T")[1]?.slice(0, 5),
    allDay: ev.allDay,
    category: ev.category,
  };
}

export function toCalendarFromTask(task: Task): CalendarEvent {
  return {
    id: String(task.id),
    title: task.title,
    start: task.time ? `${task.date}T${task.time}` : `${task.date}T00:00:00`,
    allDay: !!task.allDay,
    category: (task.category as CategoryKey) ?? "none",
    completed: task.completed, // ⬅️ skicka tillbaka completed till kalendern
  };
}
