"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { LevelModal } from "../components/LevelModal";
import { getLevels, createLevel } from "../services/api";
import type { Level } from "../types";
import { Plus, Edit, Trash2, BookOpen, GraduationCap } from "lucide-react";

export const LevelsPage: React.FC = () => {
  const [levels, setLevels] = useState<Level[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      const data = await getLevels();
      setLevels(data.sort((a, b) => a.order - b.order));
    } catch {
      setError("Failed to fetch levels");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLevel = () => {
    setModalMode("add");
    setSelectedLevel(null);
    setIsModalOpen(true);
  };

  const handleEditLevel = (level: Level) => {
    setModalMode("edit");
    setSelectedLevel(level);
    setIsModalOpen(true);
  };

  const handleDeleteLevel = async (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this level? This will also delete all associated materials."
      )
    ) {
      try {
        // await deleteLevel(id)
        setLevels(levels.filter((item) => item.id !== id));
      } catch {
        setError("Failed to delete level");
      }
    }
  };

  const handleSaveLevel = async (
    data: Omit<Level, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (modalMode === "add") {
        const newLevel = await createLevel(data);
        setLevels([...levels, newLevel].sort((a, b) => a.order - b.order));
      } else if (selectedLevel) {
        // const updatedLevel = await updateLevel(selectedLevel.id, data)
        // setLevels(levels.map((item) => (item.id === selectedLevel.id ? updatedLevel : item)))
      }
    } catch {
      throw new Error("Failed to save level");
    }
  };

  const handleManageMaterials = (levelId: string) => {
    navigate(`/levels/${levelId}/materials`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Levels & Materials
          </h1>
          <p className="text-gray-600 mt-2">
            Manage learning levels and their associated materials
          </p>
        </div>
        <Button onClick={handleAddLevel} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Level
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {levels.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <GraduationCap className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No levels created yet
                </h3>
                <p className="text-gray-500 text-center mb-4">
                  Create your first learning level to start organizing your
                  content
                </p>
                <Button onClick={handleAddLevel}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Level
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          levels.map((level) => (
            <Card key={level.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{level.levelName}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {level.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLevel(level)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLevel(level.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Order: {level.order}</span>
                    <span>
                      Created: {new Date(level.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <Button
                    onClick={() => handleManageMaterials(level.id)}
                    className="w-full"
                    variant="outline"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Materials
                  </Button>
                </div>
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
    </div>
  );
};
