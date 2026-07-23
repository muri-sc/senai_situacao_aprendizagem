import { Type } from "@google/genai"

export const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questions: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    statement: { type: Type.STRING },
                    options: { type: Type.ARRAY, items: { type: Type.STRING } },
                    correctAnswer: { type: Type.STRING },
                    explanation: { type: Type.STRING, description: "Didactic justification." }
                },
                required: ["id", "statement", "options", "correctAnswer", "explanation"]
            }
        }
    },
    required: ["questions"]
}

export const responseSchema = {
    type: Type.OBJECT,
    properties: {
        targetSubject: { type: Type.STRING },
        studyPlan: {
            type: Type.OBJECT,
            properties: {
                schedule: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            stage: { type: Type.STRING, description: "Ex: 'Stage 1'" },
                            title: { type: Type.STRING },
                            contents: { type: Type.ARRAY, items: { type: Type.STRING } },
                            estimatedTime: { type: Type.STRING }
                        },
                        required: ["stage", "title", "contents", "estimatedTime"]
                    }
                }
            },
            required: ["schedule"]
        },
        diagnosticAssessment: quizSchema
    },
    required: ["targetSubject", "studyPlan", "diagnosticAssessment"]
}

export const evaluationSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER, description: "Número de acertos de 0 a 5" },
        level: { type: Type.STRING, description: "Iniciante, Intermediário ou Avançado" },
        feedback: { type: Type.STRING, description: "Parágrafo de feedback construtivo" }
    },
    required: ["score", "level", "feedback"]
}