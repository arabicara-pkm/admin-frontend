"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/Dialog";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Alert, AlertDescription } from "../components/ui/Alert";
import type { Level } from "../types";

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Level, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  level?: Level | null;
  mode: "add" | "edit";
}

export const LevelModal: React.FC<LevelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  level,
  mode,
}) => {
  const [formData, setFormData] = useState({
    levelName: "",
    description: "",
    order: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (level && mode === "edit") {
      setFormData({
        levelName: level.levelName,
        description: level.description,
        order: level.order,
      });
    } else {
      setFormData({
        levelName: "",
        description: "",
        order: 1,
      });
    }
    setError("");
  }, [level, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await onSave(formData);
      onClose();
    } catch {
      setError("Failed to save level");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Level" : "Edit Level"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="levelName">Level Name</Label>
            <Input
              id="levelName"
              value={formData.levelName}
              onChange={(e) =>
                setFormData({ ...formData, levelName: e.target.value })
              }
              placeholder="e.g., Beginner, Intermediate, Advanced"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Brief description of this level"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Order</Label>
            <Input
              id="order"
              type="number"
              min="1"
              value={formData.order}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  order: Number.parseInt(e.target.value) || 1,
                })
              }
              required
              disabled={isLoading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? "Saving..."
                : mode === "add"
                ? "Add Level"
                : "Update Level"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
