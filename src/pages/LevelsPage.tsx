/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-catch */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLevelWithExercises,
  createLevel,
  updateLevel,
  deleteLevel,
  deleteExercise,
  updateExercise,
  createExercise,
  getLevels,
} from "../services/api";
import type { Exercise, Level } from "../types";

// Import komponen UI
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { LevelModal } from "../components/LevelModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";

// Import Ikon
import { Plus, Edit, Trash2, BookOpen, GraduationCap } from "lucide-react";

export const LevelsPage: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [levelToDelete, setLevelToDelete] = useState<Level | null>(null);

  const navigate = useNavigate();

  const fetchLevels = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLevels();
      setLevels(
        (data || []).sort(
          (a: { sequence: number }, b: { sequence: number }) =>
            a.sequence - b.sequence
        )
      );
    } catch {
      setError("Failed to fetch levels");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLevels();
  }, [fetchLevels]);

  const handleAddLevel = () => {
    setModalMode("add");
    setSelectedLevel(null);
    setIsModalOpen(true);
  };

  const handleEditLevel = async (level: Level) => {
    try {
      // Ambil data level lengkap dengan exercises-nya sebelum membuka modal
      const fullLevelData = await getLevelWithExercises(level.id);
      setSelectedLevel(fullLevelData);
      setModalMode("edit");
      setIsModalOpen(true);
    } catch {
      setError("Failed to fetch level details.");
    }
  };

  const handleSaveLevel = async (
    levelData: Omit<Level, "id" | "createdAt" | "updatedAt">,
    exercisesData: Exercise[],
    exercisesToDelete: number[]
  ) => {
    let savedLevel = selectedLevel;

    if (modalMode === "add") {
      savedLevel = await createLevel(levelData);
    } else if (selectedLevel) {
      savedLevel = await updateLevel(selectedLevel.id, levelData);
    }

    if (!savedLevel) throw new Error("Failed to save level data.");

    await Promise.all(exercisesToDelete.map((exId) => deleteExercise(exId)));

    await Promise.all(
      exercisesData.map((ex) => {
        const exercisePayload = {
          question: ex.question,
          type: "Pilihan Ganda", // Tipe selalu Pilihan Ganda
          levelId: savedLevel.id,
          choices: ex.choices.map(({ id, ...choice }) => choice), // Kirim answer choices tanpa id
        };

        return ex.id
          ? updateExercise(ex.id, exercisePayload)
          : createExercise(exercisePayload);
      })
    );

    await fetchLevels(); // Muat ulang semua data di halaman
  };

  const openDeleteDialog = (level: Level) => {
    setLevelToDelete(level);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!levelToDelete) return;
    try {
      await deleteLevel(levelToDelete.id);
      await fetchLevels(); // Muat ulang data setelah delete
    } catch {
      setError("Failed to delete level");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const handleManageLessons = (levelId: number) => {
    navigate(`/levels/${levelId}/lessons`);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        {error}
      </div>
    );

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Levels & Lessons
          </h1>
          <p className="text-gray-600 mt-1">
            Manage learning levels and their associated materials.
          </p>
        </div>
        <Button onClick={handleAddLevel} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Level
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.length === 0 ? (
          <div className="col-span-full">
            <div className="text-center p-12 border-2 border-dashed rounded-lg">
              <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium">No levels found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new level.
              </p>
              <Button onClick={handleAddLevel} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Add First Level
              </Button>
            </div>
          </div>
        ) : (
          levels.map((level) => (
            <Card key={level.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{level.name}</CardTitle>
                  <TooltipProvider>
                    <div className="flex items-center -mr-2 -mt-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEditLevel(level)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit Level</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => openDeleteDialog(level)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete Level</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
                <p className="text-sm text-gray-600 pt-1">
                  {level.description}
                </p>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-end">
                <div className="text-xs text-gray-500">
                  Order: {level.sequence}
                </div>
                <Button
                  onClick={() => handleManageLessons(level.id)}
                  className="w-full mt-4"
                  variant="outline"
                >
                  <BookOpen className="h-4 w-4 mr-2" /> Manage Lessons
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <LevelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLevel}
        level={selectedLevel}
        mode={modalMode}
      />
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the level{" "}
              <span className="font-bold">"{levelToDelete?.name}"</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
