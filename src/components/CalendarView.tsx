import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar as CalendarIcon, LogOutIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as styledComponents from "styled-components";

import {
  addTask,
  deleteTask, // NY: ta bort i storage vid onDelete
  getAllTasks,
  Task,
  toggleTaskCompleted,
  updateTask, // NY: uppdaterar i storage
} from "../controllers/taskController";
import { CATEGORY_COLORS, CategoryKey } from "../utils/categories";
import { toCalendarFromTask, toTaskFromCalendar } from "../utils/toTaskAdapter";
import AddTaskCard from "./AddTaskCard";
import SortFilterBar, { StatusFilter } from "./SortFilterBar";
import TaskOverlay from "./TaskOverlay";

interface CalendarViewProps {
  userEmail: string;
  onLogout: () => void;
}

export default function CalendarView({
  userEmail,
  onLogout,
}: CalendarViewProps) {
  const [events, setEvents] = useState<any[]>([]);
  // --- Form-state för AddTaskCard ---
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [newTime, setNewTime] = useState("");
  const [newAllDay, setNewAllDay] = useState(true);
  const [newCategory, setNewCategory] = useState<CategoryKey | "">(""); // börjar med placeholder

  // Overlay-selection (backcompat + extendedProps)
  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    start: string;
    allDay: boolean;
    category?: CategoryKey;
    completed?: boolean;
    extendedProps: { category: CategoryKey; done: boolean };
  } | null>(null);

  const [activeCategory, setActiveCategory] = useState<CategoryKey | "all">(
    "all"
  );
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const visibleEvents = useMemo(() => {
    let list = events;
    if (activeCategory !== "all") {
      list = list.filter(
        (e: any) => e?.extendedProps?.category === activeCategory
      );
    }
    if (statusFilter !== "all") {
      const wantDone = statusFilter === "completed";
      list = list.filter(
        (e: any) => Boolean(e?.extendedProps?.done) === wantDone
      );
    }
    return list;
  }, [events, activeCategory, statusFilter]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !newDate || !newCategory) return; // Kräv att kategori är vald

    const result = addTask(userEmail, title, {
      date: newDate,
      time: newTime || undefined,
      allDay: newAllDay || !newTime,
      category: newCategory as CategoryKey,
    });

    if (result.success) {
      loadEventsFromStorage();
      setNewTitle("");
      setNewTime("");
      setNewAllDay(true);
      setNewDate(new Date().toISOString().slice(0, 10));
      setNewCategory("");
    } else {
      console.error("Failed to add task:", result.error);
    }
  };

  const canSubmit = newTitle.trim().length > 0 && !!newDate && !!newCategory;

  function isValidCategory(raw: string | undefined): raw is CategoryKey {
    return !!raw && (Object.keys(CATEGORY_COLORS) as string[]).includes(raw);
  }

  const loadEventsFromStorage = useCallback(async () => {
    const tasks = (await getAllTasks(userEmail)) || [];

    for (const t of tasks) {
      if (!t.color) {
        const cat = (
          isValidCategory(t.category as string)
            ? (t.category as CategoryKey)
            : "personal"
        ) as CategoryKey;
        const color = CATEGORY_COLORS[cat] ?? "#111827";
        updateTask(userEmail, t.id, { color });
      }
    }

    const calendarEvents = tasks.map(task => {
      const raw = task.category as string | undefined;
      const category: CategoryKey = isValidCategory(raw)
        ? (raw as CategoryKey)
        : "personal";
      const backgroundColor = task.color ?? CATEGORY_COLORS[category]; // låst färg

      return {
        id: task.id.toString(),
        title: task.title,
        start: task.allDay
          ? task.date
          : `${task.date}T${task.time || "09:00"}:00`,
        backgroundColor,
        allDay: task.allDay || false,
        category,
        completed: !!task.completed,
        extendedProps: { category, done: !!task.completed },
      };
    });
    setEvents(calendarEvents);
  }, [userEmail]);

  useEffect(() => {
    loadEventsFromStorage();
  }, [loadEventsFromStorage]);

  const handleEventClick = (info: any) => {
    const e = info.event;
    setSelectedEvent({
      id: e.id,
      title: e.title,
      start: e.startStr,
      allDay: e.allDay,
      category: e.extendedProps?.category as CategoryKey,
      completed: Boolean(e.extendedProps?.done),
      extendedProps: {
        category: e.extendedProps?.category as CategoryKey,
        done: Boolean(e.extendedProps?.done),
      },
    });
  };

  const handleToggleComplete = () => {
    if (!selectedEvent) return;
    const idNum = Number(selectedEvent.id);
    const res = toggleTaskCompleted(userEmail, idNum);
    if (!res.success) {
      console.error("Failed to toggle task completion:", res.error);
      return;
    }
    loadEventsFromStorage();
    setSelectedEvent(prev =>
      prev
        ? {
            ...prev,
            completed: !prev.completed,
            extendedProps: {
              ...prev.extendedProps,
              done: !prev.extendedProps.done,
            },
          }
        : prev
    );
  };

  return (
    <Container>
      <HeaderCard>
        <Brand>
          <div className="titleRow">
            <CalendarIconStyled />
            <h1 data-testid="calendar-title">Calendar</h1>
          </div>
          <p>{userEmail}</p>
        </Brand>
        <LogoutButton aria-label="Logout" type="button" onClick={onLogout}>
          <LogoutIconStyled aria-hidden="true" focusable="false" />
          <span>Log out</span>
        </LogoutButton>
      </HeaderCard>

      <Panel>
        <Inner>
          <AddTaskCard
            newTitle={newTitle}
            setNewTitle={setNewTitle}
            newDate={newDate}
            setNewDate={setNewDate}
            newTime={newTime}
            setNewTime={setNewTime}
            newAllDay={newAllDay}
            setNewAllDay={setNewAllDay}
            newCategory={newCategory}
            setNewCategory={setNewCategory}
            canSubmit={canSubmit}
            handleAddTask={handleAddTask}
          />
          <SortFilterBar
            activeCategory={activeCategory}
            statusFilter={statusFilter}
            onCategoryChange={setActiveCategory}
            onStatusChange={setStatusFilter}
          />

          <CalendarCard>
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              events={visibleEvents}
              height="auto"
              locale="en"
              buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day",
              }}
              eventDisplay="block"
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              eventClick={handleEventClick}
              eventClassNames={arg =>
                arg.event.extendedProps?.done ? ["task-done"] : []
              }
              eventTextColor="#fff"
              eventDidMount={arg => {
                // Testattribut för e2e
                arg.el.setAttribute("data-testid", "fc-event");
                arg.el.setAttribute("data-event-title", arg.event.title);

                // Cypress-vänliga attribut
                const category =
                  arg.event.extendedProps?.category ??
                  (arg.event as any).category;
                const done = Boolean(arg.event.extendedProps?.done);
                if (category)
                  arg.el.setAttribute("data-category", String(category));
                arg.el.setAttribute("data-done", String(done));
              }}
            />
          </CalendarCard>
        </Inner>
      </Panel>

      {selectedEvent && (
        <TaskOverlay
          event={toTaskFromCalendar({
            ...selectedEvent,
            category: selectedEvent.category ?? "personal",
          })}
          onClose={() => setSelectedEvent(null)}
          onSave={patch => {
            // Om kategorin ändras, uppdatera också färgen
            const updatedPatch = { ...patch };
            if (patch.category) {
              updatedPatch.color =
                CATEGORY_COLORS[patch.category as CategoryKey];
            }

            updateTask(userEmail, Number(selectedEvent.id), updatedPatch);

            setEvents(prev =>
              prev.map(ev => {
                if (ev.id !== selectedEvent.id) return ev;
                const nextTask: Task = {
                  ...toTaskFromCalendar({
                    ...ev,
                    category: ev.category ?? "personal",
                  }),
                  ...updatedPatch,
                };
                return toCalendarFromTask(nextTask);
              })
            );

            setSelectedEvent(null);
            loadEventsFromStorage();
          }}
          onToggleComplete={handleToggleComplete}
          onDelete={() => {
            if (!selectedEvent) return;

            const res = deleteTask(userEmail, Number(selectedEvent.id));
            if (!res.success) {
              console.error("Failed to delete task:", res.error);
              return;
            }

            setEvents(prev => prev.filter(ev => ev.id !== selectedEvent.id));
            setSelectedEvent(null);

            loadEventsFromStorage();
          }}
        />
      )}
    </Container>
  );
}

