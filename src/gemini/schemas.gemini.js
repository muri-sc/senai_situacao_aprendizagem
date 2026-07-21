import { Type } from "@google/genai"

export const quizSchema = {
    type: Type.OBJECT,
    properties: {
        questoes: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    enunciado: { type: Type.STRING },
                    alternativas: { type: Type.ARRAY, items: { type: Type.STRING } },
                    respostaCorreta: { type: Type.STRING },
                    explicacao: { type: Type.STRING, description: "Justificativa didática." }
                },
                required: ["id", "enunciado", "alternativas", "respostaCorreta", "explicacao"]
            }
        }
    },
    required: ["questoes"]
}

export const responseSchema = {
    type: Type.OBJECT,
    properties: {
        targetSubject: { type: Type.STRING },
        studyPlan: {
            type: Type.OBJECT,
            properties: {
                cronograma: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            etapa: { type: Type.STRING, description: "Ex: 'Etapa 1'" },
                            titulo: { type: Type.STRING },
                            conteudos: { type: Type.ARRAY, items: { type: Type.STRING } },
                            tempoEstimado: { type: Type.STRING }
                        },
                        required: ["etapa", "titulo", "conteudos", "tempoEstimado"]
                    }
                }
            },
            required: ["cronograma"]
        },
        diagnosticAssessment: quizSchema
    },
    required: ["targetSubject", "studyPlan", "diagnosticAssessment"]
}