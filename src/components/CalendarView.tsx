import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Calendar as CalendarIcon, LogOutIcon } from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import * as styledComponents from "styled-components";

import {
  addTask,
  deleteTask,
  getAllTasks,
  toggleTaskCompleted,
  updateTask,
} from "../controllers/taskController";
import { CATEGORY_COLORS, CategoryKey } from "../utils/categories";
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
  const [newCategory, setNewCategory] = useState<CategoryKey>("work"); // default none

  const [selectedEvent, setSelectedEvent] = useState<{
    id: string;
    title: string;
    start: string;
    allDay: boolean;
    category: CategoryKey;
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
    if (!title || !newDate) return;

    const result = addTask(userEmail, title, {
      date: newDate,
      time: newTime || undefined,
      allDay: newAllDay || !newTime,
      category: newCategory,
    });

    if (result.success) {
      // Refresh events from localStorage
      loadEventsFromStorage();

      setNewTitle("");
      setNewTime("");
      setNewAllDay(true);
      setNewDate(new Date().toISOString().slice(0, 10));
      setNewCategory("work");
    } else {
      console.error("Failed to add task:", result.error);
    }
  };

  // canSubmit – kräv vald kategori
  const canSubmit = newTitle.trim().length > 0 && !!newDate;

  function isValidCategory(raw: string | undefined): boolean {
    return raw !== undefined && Object.keys(CATEGORY_COLORS).includes(raw);
  }

  const loadEventsFromStorage = useCallback(async () => {
    const tasks = (await getAllTasks(userEmail)) || [];
    const calendarEvents = tasks.map(task => {
      const raw = task.category as string | undefined;
      const category: CategoryKey = isValidCategory(raw)
        ? (raw as CategoryKey)
        : "personal";

      // Use gray color for completed tasks, otherwise use category color
      const backgroundColor = task.completed
        ? "#6b7280"
        : CATEGORY_COLORS[category];

      return {
        id: task.id.toString(),
        title: task.title,
        start: task.allDay
          ? task.date
          : `${task.date}T${task.time || "09:00"}:00`,
        backgroundColor,
        allDay: task.allDay || false,
        extendedProps: { category, done: task.completed },
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
    });
  };

  const saveEvent = (id: string, patch: { title?: string }) => {
    const result = updateTask(userEmail, parseInt(id), patch);
    if (result.success) {
      loadEventsFromStorage();
    } else {
      console.error("Failed to update task:", result.error);
    }
  };

  const toggleComplete = (id: string) => {
    const result = toggleTaskCompleted(userEmail, parseInt(id));
    if (result.success) {
      loadEventsFromStorage();
    } else {
      console.error("Failed to toggle task completion:", result.error);
    }
  };

  const deleteEvent = (id: string) => {
    const result = deleteTask(userEmail, parseInt(id));
    if (result.success) {
      loadEventsFromStorage();
    } else {
      console.error("Failed to delete task:", result.error);
    }
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
        <LogoutButton aria-label="Logout" onClick={onLogout} type="button">
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
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              }}
              eventTextColor="#fff"
              eventClick={handleEventClick}
              eventDidMount={arg => {
                arg.el.setAttribute("data-testid", "fc-event");
                arg.el.setAttribute("data-event-title", arg.event.title);

                // ADDED: tona ner & strike-through om done
                if (arg.event.extendedProps?.done) {
                  arg.el.style.textDecoration = "line-through";
                  arg.el.style.opacity = "0.8";
                }
              }}
            />
          </CalendarCard>
        </Inner>
      </Panel>

      {/* ADDED: overlay mountas sist i trädet */}
      {selectedEvent && (
        <TaskOverlay
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onSave={patch => {
            saveEvent(selectedEvent.id, patch);
            setSelectedEvent(null);
          }}
          onToggleComplete={() => toggleComplete(selectedEvent.id)}
          onDelete={() => {
            deleteEvent(selectedEvent.id);
            setSelectedEvent(null);
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
  flex-direction: column; /* ikon+titel på första raden, email under */
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

  /* för ikon + text */
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

  /* ------- FullCalendar base tokens ------- */
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

  /* Toolbar */
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
  /* segmenterade knappar till höger */
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

  /* ---------------- Day headers ---------------- */
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

  /* ---------------- Body + slots ---------------- */
  /* svag “zebra” i timraderna */
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

  /* helg-toning */
  .fc-day-sat .fc-timegrid-col-frame,
  .fc-day-sun .fc-timegrid-col-frame {
    background: #fafafa;
  }
  .fc-day-sat,
  .fc-day-sun {
    background: #fafafa;
  }

  /* ---------------- Events (chips) ---------------- */
  .fc .fc-event,
  .fc .fc-timegrid-event {
    border: 0;
    box-shadow: 0 6px 14px rgba(2, 8, 23, 0.15);
    font-weight: 700;
    margin-bottom: 2px; /* lite avstånd mellan flera events på samma dag/timme */
  }
  .fc .fc-timegrid-event-harness-inset .fc-timegrid-event {
    margin: 4px 6px; /* lite luft runt */
  }
  .fc .fc-daygrid-event {
    padding: 6px 8px;
    font-weight: 700;
    color: var(--fc-event-text-color) !important;
  }
  /* Hover/focus lyft */
  .fc .fc-event:hover {
    filter: brightness(1.03);
    transform: translateY(-1px);
  }
`;