const styled = styledComponents.default;

const Container = styled.div`
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(135deg, #011957 0%, #214e9c 100%);
  font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto,
    "Helvetica Neue", Arial;
`;

const HeaderCard = styled.header`
  padding: 24px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    margin: 0;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.2px;
  }

  p {
    margin: 2px 0 0 0;
    opacity: 0.9;
    font-size: 13px;
  }
`;

const Brand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  .titleRow {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h1 {
    margin: 0;
    font-size: 40px;
    font-weight: 800;
    color: #fff;
  }

  p {
    margin: 0;
    font-size: 20px;
    color: #fff;
    opacity: 0.9;
  }
`;

const CalendarIconStyled = styled(CalendarIcon)`
  width: 40px;
  height: 40px;
  color: #fff;
`;

const LogoutIconStyled = styled(LogOutIcon)`
  width: 18px;
  height: 18px;
`;

const LogoutButton = styled.button`
  background: #fff;
  color: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 12px;
  padding: 8px 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    transform: translateY(-1px);
  }
`;

const Panel = styled.section`
  margin-top: 18px;
  background: linear-gradient(200deg, #39318c 0%, #f0b3da 100%);
  padding: 8px;
  border-radius: 24px;
  box-shadow: 0 10px 30px rgba(2, 8, 23, 0.2);
`;

const Inner = styled.div`
  background: var(--surface);
  border-radius: var(--radius-2xl);
  padding: 18px;
  border: 1px solid var(--ring);
`;

const CalendarCard = styled.div`
  margin-top: 14px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 10px;
  box-shadow: 0 4px 20px rgba(2, 8, 23, 0.06);

  .fc {
    --fc-border-color: #eef2f6;
    --fc-page-bg-color: #ffffff;
    --fc-neutral-bg-color: #f8fafc;
    --fc-today-bg-color: rgba(33, 78, 156, 0.06);
    --fc-now-indicator-color: #214e9c;
    --fc-event-text-color: #fff;
    --fc-small-font-size: 12px;
    --chip-radius: 10px;
  }

  /* ——— Befintlig strikethrough, behåll ——— */
  /* .task-done,
.task-done .fc-event-main,
.task-done .fc-event-title,
.task-done .fc-event-main-frame,
.task-done .fc-daygrid-event,
.task-done .fc-timegrid-event {
  text-decoration: line-through !important;
} */

  /* ——— NY STYLING: gör completed tydligare, endast CSS ——— */
  .task-done {
    position: relative;
    opacity: 0.6;
    filter: grayscale(0.15);
  }

  .task-done .fc-event-title::before {
    content: "✔";
    font-weight: 900;
    margin-right: 6px;
    display: inline-block;
    transform: translateY(-1px);
    color: #000000ff;
  }

  .task-done::after {
    content: "";
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.14) 0 6px,
      rgba(255, 255, 255, 0) 6px 12px
    );
    border-radius: inherit;
  }

  .task-done .fc-event-title,
  .task-done .fc-event-time {
    color: #ffffff !important;
  }

  .fc .fc-toolbar.fc-header-toolbar {
    padding: 10px 12px 12px;
    gap: 12px;
  }
  .fc .fc-toolbar-title {
    font-size: 18px;
    font-weight: 700;
    color: #0f172a;
    letter-spacing: 0.2px;
  }
  .fc .fc-toolbar-chunk:last-child {
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 4px;
    display: inline-flex;
    gap: 4px;
  }
  .fc .fc-button {
    border: 0;
    border-radius: 8px;
    padding: 6px 12px;
    font-weight: 600;
    background: #f1f5f9;
    color: #0f172a;
  }
  .fc .fc-button-primary:not(:disabled).fc-button-active {
    background: #111827;
    color: #fff;
  }
  .fc .fc-today-button {
    border-radius: 999px;
    padding: 4px 10px;
    font-weight: 700;
    background: #111827;
    color: #fff;
  }

  .fc .fc-col-header-cell {
    background: #fff;
    border-bottom: 1px solid #eef2f6;
  }
  .fc .fc-col-header-cell-cushion {
    padding: 10px 8px;
    font-weight: 700;
    color: #334155;
  }
  .fc .fc-timegrid-axis-cushion {
    color: #94a3b8;
    font-weight: 600;
  }

  .fc .fc-timegrid-slot {
    background-image: linear-gradient(to right, transparent 0 100%),
      repeating-linear-gradient(
        to bottom,
        transparent 0,
        transparent 44px,
        rgba(148, 163, 184, 0.1) 44px,
        rgba(148, 163, 184, 0.1) 45px
      );
  }
  .fc-day-sat .fc-timegrid-col-frame,
  .fc-day-sun .fc-timegrid-col-frame,
  .fc-day-sat,
  .fc-day-sun {
    background: #fafafa;
  }

  .fc .fc-event,
  .fc .fc-timegrid-event {
    border: 0;
    box-shadow: 0 6px 14px rgba(2, 8, 23, 0.15);
    font-weight: 700;
    margin-bottom: 2px;
  }
  .fc .fc-timegrid-event-harness-inset .fc-timegrid-event {
    margin: 4px 6px;
  }
  .fc .fc-daygrid-event {
    padding: 6px 8px;
    font-weight: 700;
    color: var(--fc-event-text-color) !important;
  }
  .fc .fc-event:hover {
    filter: brightness(1.03);
    transform: translateY(-1px);
  }
`;
