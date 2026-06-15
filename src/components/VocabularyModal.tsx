/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
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
import { Plus, Trash2 } from "lucide-react";

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
  const [categoryId, setCategoryId] = useState<string>("");
  const [items, setItems] = useState<Array<{ arabicText: string; indonesianText: string }>>([
    { arabicText: "", indonesianText: "" },
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Efek untuk mengisi form saat mode 'edit' atau reset saat 'add'
  useEffect(() => {
    if (mode === "edit" && vocabulary) {
      setCategoryId(String(vocabulary.category.id));
      setItems([
        {
          arabicText: vocabulary.arabicText,
          indonesianText: vocabulary.indonesianText,
        },
      ]);
    } else {
      // Reset form untuk mode 'add'
      setCategoryId("");
      setItems([{ arabicText: "", indonesianText: "" }]);
    }
    setError(null);
  }, [isOpen, mode, vocabulary]);

  const handleItemChange = (index: number, field: "arabicText" | "indonesianText", value: string) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addItem = () => {
    setItems((prev) => [...prev, { arabicText: "", indonesianText: "" }]);
  };

  const removeItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      if (!categoryId) {
        throw new Error("Please select a category first.");
      }

      if (mode === "add") {
        // Validasi: pastikan semua field diisi
        for (const item of items) {
          if (!item.arabicText.trim() || !item.indonesianText.trim()) {
            throw new Error("All Arabic and Indonesian fields must be filled.");
          }
        }

        // Map ke data format yang diinginkan backend
        const dataToSave = items.map((item) => ({
          arabicText: item.arabicText,
          indonesianText: item.indonesianText,
          categoryId: Number(categoryId),
        }));

        await onSave(dataToSave);
      } else {
        // Mode edit (selalu 1 item)
        const dataToSave = {
          arabicText: items[0].arabicText,
          indonesianText: items[0].indonesianText,
          categoryId: Number(categoryId),
        };
        await onSave(dataToSave);
      }
      onClose();
    } catch (err) {
      let errorMessage = "An error occurred while saving.";
      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>
              {mode === "add" ? "Add New Vocabulary" : "Edit Vocabulary"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "Fill in the details to add one or more vocabulary words."
                : "Edit the details of the selected vocabulary word."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto py-4 pr-1 space-y-4">
            {/* Category Selector (Global) */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={categoryId}
                onValueChange={setCategoryId}
                required
              >
                <SelectTrigger id="category" className="w-full">
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

            {/* List of Vocabulary Fields */}
            {mode === "add" ? (
              <div className="space-y-4">
                <Label>Vocabulary Words</Label>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative group transition-all duration-200 hover:border-gray-300"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-semibold text-gray-500">
                          Word #{index + 1}
                        </span>
                        {items.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeItem(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`arabicText-${index}`}>Arabic Text</Label>
                        <Input
                          id={`arabicText-${index}`}
                          value={item.arabicText}
                          onChange={(e) =>
                            handleItemChange(index, "arabicText", e.target.value)
                          }
                          required
                          dir="rtl"
                          placeholder="Arabic word (e.g. كِتَاب)"
                          className="text-right text-lg font-medium"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`indonesianText-${index}`}>
                          Indonesian Translation
                        </Label>
                        <Input
                          id={`indonesianText-${index}`}
                          value={item.indonesianText}
                          onChange={(e) =>
                            handleItemChange(index, "indonesianText", e.target.value)
                          }
                          required
                          placeholder="Indonesian translation (e.g. Buku)"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 mt-2 border-dashed border-2 hover:border-solid hover:bg-gray-50"
                  onClick={addItem}
                >
                  <Plus className="h-4 w-4" /> Add Another Word
                </Button>
              </div>
            ) : (
              // Mode Edit - Single Word
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="arabicText">Arabic Text</Label>
                  <Input
                    id="arabicText"
                    value={items[0]?.arabicText || ""}
                    onChange={(e) =>
                      handleItemChange(0, "arabicText", e.target.value)
                    }
                    required
                    dir="rtl"
                    className="text-right text-lg font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="indonesianText">Indonesian Translation</Label>
                  <Input
                    id="indonesianText"
                    value={items[0]?.indonesianText || ""}
                    onChange={(e) =>
                      handleItemChange(0, "indonesianText", e.target.value)
                    }
                    required
                  />
                </div>
              </div>
            )}

            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
          </div>

          <DialogFooter className="flex-shrink-0 pt-4 border-t">
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
