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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Alert, AlertDescription } from "../components/ui/Alert";
import type { Vocabulary } from "../types";

interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Vocabulary, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  vocabulary?: Vocabulary | null;
  mode: "add" | "edit";
}

const categories = [
  "Greetings",
  "Objects",
  "Colors",
  "Numbers",
  "Family",
  "Food",
  "Animals",
  "Verbs",
  "Adjectives",
];

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vocabulary,
  mode,
}) => {
  const [formData, setFormData] = useState({
    arabicText: "",
    indonesianText: "",
    category: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (vocabulary && mode === "edit") {
      setFormData({
        arabicText: vocabulary.arabicText,
        indonesianText: vocabulary.indonesianText,
        category: vocabulary.category,
      });
    } else {
      setFormData({
        arabicText: "",
        indonesianText: "",
        category: "",
      });
    }
    setError("");
  }, [vocabulary, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await onSave(formData);
      onClose();
    } catch {
      setError("Failed to save vocabulary");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Vocabulary" : "Edit Vocabulary"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="arabicText">Arabic Text</Label>
            <Input
              id="arabicText"
              value={formData.arabicText}
              onChange={(e) =>
                setFormData({ ...formData, arabicText: e.target.value })
              }
              placeholder="Enter Arabic text"
              required
              disabled={isLoading}
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="indonesianText">Indonesian Text</Label>
            <Input
              id="indonesianText"
              value={formData.indonesianText}
              onChange={(e) =>
                setFormData({ ...formData, indonesianText: e.target.value })
              }
              placeholder="Enter Indonesian translation"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
                ? "Add Vocabulary"
                : "Update Vocabulary"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
