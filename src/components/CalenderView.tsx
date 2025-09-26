import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect, useMemo, useState } from "react";
import * as styledComponents from "styled-components";

import userTasksData from "../Data/user_tasks.json";
import AddTaskCard from "./AddTaskCard";
import { CategoryKey, CATEGORY_COLORS } from "../utils/categories";

import TaskOverlay from "./TaskOverlay";
import SortFilterBar, { StatusFilter } from "./SortFilterBar";

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
  const [newCategory, setNewCategory] = useState<CategoryKey>("work"); // default: alltid giltig

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

  const isValidCategory = (val: unknown): val is CategoryKey =>
    typeof val === "string" &&
    Object.prototype.hasOwnProperty.call(CATEGORY_COLORS, val);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    const title = newTitle.trim();
    if (!title || !newDate) return;

    const id = Date.now().toString();
    const start = newAllDay || !newTime ? newDate : `${newDate}T${newTime}:00`;

    const cat: CategoryKey = newCategory;

    const newEvent = {
      id,
      title,
      start,
      backgroundColor: CATEGORY_COLORS[cat],
      allDay: newAllDay || !newTime,
      extendedProps: { category: cat, done: false },
    };

    setEvents(prev => [...prev, newEvent]);

    // reset
    setNewTitle("");
    setNewTime("");
    setNewAllDay(true);
    setNewDate(new Date().toISOString().slice(0, 10));
    setNewCategory("work"); // återställ till giltig default
  };

  // canSubmit – kräver titel och datum (kategori är alltid satt)
  const canSubmit = newTitle.trim().length > 0 && !!newDate;

  useEffect(() => {
    const currentUser = userTasksData.find(
      (user: any) => user.email.toLowerCase() === userEmail.toLowerCase()
    );

    if (currentUser) {
      const calendarEvents = currentUser.tasks.map((task: any) => {
        const raw = task.category as string | undefined;
        const category: CategoryKey = isValidCategory(raw) ? raw : "personal"; // giltig fallback
        return {
          id: task.id.toString(),
          title: task.title,
          start: task.allDay
            ? task.date
            : `${task.date}T${task.time || "09:00"}:00`,
          backgroundColor: CATEGORY_COLORS[category],
          allDay: task.allDay || false,
          extendedProps: { category },
        };
      });
      setEvents(calendarEvents);
    } else {
      setEvents([]);
    }
  }, [userEmail]);

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
    setEvents(prev =>
      prev.map((ev: any) =>
        ev.id === id ? { ...ev, title: patch.title ?? ev.title } : ev
      )
    );
  };

  const toggleComplete = (id: string) => {
    setEvents(prev =>
      prev.map((ev: any) => {
        if (ev.id !== id) return ev;
        const wasDone = ev.extendedProps?.done === true;
        const done = !wasDone;
        const category: CategoryKey = isValidCategory(
          ev.extendedProps?.category
        )
          ? (ev.extendedProps.category as CategoryKey)
          : "personal";
        return {
          ...ev,
          backgroundColor: done ? "#9ca3af" : CATEGORY_COLORS[category], // grå när klar
          extendedProps: { ...ev.extendedProps, done },
        };
      })
    );
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter((ev: any) => ev.id !== id));
  };

  return (
    <Container>
      <Header>
        <div>
          <h1>📅 Calendar</h1>
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
        onCategoryChange={setActiveCategory}
        statusFilter={statusFilter}
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
          // tona ner & strike-through om done
          if (arg.event.extendedProps?.done) {
            arg.el.style.textDecoration = "line-through";
            arg.el.style.opacity = "0.8";
          }
        }}
      />

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
