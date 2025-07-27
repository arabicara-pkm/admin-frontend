export interface User {
    id: string
    email: string
    name: string
    role: "admin"
}

export interface Vocabulary {
    id: number
    arabicText: string
    indonesianText: string
    category: Category
    arabicAudio?: string
    indonesianAudio?: string
    createdAt: string
    updatedAt: string
}

export interface Category {
    id: number;
    name: string;
    createdAt: string;
    updatedAt: string;
}

export interface Level {
    id: number;
    name: string;
    description: string;
    sequence: number;
    createdAt: string;
    updatedAt: string;
    exercises?: Exercise[];
    lessons?: Lesson[];
}

export interface Lesson {
    id: number;
    title: string;
    content: string;
    sequence: number;
    levelId: number;
    createdAt: string;
    updatedAt: string;
}

export interface Exercise {
    id?: number;
    question: string;
    levelId?: number;
    choices: AnswerChoice[];
    // 'order' atau 'sequence' bisa ditambahkan jika perlu
}

export interface AnswerChoice {
    id?: number;
    text: string;
    isCorrect: boolean;
    exerciseId?: number;
}

export interface DashboardStats {
    totalUsers: number
    totalVocabulary: number
    totalMaterials: number
    totalLevels: number
}

export interface UserLevelProgress {
    id: number;
    userId: string;
    levelId: number;
    status: string; // e.g., 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'
    score?: number;
    completedAt?: string;
}

export interface UserLessonProgress {
    id: number;
    userId: string;
    lessonId: number;
    status: string; // e.g., 'LOCKED', 'UNLOCKED', 'COMPLETED'
    completedAt?: string;
}
