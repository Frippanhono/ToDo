import dayGridPlugin from "@fullcalendar/daygrid";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import React, { useEffect, useState } from "react";
import * as styledComponents from "styled-components";

import userTasksData from "../Data/user_tasks.json";

interface CalendarViewProps {
  userEmail: string;
  onLogout: () => void;
}

export default function CalendarView({
  userEmail,
  onLogout,
}: CalendarViewProps) {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = userTasksData.find(
      user => user.email.toLowerCase() === userEmail.toLowerCase()
    );

    if (currentUser) {
      const calendarEvents = currentUser.tasks.map(task => ({
        id: task.id.toString(),
        title: task.title,
        start: task.allDay
          ? task.date
          : `${task.date}T${task.time || "09:00"}:00`,
        backgroundColor: task.completed ? "#28a745" : "#007bff",
        allDay: task.allDay || false,
      }));
      setEvents(calendarEvents);
    }
  }, [userEmail]);

  return (
    <Container>
      <Header>
        <div>
          <h1>📅 Calendar</h1>
          <p>{userEmail}</p>
        </div>
        <LogoutButton onClick={onLogout}>Logout</LogoutButton>
      </Header>

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        events={events}
        height="auto"
        locale="en"
        buttonText={{
          today: "Today",
          month: "Month",
          week: "Week",
          day: "Day",
        }}
      />
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
