"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Task {
  id?: number;
  title: string;
  description?: string;
}

interface TaskDialogProps {
  mode?: "add" | "edit";
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
}

export default function TaskDialog({ mode = "add", task, onSubmit }: TaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (mode === "edit" && task) {
      setTitle(task.title);
      setDescription(task.description || "");
    } else {
      setTitle("");
      setDescription("");
    }
  }, [mode, task, open]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({ id: task?.id, title, description,  });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{mode === "add" ? "Add Task" : "Edit"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "add" ? "Add Task" : "Edit Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>
          <Button className="w-full" onClick={handleSubmit}>
            {mode === "add" ? "Add" : "Update"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
