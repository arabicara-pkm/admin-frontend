"use client";

import React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Alert, AlertDescription } from "../components/ui/Alert";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { MaterialModal } from "../components/MaterialModal";
import { getMaterialsByLevel, createMaterial } from "../services/api";
import type { Material } from "../types";
import {
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  FileText,
  Play,
  HelpCircle,
} from "lucide-react";

export const MaterialsPage: React.FC = () => {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [error, setError] = useState("");

  const fetchMaterials = React.useCallback(async () => {
    if (!levelId) return;

    try {
      const data = await getMaterialsByLevel(levelId);
      setMaterials(data.sort((a, b) => a.order - b.order));
    } catch {
      setError("Failed to fetch materials");
    } finally {
      setIsLoading(false);
    }
  }, [levelId]);

  useEffect(() => {
    if (levelId) {
      fetchMaterials();
    }
  }, [levelId, fetchMaterials]);

  const handleAddMaterial = () => {
    setModalMode("add");
    setSelectedMaterial(null);
    setIsModalOpen(true);
  };

  const handleEditMaterial = (material: Material) => {
    setModalMode("edit");
    setSelectedMaterial(material);
    setIsModalOpen(true);
  };

  const handleDeleteMaterial = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        // await deleteMaterial(id)
        setMaterials(materials.filter((item) => item.id !== id));
      } catch {
        setError("Failed to delete material");
      }
    }
  };

  const handleSaveMaterial = async (
    data: Omit<Material, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (modalMode === "add") {
        const newMaterial = await createMaterial(data);
        setMaterials(
          [...materials, newMaterial].sort((a, b) => a.order - b.order)
        );
      } else if (selectedMaterial) {
        // const updatedMaterial = await updateMaterial(selectedMaterial.id, data)
        // setMaterials(materials.map((item) => (item.id === selectedMaterial.id ? updatedMaterial : item)))
      }
    } catch {
      throw new Error("Failed to save material");
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "lesson":
        return <FileText className="h-4 w-4" />;
      case "exercise":
        return <Play className="h-4 w-4" />;
      case "quiz":
        return <HelpCircle className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "lesson":
        return "bg-blue-100 text-blue-800";
      case "exercise":
        return "bg-green-100 text-green-800";
      case "quiz":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate("/levels")}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Levels
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Materials Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage learning materials for this level
          </p>
        </div>
        <Button onClick={handleAddMaterial} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add New Material
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Materials List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Exercises</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No materials added yet for this level
                    </TableCell>
                  </TableRow>
                ) : (
                  materials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">
                        {material.title}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                            material.type
                          )}`}
                        >
                          {getTypeIcon(material.type)}
                          <span className="ml-1 capitalize">
                            {material.type}
                          </span>
                        </span>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {material.content}
                      </TableCell>
                      <TableCell>
                        {material.exercises.length} exercises
                      </TableCell>
                      <TableCell>{material.order}</TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(material.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditMaterial(material)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteMaterial(material.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {levelId && (
        <MaterialModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveMaterial}
          material={selectedMaterial}
          mode={modalMode}
          levelId={levelId}
        />
      )}
    </div>
  );
};
