// src/components/TaskList.tsx
import React, { useState } from "react";

import { deleteTask, toggleTaskCompleted } from "@/components/tests/tasks/Task";
import { type DatedTask } from "@/utils/Tasklist";

import TaskCard from "./TaskCard";

export default function TaskList() {
  const [tasks, setTasks] = useState<DatedTask[]>([
    { id: 1, title: "Handla", completed: false, date: new Date("2025-09-23") },
    { id: 2, title: "Städa", completed: true, date: new Date("2025-09-22") },
  ]);

  const handleToggle = (id: number) =>
    setTasks(prev => toggleTaskCompleted(prev, id));

  const handleDelete = (id: number) => setTasks(prev => deleteTask(prev, id));

  return (
    <div role="list">
      {tasks.map(t => (
        <TaskCard
          key={t.id}
          task={t}
          onToggle={handleToggle}
          onDelete={handleDelete}
          // om du vill stödja inline-rename senare:
          // onRename={handleRename}
        />
      ))}
    </div>
  );
}
