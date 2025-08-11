"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TaskDialog from "@/components/TaskDialog";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); 

        if (!token) {
          setError("No token found. Please log in first.");
          setLoading(false);
          return;
        }

        // const res = await axios.get("http://localhost:3333/api/tasks", {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // });

        const res = await axios.get("http://localhost:3333/api/tasks", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

console.log("Tasks API Response:", res.data);

if (Array.isArray(res.data)) {
  setTasks(res.data);
} else if (Array.isArray(res.data.data)) {
  setTasks(res.data.data);
} else {
  setError("Unexpected API response format");
}

      } catch (err) {
        setError("Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>
<TaskDialog
  mode="add"
  onSubmit={(newTask) => {
    setTasks((prev) => [
      ...prev,
      {
        ...newTask,
        id: Date.now(), 
        completed: false 
      } as Task
    ]);
  }}
/>


      </div>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2">{task.id}</td>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description || "-"}</td>
                <td className="border px-4 py-2">
                  {task.completed ? "✅ Completed" : "⏳ Pending"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
