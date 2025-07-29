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
import type { Category } from "../types";

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { name: string }) => Promise<void>;
  category: Category | null;
  mode: "add" | "edit";
}

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  mode,
}) => {
  const [name, setName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && mode === "edit" && category) {
      setName(category.name);
    } else {
      setName(""); // Reset form saat dibuka untuk 'add' atau ditutup
    }
    setError(null); // Selalu reset error saat modal dibuka
  }, [isOpen, mode, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Category name cannot be empty.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await onSave({ name });
      onClose(); // Tutup modal setelah berhasil save
    } catch (err) {
      let errorMessage = "Terjadi kesalahan saat menyimpan."; // Siapkan pesan default

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
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === "add" ? "Add New Category" : "Edit Category"}
            </DialogTitle>
            <DialogDescription>
              Enter a name for the category. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
