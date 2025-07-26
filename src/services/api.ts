/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardStats, Level, Material, User } from "../types"
import axios from 'axios';
import { supabase } from '../lib/supabaseClient'; // Asumsi client Supabase Anda ada di sini

const apiClient = axios.create({
    baseURL: 'https://backend-arabicara.up.railway.app/api/v1', // Base URL dari API Anda
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menambahkan token otentikasi ke setiap permintaan
apiClient.interceptors.request.use(
    async (config) => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
            config.headers.Authorization = `Bearer ${session.access_token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Mock data
const MOCK_USER: User = {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
}

const MOCK_LEVELS: Level[] = [
    {
        id: "1",
        levelName: "Beginner",
        description: "Basic Arabic for beginners",
        order: 1,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "2",
        levelName: "Intermediate",
        description: "Intermediate Arabic concepts",
        order: 2,
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
]

const MOCK_MATERIALS: Material[] = [
    {
        id: "1",
        levelId: "1",
        title: "Basic Greetings",
        content: "Learn basic Arabic greetings",
        type: "lesson",
        order: 1,
        exercises: [],
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
]

const MOCK_STATS: DashboardStats = {
    totalUsers: 150,
    totalVocabulary: 500,
    totalMaterials: 25,
    totalLevels: 5,
}

// API functions
export const login = async (email: string, password: string): Promise<User> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (email === "admin@example.com" && password === "password") {
        return MOCK_USER
    }

    throw new Error("Invalid credentials")
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_STATS
}

// GET /vocabularies
export const getVocabulary = async () => {
    const response = await apiClient.get('/vocabularies');
    console.log(response.data);

    return response.data; // Sesuaikan dengan struktur respons API Anda
};

// POST /vocabularies
export const createVocabulary = async (data: any) => {
    const response = await apiClient.post('/vocabularies', data);
    return response.data.data;
};

// PUT /vocabularies/{id}
export const updateVocabulary = async (id: number, data: any) => {
    const response = await apiClient.put(`/vocabularies/${id}`, data);
    return response.data.data;
};

// DELETE /vocabularies/{id}
export const deleteVocabulary = async (id: number) => {
    await apiClient.delete(`/vocabularies/${id}`);
};

export const getLevels = async (): Promise<Level[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_LEVELS
}

export const getMaterialsByLevel = async (levelId: string): Promise<Material[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_MATERIALS.filter((m) => m.levelId === levelId)
}

export const createLevel = async (data: Omit<Level, "id" | "createdAt" | "updatedAt">): Promise<Level> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}

export const createMaterial = async (data: Omit<Material, "id" | "createdAt" | "updatedAt">): Promise<Material> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
}
