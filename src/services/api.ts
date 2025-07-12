import type { DashboardStats, Level, Material, User, Vocabulary } from "../types"

// Mock data
const MOCK_USER: User = {
    id: "1",
    email: "admin@example.com",
    name: "Admin User",
    role: "admin",
}

const MOCK_VOCABULARY: Vocabulary[] = [
    {
        id: "1",
        arabicText: "مرحبا",
        indonesianText: "Halo",
        category: "Greetings",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "2",
        arabicText: "شكرا",
        indonesianText: "Terima kasih",
        category: "Greetings",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
    {
        id: "3",
        arabicText: "كتاب",
        indonesianText: "Buku",
        category: "Objects",
        createdAt: "2024-01-01",
        updatedAt: "2024-01-01",
    },
]

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

export const getVocabulary = async (): Promise<Vocabulary[]> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return MOCK_VOCABULARY
}

export const createVocabulary = async (
    data: Omit<Vocabulary, "id" | "createdAt" | "updatedAt">,
): Promise<Vocabulary> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newVocab: Vocabulary = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    }
    return newVocab
}

export const updateVocabulary = async (id: string, data: Partial<Vocabulary>): Promise<Vocabulary> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const existing = MOCK_VOCABULARY.find((v) => v.id === id)
    if (!existing) throw new Error("Vocabulary not found")

    return {
        ...existing,
        ...data,
        updatedAt: new Date().toISOString(),
    }
}

export const deleteVocabulary = async (): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 500))
}

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
