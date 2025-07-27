/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/Dialog";
import type { Lesson } from "../types";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  lesson: Lesson | null;
  mode: "add" | "edit";
  levelId: number;
}

export const LessonModal: React.FC<LessonModalProps> = ({
  isOpen,
  onClose,
  onSave,
  lesson,
  mode,
  levelId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    sequence: 0,
    levelId: levelId,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mode === "edit" && lesson) {
      setFormData({
        title: lesson.title,
        content: lesson.content,
        sequence: lesson.sequence,
        levelId: lesson.levelId,
      });
    } else {
      setFormData({ title: "", content: "", sequence: 0, levelId: levelId });
    }
    setError(null);
  }, [isOpen, mode, lesson, levelId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "sequence" ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      const dataToSend: any = {
        title: formData.title,
        content: formData.content,
        sequence: formData.sequence,
      };
      if (mode === "add") {
        dataToSend.level_id = formData.levelId;
      }

      await onSave(dataToSend);
      onClose();
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred while saving."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Lesson" : "Edit Lesson"}
            </DialogTitle>
            <DialogDescription>
              Fill in the lesson details. Content can be written in Markdown.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown supported)</Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                rows={10}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sequence">sequence</Label>
              <Input
                id="sequence"
                name="sequence"
                type="number"
                value={formData.sequence}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
