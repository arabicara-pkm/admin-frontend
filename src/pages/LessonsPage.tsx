/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-useless-catch */
"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getLessonsByLevel,
  createLesson,
  updateLesson,
  deleteLesson,
} from "../services/api";
import type { Lesson } from "../types";

// Import komponen UI
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { LessonModal } from "../components/LessonModal";
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
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  Loader2,
  Volume2,
} from "lucide-react";

export const LessonsPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState<Lesson | null>(null);

  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchLessons = useCallback(async () => {
    if (!levelId) return;
    setIsLoading(true);
    setError(null);
    try {
      const numericLevelId = parseInt(levelId, 10);
      const data = await getLessonsByLevel(numericLevelId);
      setLessons(
        (data || []).sort(
          (a: { order: number }, b: { order: number }) => a.order - b.order
        )
      );
    } catch {
      setError("Failed to fetch lessons.");
    } finally {
      setIsLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);

  const playAudio = (url: string, id: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (playingId === id) {
      setPlayingId(null);
      return;
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingId(id);
    audio.play().catch(() => setPlayingId(null));
    audio.onended = () => setPlayingId(null);
  };

  const handleSave = async (data: any) => {
    try {
      if (modalMode === "add") {
        await createLesson(data);
      } else if (selectedLesson) {
        await updateLesson(selectedLesson.id, data);
      }
      setIsModalOpen(false);
      await fetchLessons();
    } catch (err) {
      throw err; // Lempar error agar ditangkap modal
    }
  };

  const confirmDelete = async () => {
    if (!lessonToDelete) return;
    try {
      await deleteLesson(lessonToDelete.id);
      await fetchLessons();
    } catch {
      setError("Failed to delete lesson.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading)
    return (
      <div className="flex h-full w-full items-center justify-center p-16">
        <LoadingSpinner />
      </div>
    );
  if (error)
    return (
      <div className="flex h-full w-full items-center justify-center p-16 text-red-600">
        {error}
      </div>
    );

  const maxSequence = Math.max(0, ...lessons.map((lesson) => lesson.sequence));
  const nextSequence = maxSequence + 1;

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/levels")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Lessons</h1>
            <p className="text-gray-600 mt-1">Manage lessons for this level.</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setModalMode("add");
            setSelectedLesson(null);
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Add New Lesson
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.length === 0 ? (
          <div className="col-span-full text-center p-12 border-2 border-dashed rounded-lg">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No Lessons Found</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new lesson.
            </p>
          </div>
        ) : (
          lessons.map((lesson) => (
            <Card key={lesson.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle>
                    {lesson.sequence}. {lesson.title}
                  </CardTitle>
                  <div className="-mr-2 -mt-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={!lesson.voicePath}
                            onClick={() =>
                              playAudio(
                                lesson.voicePath!,
                                `lesson-${lesson.id}`
                              )
                            }
                          >
                            {playingId === `lesson-${lesson.id}` ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Volume2 className="h-4 w-4" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Play Audio</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setModalMode("edit");
                              setSelectedLesson(lesson);
                              setIsModalOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600"
                            onClick={() => {
                              setLessonToDelete(lesson);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <CardDescription className="line-clamp-3">
                  {lesson.content}
                </CardDescription>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {levelId && (
        <LessonModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          lesson={selectedLesson}
          mode={modalMode}
          levelId={parseInt(levelId, 10)}
          defaultSequence={nextSequence}
        />
      )}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the lesson "{lessonToDelete?.title}".
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
