"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  getVocabulary,
  createVocabulary,
  updateVocabulary,
  deleteVocabulary,
  getCategories,
} from "../services/api";
import type { Category, Vocabulary } from "../types";

// Import komponen UI dari shadcn/ui
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/Select";
import { Card, CardContent } from "../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/Table";
import { Badge } from "../components/ui/badge"; // Komponen baru untuk kategori
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { VocabularyModal } from "../components/VocabularyModal";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog"; // Komponen baru untuk konfirmasi
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip"; // Komponen baru untuk hint

// Import Ikon
import { Plus, Search, Edit, Trash2, BookText } from "lucide-react";

export const VocabularyPage: React.FC = () => {
  const [vocabulary, setVocabulary] = useState<Vocabulary[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredVocabulary, setFilteredVocabulary] = useState<Vocabulary[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter dan pencarian
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // State untuk Modal (Add/Edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [
    selectedVocabulary,
    setSelectedVocabulary,
  ] = useState<Vocabulary | null>(null);

  // State untuk Dialog Konfirmasi Hapus
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [vocabToDelete, setVocabToDelete] = useState<Vocabulary | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [vocabData, categoriesData] = await Promise.all([
        getVocabulary(),
        getCategories(),
      ]);
      setVocabulary(vocabData || []);
      setCategories(categoriesData || []);
    } catch (err) {
      setError("Failed to fetch page data. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Logika filter di sisi klien
  useEffect(() => {
    let filtered = vocabulary;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.arabicText.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.indonesianText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (item) => item.category.name === selectedCategory
      );
    }
    setFilteredVocabulary(filtered);
  }, [vocabulary, searchTerm, selectedCategory]);

  const handleAdd = () => {
    setModalMode("add");
    setSelectedVocabulary(null);
    setIsModalOpen(true);
  };

  const handleEdit = (vocab: Vocabulary) => {
    setModalMode("edit");
    setSelectedVocabulary(vocab);
    setIsModalOpen(true);
  };

  const handleSave = async (
    data: Omit<Vocabulary, "id" | "createdAt" | "updatedAt">
  ) => {
    try {
      if (modalMode === "add") {
        await createVocabulary(data);
      } else if (selectedVocabulary) {
        await updateVocabulary(selectedVocabulary.id, data);
      }
      setIsModalOpen(false);
      await fetchData(); // Muat ulang data setelah berhasil menyimpan
    } catch (err) {
      console.error("Failed to save vocabulary:", err);
      throw new Error("Failed to save vocabulary");
    }
  };

  const openDeleteDialog = (vocab: Vocabulary) => {
    setVocabToDelete(vocab);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vocabToDelete) return;
    try {
      await deleteVocabulary(vocabToDelete.id);
      setVocabToDelete(null);
      await fetchData(); // Muat ulang data setelah berhasil menghapus
    } catch (err) {
      setError("Failed to delete vocabulary.");
      console.error(err);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center p-16">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center p-16 text-red-600">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Header Halaman */}
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vocabulary</h1>
          <p className="mt-1 text-gray-600">
            Manage Arabic vocabulary words and their translations.
          </p>
        </div>
        <Button onClick={handleAdd} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add New Word
        </Button>
      </div>

      {/* Kontrol Filter dan Pencarian */}
      <div className="flex flex-col items-stretch gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search by Arabic or Indonesian text..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-10 pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px] h-10">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            {/* Opsi "All" manual */}
            <SelectItem value="all">All Categories</SelectItem>
            {/* Mapping dari state categories */}
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Tabel Data */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Arabic Text</TableHead>
                  <TableHead>Indonesian Text</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVocabulary.length > 0 ? (
                  filteredVocabulary.map((vocab) => (
                    <TableRow key={vocab.id}>
                      <TableCell className="font-medium" dir="rtl">
                        {vocab.arabicText}
                      </TableCell>
                      <TableCell>{vocab.indonesianText}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{vocab.category.name}</Badge>
                      </TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(vocab.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEdit(vocab)}
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
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => openDeleteDialog(vocab)}
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
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="h-48 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <BookText className="h-10 w-10 text-gray-400" />
                        <p className="font-medium">No Vocabulary Found</p>
                        <p className="text-sm">
                          Try adjusting your search or filter.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Modal untuk Add/Edit */}
      {isModalOpen && (
        <VocabularyModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          vocabulary={selectedVocabulary}
          mode={modalMode}
          categories={categories}
        />
      )}

      {/* Dialog untuk Konfirmasi Hapus */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              vocabulary word
              <span className="font-bold"> "{vocabToDelete?.arabicText}"</span>.
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
