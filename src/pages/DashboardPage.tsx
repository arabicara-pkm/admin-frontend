"use client";

import React, { useEffect, useState } from "react";
// import { getDashboardStats } from "../services/api"; // API Anda yang sudah ada
import type { DashboardStats } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import {
  Users,
  BookOpen,
  FileText,
  GraduationCap,
  ChevronRight,
  PlusCircle,
} from "lucide-react";
import { Link } from "react-router-dom"; // Penting untuk navigasi

// Placeholder untuk API, ganti dengan API asli Anda jika sudah ada
const getDashboardData = async (): Promise<DashboardStats> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalUsers: 125,
        totalVocabulary: 850,
        totalMaterials: 72,
        totalLevels: 12,
        // Anda bisa menambahkan data lain di sini, misal: recentActivities
      });
    }, 1000);
  });
};

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Ganti getDashboardData dengan getDashboardStats asli Anda
        const data = await getDashboardData();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Konfigurasi untuk kartu statistik agar lebih mudah dikelola
  const statCards = [
    {
      title: "Total Users",
      value: stats?.totalUsers,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Vocabulary Words",
      value: stats?.totalVocabulary,
      icon: BookOpen,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Learning Materials",
      value: stats?.totalMaterials,
      icon: FileText,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "Learning Levels",
      value: stats?.totalLevels,
      icon: GraduationCap,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  // Konfigurasi untuk "Quick Actions" agar mudah dikelola dan di-link
  const quickActions = [
    {
      title: "Add New Vocabulary",
      description: "Add a new Arabic word",
      path: "/vocabulary/new",
      icon: PlusCircle,
    },
    {
      title: "Create New Material",
      description: "Add new lessons or exercises",
      path: "/materials/new",
      icon: PlusCircle,
    },
    {
      title: "Manage All Levels",
      description: "Organize learning progression",
      path: "/levels",
      icon: ChevronRight,
    },
  ];

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
    <div className="space-y-8 p-4 md:p-6">
      {/* 1. Header Halaman */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          An overview of your Arabic Learning Platform.
        </p>
      </div>

      {/* 2. Kartu Statistik (Sudah responsif) */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card
              key={card.title}
              className="transition-all hover:shadow-md hover:-translate-y-1"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {card.title}
                </CardTitle>
                <div className={`rounded-lg p-2 ${card.bgColor}`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  {(card.value || 0).toLocaleString("en-US")}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Kartu Aktivitas & Aksi Cepat (Dibuat lebih dinamis & konsisten) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Kolom Aktivitas Terbaru */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">
              This section will show recent updates.
            </p>
            {/* TODO: Ganti dengan data dari API. Contoh:
            <ul className="space-y-4">
              {recentActivities.map(activity => (
                <li key={activity.id} className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-full"><Users className="h-4 w-4 text-gray-600" /></div>
                  <p className="text-sm text-gray-700">{activity.description}</p>
                  <p className="ml-auto text-xs text-gray-400">{activity.time}</p>
                </li>
              ))}
            </ul>
            */}
          </CardContent>
        </Card>

        {/* Kolom Aksi Cepat */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.title}
                    to={action.path}
                    className="flex items-center justify-between rounded-lg border p-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {action.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {action.description}
                      </p>
                    </div>
                    <Icon className="h-5 w-5 text-gray-400" />
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
