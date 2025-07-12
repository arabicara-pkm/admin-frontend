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
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import type { Material, Exercise } from "../types";
import { Plus, Trash2 } from "lucide-react";

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    data: Omit<Material, "id" | "createdAt" | "updatedAt">
  ) => Promise<void>;
  material?: Material | null;
  mode: "add" | "edit";
  levelId: string;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  isOpen,
  onClose,
  onSave,
  material,
  mode,
  levelId,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "lesson" as "lesson" | "exercise" | "quiz",
    order: 1,
    exercises: [] as Omit<
      Exercise,
      "id" | "materialId" | "createdAt" | "updatedAt"
    >[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (material && mode === "edit") {
      setFormData({
        title: material.title,
        content: material.content,
        type: material.type,
        order: material.order,
        exercises: material.exercises.map((ex) => ({
          question: ex.question,
          type: ex.type,
          choices: ex.choices,
        })),
      });
    } else {
      setFormData({
        title: "",
        content: "",
        type: "lesson",
        order: 1,
        exercises: [],
      });
    }
    setError("");
  }, [material, mode, isOpen]);

  const addExercise = () => {
    const newExercise = {
      question: "",
      type: "multiple_choice" as const,
      choices: [
        { id: "1", text: "", isCorrect: false, order: 1 },
        { id: "2", text: "", isCorrect: false, order: 2 },
        { id: "3", text: "", isCorrect: false, order: 3 },
        { id: "4", text: "", isCorrect: false, order: 4 },
      ],
    };
    setFormData({
      ...formData,
      exercises: [...formData.exercises, newExercise],
    });
  };

  const removeExercise = (index: number) => {
    setFormData({
      ...formData,
      exercises: formData.exercises.filter((_, i) => i !== index),
    });
  };

  const updateExercise = (
    index: number,
    field: keyof Omit<Exercise, "id" | "materialId" | "createdAt" | "updatedAt">,
    value: string | string[] | { id: string; text: string; isCorrect: boolean; order: number }[]
  ) => {
    const updatedExercises = [...formData.exercises];
    updatedExercises[index] = { ...updatedExercises[index], [field]: value };
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const updateChoice = (
    exerciseIndex: number,
    choiceIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const updatedExercises = [...formData.exercises];
    const updatedChoices = [...updatedExercises[exerciseIndex].choices];
    updatedChoices[choiceIndex] = {
      ...updatedChoices[choiceIndex],
      [field]: value,
    };

    // If marking as correct, unmark others
    if (field === "isCorrect" && value === true) {
      updatedChoices.forEach((choice, i) => {
        if (i !== choiceIndex) choice.isCorrect = false;
      });
    }

    updatedExercises[exerciseIndex].choices = updatedChoices;
    setFormData({ ...formData, exercises: updatedExercises });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const materialData = {
        ...formData,
        levelId,
        exercises: formData.exercises.map((ex) => ({
          ...ex,
          id: Date.now().toString() + Math.random(),
          materialId: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })),
      };
      await onSave(materialData);
      onClose();
    } catch {
      setError("Failed to save material");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Add New Material" : "Edit Material"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Material title"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Input
              id="content"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              placeholder="Material content description"
              required
              disabled={isLoading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "lesson" | "exercise" | "quiz") =>
                  setFormData({ ...formData, type: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lesson">Lesson</SelectItem>
                  <SelectItem value="exercise">Exercise</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                </SelectContent>
              </Select>
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
          </div>

          {/* Exercises Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Exercises</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addExercise}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            </div>

            {formData.exercises.map((exercise, exerciseIndex) => (
              <Card key={exerciseIndex}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Exercise {exerciseIndex + 1}
                    </CardTitle>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeExercise(exerciseIndex)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <Label>Question</Label>
                    <Input
                      value={exercise.question}
                      onChange={(e) =>
                        updateExercise(
                          exerciseIndex,
                          "question",
                          e.target.value
                        )
                      }
                      placeholder="Enter question"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Answer Choices</Label>
                    {exercise.choices.map((choice, choiceIndex) => (
                      <div
                        key={choiceIndex}
                        className="flex items-center gap-2"
                      >
                        <Input
                          value={choice.text}
                          onChange={(e) =>
                            updateChoice(
                              exerciseIndex,
                              choiceIndex,
                              "text",
                              e.target.value
                            )
                          }
                          placeholder={`Choice ${choiceIndex + 1}`}
                          className="flex-1"
                        />
                        <label className="flex items-center gap-2">
                          <input
                            type="radio"
                            name={`correct-${exerciseIndex}`}
                            checked={choice.isCorrect}
                            onChange={(e) =>
                              updateChoice(
                                exerciseIndex,
                                choiceIndex,
                                "isCorrect",
                                e.target.checked
                              )
                            }
                          />
                          <span className="text-sm">Correct</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
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
                ? "Add Material"
                : "Update Material"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
