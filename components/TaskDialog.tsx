"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface Task {
  id: number;
  title: string;
  description?: string;
  isCompleted: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

interface TaskDialogProps {
  open: boolean;
  mode: "add" | "edit";
  task?: Task;
  onClose: () => void;
  onSubmit: (taskData: Partial<Task>) => void;
}

export default function TaskDialog({ open, mode, task, onClose, onSubmit }: TaskDialogProps) {
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
  }, [mode, task]);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onSubmit({
      id: task?.id,
      title,
      description,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
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
