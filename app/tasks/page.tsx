"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import TaskDialog, { Task } from "@/components/TaskDialog";
import { Button } from "@/components/ui/button";
import { DeleteManyTasksDialog } from "@/components/DeleteManyTasksDialog";
import { useRouter } from "next/navigation";

export default function TaskListPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>();
   const [isLoggedIn, setIsLoggedIn] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const fetchTasks = async () => {
    try {
      if (!token) {
        setError("No token found. Please log in first.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3333/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTasks(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

    const handleCheckboxChange = (taskId: number) => {
    setSelectedIds((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  const handleDeleteMany = async () => {
    if (selectedIds.length === 0) {
      alert("Please select at least one task.");
      return;
    }
    try {
      const res = await axios.delete("http://localhost:3333/api/tasks/bulk-delete", {
        headers: { Authorization: `Bearer ${token}` },
        data: { ids: selectedIds },
      });
      alert(res.data.message);
      fetchTasks();
      setSelectedIds([]);
    } catch {
      alert("Failed to delete selected tasks");
    }
  };

  const handleAdd = () => {
    setDialogMode("add");
    setTaskToEdit(undefined);
    setDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setDialogMode("edit");
    setTaskToEdit(task);
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3333/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch {
      alert("Failed to delete task");
    }
  };

  const handleSave = async (taskData: Partial<Task>) => {
    try {
      if (dialogMode === "add") {
        await axios.post("http://localhost:3333/api/tasks", taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(`http://localhost:3333/api/tasks/${taskData.id}`, taskData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      fetchTasks();
    } catch {
      alert("Failed to save task");
    }
  };

  //logout logic
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    if (token) {
      await axios.delete("http://localhost:3333/api/logout", {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    // Clear localStorage regardless
    localStorage.removeItem("token");

    setIsLoggedIn(false); //update status

    // Redirect to login page
    router.push("/auth/login");
  } catch (error) {
    console.error("Logout failed:", error);
  } finally {
    setLoading(false);
  }
};

  if (loading) return <p>Loading tasks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Task List</h1>
        <div className="space-x-2">
          <DeleteManyTasksDialog
            count={selectedIds.length}
            onConfirm={handleDeleteMany}
            trigger={
            <Button
              variant="destructive"
              disabled={selectedIds.length === 0}
            >
              Delete Selected
            </Button>
            }
          />         
          <Button onClick={handleAdd}>Add Task</Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Select</th>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Title</th>
              <th className="border px-4 py-2">Description</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id}>
                <td className="border px-4 py-2 text-center">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(task.id)}
                    onChange={() => handleCheckboxChange(task.id)}
                  />
                </td>
                <td className="border px-4 py-2">{task.id}</td>
                <td className="border px-4 py-2">{task.title}</td>
                <td className="border px-4 py-2">{task.description || "-"}</td>
                <td className="border px-4 py-2">
                  {task.isCompleted ? "✅ Completed" : "⏳ Pending"}
                </td>
                <td className="border px-4 py-2 space-x-2">
                  <Button size="sm" onClick={() => handleEdit(task)}>Edit</Button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <TaskDialog
        open={dialogOpen}
        mode={dialogMode}
        task={taskToEdit}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      />

      <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-500 text-white px-4 py-2 rounded"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
    </div>
  );
}
