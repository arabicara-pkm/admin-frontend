/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DashboardStats } from "../types"
import axios from 'axios';
import { supabase } from '../lib/supabaseClient'; // Asumsi client Supabase Anda ada di sini

const apiClient = axios.create({
    baseURL: 'https://backend-arabicaraa.up.railway.app/api/v1', // Base URL dari API Anda
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

const MOCK_STATS: DashboardStats = {
    totalUsers: 150,
    totalVocabulary: 500,
    totalMaterials: 25,
    totalLevels: 5,
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_STATS
}

// ===============================================
// FUNGSI UNTUK ENDPOINT CATEGORY
// ===============================================

export const getCategories = async () => {
    const response = await apiClient.get('/categories');
    return response.data; // Sesuaikan dengan struktur respons API Anda
};

export const createCategory = async (data: { name: string }) => {
    const response = await apiClient.post('/categories', data);
    return response.data;
};

export const updateCategory = async (id: number, data: { name: string }) => {
    const response = await apiClient.put(`/categories/${id}`, data);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    await apiClient.delete(`/categories/${id}`);
};


// ===============================================
// FUNGSI UNTUK ENDPOINT VOCABULARY
// ===============================================

export const getVocabulary = async () => {
    const response = await apiClient.get('/vocabularies');

    return response.data; // Sesuaikan dengan struktur respons API Anda
};

export const createVocabulary = async (data: any) => {
    const response = await apiClient.post('/vocabularies', data);
    return response.data.data;
};

export const updateVocabulary = async (id: number, data: any) => {
    const response = await apiClient.put(`/vocabularies/${id}`, data);
    return response.data.data;
};

export const deleteVocabulary = async (id: number) => {
    await apiClient.delete(`/vocabularies/${id}`);
};

// ===============================================
// FUNGSI UNTUK ENDPOINT LEVEL
// ===============================================
export const getLevels = async () => {
    const response = await apiClient.get('/levels');
    return response.data.data;
};

export const getLevelWithExercises = async (levelId: number) => {
    const response = await apiClient.get(`/levels/${levelId}`, {
        params: { include: 'exercises' }
    });
    return response.data.data;
};

export const createLevel = async (data: any) => {
    const response = await apiClient.post('/levels', data);
    return response.data.data;
};

export const updateLevel = async (id: number, data: any) => {
    const response = await apiClient.put(`/levels/${id}`, data);
    return response.data.data;
};

export const deleteLevel = async (id: number) => {
    await apiClient.delete(`/levels/${id}`);
};


// ===============================================
// FUNGSI UNTUK ENDPOINT LESSON
// ===============================================

export const getLessonsByLevel = async (levelId: number) => {
    const response = await apiClient.get(`/levels/${levelId}`, {
        params: {
            include: 'lessons'
        }
    });

    return response.data.data.lessons || [];
};

export const createLesson = async (data: any) => {
    const response = await apiClient.post('/lessons', data);
    return response.data.data;
};

export const updateLesson = async (id: number, data: any) => {
    const response = await apiClient.put(`/lessons/${id}`, data);
    return response.data.data;
};

export const deleteLesson = async (id: number) => {
    await apiClient.delete(`/lessons/${id}`);
};

// ===============================================
// FUNGSI UNTUK ENDPOINT EXERCISE
// ===============================================

// POST /exercises
export const createExercise = async (data: any) => {
    const response = await apiClient.post('/exercises', data);
    return response.data.data;
};

// PUT /exercises/{id}
export const updateExercise = async (id: number, data: any) => {
    const response = await apiClient.put(`/exercises/${id}`, data);
    return response.data.data;
};

// DELETE /exercises/{id}
export const deleteExercise = async (id: number) => {
    await apiClient.delete(`/exercises/${id}`);
};