"use client";

import React, { useEffect, useState } from "react";
import { getDashboardStats } from "../services/api";
import type { DashboardStats } from "../types";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import {
  BookOpen,
  FileText,
  GraduationCap,
  ChevronRight,
  Tags,
} from "lucide-react";
import { Link } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // ✅ Ganti placeholder dengan panggilan API asli
        const data = await getDashboardStats();
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

  const statCards = [
    {
      title: "Total Categories",
      value: stats?.totalCategories,
      icon: Tags,
      link: "/categories",
    },
    {
      title: "Total Vocabulary",
      value: stats?.totalVocabulary,
      icon: BookOpen,
      link: "/vocabulary",
    },
    {
      title: "Total Lessons",
      value: stats?.totalLessons,
      icon: FileText,
      link: "/lessons",
    },
    {
      title: "Total Levels",
      value: stats?.totalLevels,
      icon: GraduationCap,
      link: "/levels",
    },
  ];

  const quickActions = [
    {
      title: "Manage Vocabulary",
      description: "Add or edit words",
      path: "/vocabulary",
      icon: BookOpen,
    },
    {
      title: "Manage Categories",
      description: "Organize word categories",
      path: "/categories",
      icon: Tags,
    },
    {
      title: "Manage Levels",
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-gray-600">
          An overview of your Arabic Learning Platform.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link to={card.link} key={card.title}>
              <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {card.title}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-gray-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(card.value || 0).toLocaleString("en-US")}
                  </div>
                </CardContent>
              </Card>
            </Link>
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
              Feature to show recent updates is coming soon.
            </p>
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
