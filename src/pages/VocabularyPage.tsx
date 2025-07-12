"use client";

import type React from "react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
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
import { VocabularyModal } from "../components/VocabularyModal";
import {
  getVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
} from "../services/api";
import type { Vocabulary } from "../types";
import { Plus, Search, Edit, Trash2, Filter } from "lucide-react";

export const VocabularyPage: React.FC = () => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState<Vocabulary[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [
    selectedVocabulary,
    setSelectedVocabulary,
  ] = useState<Vocabulary | null>(null);
  const [error, setError] = useState("");

  const categories = [
    "all",
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

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const filterVocabulary = useCallback(() => {
    let filtered = vocabulary;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.arabicText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.indonesianText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredVocabulary(filtered);
  }, [vocabulary, searchTerm, selectedCategory]);

  useEffect(() => {
    filterVocabulary();
  }, [filterVocabulary]);

  const fetchVocabulary = async () => {
    try {
      const data = await getVocabulary();
      setVocabulary(data);
    } catch {
      setError("Failed to fetch vocabulary");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVocabulary = () => {
    setModalMode("add");
    setSelectedVocabulary(null);
    setIsModalOpen(true);
  };

  const handleEditVocabulary = (vocab: Vocabulary) => {
    setModalMode("edit");
    setSelectedVocabulary(vocab);
    setIsModalOpen(true);
  };

  const handleDeleteVocabulary = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this vocabulary?")) {
      try {
        await deleteVocabulary();
        setVocabulary(vocabulary.filter((item) => item.id !== id));
      } catch {
        setError("Failed to delete vocabulary");
      }
    }
  };

  const handleSaveVocabulary = async (
    data: Omit<Vocabulary, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (modalMode === "add") {
        const newVocab = await createVocabulary(data);
        setVocabulary([...vocabulary, newVocab]);
      } else if (selectedVocabulary) {
        const updatedVocab = await updateVocabulary(
          selectedVocabulary.id,
          data
        );
        setVocabulary(
          vocabulary.map((item) =>
            item.id === selectedVocabulary.id ? updatedVocab : item
          )
        );
      }
    } catch {
      throw new Error("Failed to save vocabulary");
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Vocabulary Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage Arabic vocabulary words and their translations
          </p>
        </div>
        <Button
          onClick={handleAddVocabulary}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add New Word
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Vocabulary List</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search vocabulary..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">Arabic Text</TableHead>
                  <TableHead>Indonesian Text</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVocabulary.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-8 text-gray-500"
                    >
                      {searchTerm || selectedCategory !== "all"
                        ? "No vocabulary found matching your criteria"
                        : "No vocabulary added yet"}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredVocabulary.map((vocab) => (
                    <TableRow key={vocab.id}>
                      <TableCell className="font-medium text-right" dir="rtl">
                        {vocab.arabicText}
                      </TableCell>
                      <TableCell>{vocab.indonesianText}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {vocab.category}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(vocab.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditVocabulary(vocab)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteVocabulary(vocab.id)}
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

      <VocabularyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveVocabulary}
        vocabulary={selectedVocabulary}
        mode={modalMode}
      />
    </div>
  );
};
