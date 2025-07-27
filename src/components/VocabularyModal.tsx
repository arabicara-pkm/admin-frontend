/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "./ui/Dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import type { Vocabulary, Category } from "../types";

// Definisikan tipe untuk props
interface VocabularyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  vocabulary: Vocabulary | null;
  mode: "add" | "edit";
  categories: Category[]; // Prop baru untuk menerima daftar kategori
}

export const VocabularyModal: React.FC<VocabularyModalProps> = ({
  isOpen,
  onClose,
  onSave,
  vocabulary,
  mode,
  categories,
}) => {
  // State untuk menampung data form
  const [formData, setFormData] = useState({
    arabicText: "",
    indonesianText: "",
    categoryId: "", // Kita akan menyimpan ID kategori
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efek untuk mengisi form saat mode 'edit'
  useEffect(() => {
    if (mode === "edit" && vocabulary) {
      setFormData({
        arabicText: vocabulary.arabicText,
        indonesianText: vocabulary.indonesianText,
        categoryId: String(vocabulary.category.id), // Pastikan ID adalah string untuk Select
      });
    } else {
      // Reset form untuk mode 'add'
      setFormData({ arabicText: "", indonesianText: "", categoryId: "" });
    }
  }, [isOpen, mode, vocabulary]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, categoryId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      // Pastikan categoryId diubah kembali ke number sebelum dikirim
      const dataToSave = {
        ...formData,
        categoryId: Number(formData.categoryId),
      };
      await onSave(dataToSave);
      onClose();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Vocabulary" : "Edit Vocabulary"}
            </DialogTitle>
            <DialogDescription>
              Fill in the details for the vocabulary word.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="arabicText">Arabic Text</Label>
              <Input
                id="arabicText"
                name="arabicText"
                value={formData.arabicText}
                onChange={handleChange}
                required
                dir="rtl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="indonesianText">Indonesian Text</Label>
              <Input
                id="indonesianText"
                name="indonesianText"
                value={formData.indonesianText}
                onChange={handleChange}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={handleCategoryChange}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
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
