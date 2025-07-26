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
    id: string
    levelName: string
    description: string
    order: number
    createdAt: string
    updatedAt: string
}

export interface Material {
    id: string
    levelId: string
    title: string
    content: string
    type: "lesson" | "exercise" | "quiz"
    order: number
    exercises: Exercise[]
    createdAt: string
    updatedAt: string
}

export interface Exercise {
    id: string
    materialId: string
    question: string
    type: "multiple_choice" | "fill_blank" | "true_false"
    choices: AnswerChoice[]
    createdAt: string
    updatedAt: string
}

export interface AnswerChoice {
    id: string
    text: string
    isCorrect: boolean
    order: number
}

export interface DashboardStats {
    totalUsers: number
    totalVocabulary: number
    totalMaterials: number
    totalLevels: number
}
