"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/Input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Label } from "../components/ui/Label";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { BookOpen, Mail, Lock, AlertTriangle } from "lucide-react";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth(); // Dapatkan fungsi login dari context
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Panggil fungsi login dari context yang sudah terhubung ke Supabase
      const { error } = await login(email, password);

      if (error) {
        // Jika Supabase mengembalikan error, tampilkan pesannya
        throw new Error(error.message);
      }

      // Navigasi ke dashboard setelah berhasil.
      // State akan diperbarui secara otomatis oleh listener di AuthContext.
      navigate("/dashboard");
    } catch (err) {
      let errorMessage = "Terjadi kesalahan saat menyimpan."; // Siapkan pesan default

      if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardHeader className="text-center p-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-indigo-600 rounded-full">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold text-gray-800">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-md text-gray-500 pt-1">
            Sign in to manage your platform
          </CardDescription>
        </CardHeader>
        <CardContent className="px-8 pb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="flex items-center space-x-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                <AlertTriangle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11" // Beri padding kiri untuk ruang ikon
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pl-10 h-11" // Beri padding kiri untuk ruang ikon
                />
              </div>
            </div>

            {/* Perubahan 5: Tombol dengan visual lebih menarik */}
            <Button
              type="submit"
              className="w-full h-11 text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? <LoadingSpinner /> : "Sign In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
