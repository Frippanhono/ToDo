import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
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
      <Header>
        <div>
          <h1 data-testid="calendar-title">📅 Calendar</h1>
          <p>{userEmail}</p>
        </div>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>

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
        eventTimeFormat={{ hour: "2-digit", minute: "2-digit", hour12: false }}
        eventTextColor="#fff"
        eventClick={handleEventClick}
        eventDidMount={arg => {
          // ADDED: tona ner & strike-through om done
          if (arg.event.extendedProps?.done) {
            arg.el.style.textDecoration = "line-through";
            arg.el.style.opacity = "0.8";
          }
        }}
      />
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
  padding: 20px;
  background-color: #f5f5f5;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  div {
    h1 {
      margin: 0;
      color: #333;
    }

    p {
      margin: 5px 0 0 0;
      color: #666;
      font-size: 14px;
    }
  }
`;

const LogoutButton = styled.button`
  padding: 8px 16px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #c82333;
  }
`;
