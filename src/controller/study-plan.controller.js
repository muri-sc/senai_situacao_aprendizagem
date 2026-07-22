import { GoogleGenAI } from "@google/genai"
import { responseSchema } from "../gemini/schemas.gemini.js"
import { StudyPlan } from "../model/study-plan.model.js"
import { Question } from "../model/question.model.js"

export {
    createTeachingPlan,
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })

async function createTeachingPlan(req, res) {
    try {
        const { theme, details, difficulty } = req.body
        const userId = req.user.id

        const prompt = `
            Você é um avaliador pedagógico profissional.
            Crie um plano de estudos progressivo para o assunto: "${theme}".
            Observação adicional do usuário: "${details}".
            Dificuldade do tema desejado pelo usuário: "${difficulty}",
            sendo 0: iniciante, 1: intermediário, 2: avançado.
            Além disso, gere uma Avaliação Diagnóstica com 5 questões de múltipla escolha.
            Este teste servirá para medir o conhecimento prévio do aluno antes de iniciar os estudos,
            cobrindo conceitos base do tema.
        `
        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        })

        const data = JSON.parse(response.text)

        const plan = await StudyPlan.create({
            userId,
            theme,
            note: details,
            difficulty,
            targetSubject: data.targetSubject,
            planDetails: data.studyPlan,
        })

        const questionsToInsert = data.diagnosticAssessment.questions.map(q => ({
            studyPlanId: plan.id,
            userId,
            questionNumber: q.id,
            statement: q.statement,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
        }))

        const insertedQuestions = await Question.bulkCreate(questionsToInsert)

        return res.status(201).json({
            message: "Teaching plan created",
            data: {
                studyPlanId: plan.id,
                targetSubject: plan.targetSubject,
                studyPlan: plan.planDetails,
                questions: insertedQuestions.map(q => ({
                    id: q.id,
                    questionNumber: q.questionNumber,
                    statement: q.statement,
                    options: q.options,
                })),
            }
        })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}