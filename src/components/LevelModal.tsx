/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/Dialog";
import { Checkbox } from "./ui/checkbox";
import { Card, CardContent, CardHeader } from "./ui/Card";
import { PlusCircle, Trash2 } from "lucide-react";
import type { Level, Exercise } from "../types";
import { AxiosError } from "axios";

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  // onSave akan menangani logika penyimpanan yang kompleks
  onSave: (
    levelData: any,
    exercisesData: Exercise[],
    exercisesToDelete: number[]
  ) => Promise<void>;
  level: Level | null;
  mode: "add" | "edit";
}

const initialExerciseState: Exercise = {
  question: "",
  choices: [
    { text: "", isCorrect: true },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
    { text: "", isCorrect: false },
  ],
};

export const LevelModal: React.FC<LevelModalProps> = ({
  isOpen,
  onClose,
  onSave,
  level,
  mode,
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState(0);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [exercisesToDelete, setExercisesToDelete] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mode === "edit" && level) {
      setName(level.name);
      setDescription(level.description);
      setSequence(level.sequence);
      setExercises(level.exercises || []);
    } else {
      // Reset form untuk mode 'add'
      setName("");
      setDescription("");
      setSequence(0);
      setExercises([initialExerciseState]);
    }
    setExercisesToDelete([]); // Selalu reset daftar exercise yang akan dihapus
    setError(null);
  }, [isOpen, mode, level]);

  // Handler untuk mengubah data Exercise
  const handleExerciseChange = (exIndex: number, value: string) => {
    const newExercises = [...exercises];
    newExercises[exIndex].question = value;
    setExercises(newExercises);
  };

  // Handler untuk mengubah data Answer Choice
  const handleAnswerChange = (
    exIndex: number,
    ansIndex: number,
    field: "text" | "isCorrect",
    value: string | boolean
  ) => {
    const newExercises = [...exercises];
    const targetChoice = newExercises[exIndex].choices[ansIndex];
    (targetChoice as any)[field] = value;

    // Pastikan hanya satu jawaban yang benar (logika radio button)
    if (field === "isCorrect" && value === true) {
      newExercises[exIndex].choices.forEach((choice, i) => {
        if (i !== ansIndex) choice.isCorrect = false;
      });
    }
    setExercises(newExercises);
  };

  const addExercise = () => setExercises([...exercises, initialExerciseState]);

  const removeExercise = (exIndex: number) => {
    const exerciseToRemove = exercises[exIndex];
    // Jika exercise sudah ada di database (memiliki id), tandai untuk dihapus
    if (exerciseToRemove.id) {
      setExercisesToDelete([...exercisesToDelete, exerciseToRemove.id]);
    }
    setExercises(exercises.filter((_, i) => i !== exIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const levelData = { name, description, sequence };
      await onSave(levelData, exercises, exercisesToDelete);
      onClose();
    } catch (err) {
      let errorMessage = "An unexpected error occurred."; // Pesan default akhir

      if (err instanceof AxiosError && err.response) {
        errorMessage =
          err.response.data.message || "Failed to save due to a server error.";
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Level" : "Edit Level"}
            </DialogTitle>
          </DialogHeader>
          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="py-4 max-h-[75vh] overflow-y-auto pr-4 space-y-6">
            {/* Form Level */}
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="space-y-2">
                  <Label>Level Name</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sequence</Label>
                  <Input
                    type="number"
                    value={sequence}
                    onChange={(e) => setSequence(Number(e.target.value))}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Form Exercises */}
            <div className="space-y-4">
              <Label className="text-lg font-semibold">
                Multiple Choice Exercises
              </Label>
              {exercises.map((ex, exIndex) => (
                <Card key={exIndex}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <h3 className="font-medium">Question {exIndex + 1}</h3>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeExercise(exIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Question Text</Label>
                      <Input
                        value={ex.question}
                        onChange={(e) =>
                          handleExerciseChange(exIndex, e.target.value)
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Answer Choices (check the correct one)</Label>
                      {ex.choices?.map((ans, ansIndex) => (
                        <div key={ansIndex} className="flex items-center gap-2">
                          <Checkbox
                            checked={ans.isCorrect}
                            onCheckedChange={(c: any) =>
                              handleAnswerChange(
                                exIndex,
                                ansIndex,
                                "isCorrect",
                                !!c
                              )
                            }
                          />
                          <Input
                            placeholder={`Answer ${ansIndex + 1}`}
                            value={ans.text}
                            onChange={(e) =>
                              handleAnswerChange(
                                exIndex,
                                ansIndex,
                                "text",
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
              <Button type="button" variant="secondary" onClick={addExercise}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add Exercise
              </Button>
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
