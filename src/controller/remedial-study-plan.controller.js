import ai from "../config/gemini.config.js"
import { responseSchema } from "../gemini/schemas.gemini.js"
import { StudyPlan } from "../model/study-plan.model.js"
import { Question } from "../model/question.model.js"

export {
    createRemedialTeachingPlan,
}

async function createRemedialTeachingPlan(req, res) {
    try {
        const userId = req.user.id
        const { evaluation, plan, wrongQuestions, schedule } = req.remedialContext

        const prompt = `
            Você é um avaliador pedagógico profissional.
            O aluno concluiu uma avaliação diagnóstica e precisa de um plano de reforço focado nas defasagens identificadas.

            Plano de estudos original:
            - Tema: "${plan.theme}"
            - Observação do usuário: "${plan.note ?? ""}"
            - Dificuldade desejada: ${plan.difficulty} (0: iniciante, 1: intermediário, 2: avançado)
            - Assunto-alvo: "${plan.targetSubject}"
            - Trilha de aprendizado proposta: ${JSON.stringify(schedule)}

            Resultado da avaliação:
            - Pontuação: ${evaluation.score} de 5
            - Nível: ${evaluation.level}
            - Feedback: ${evaluation.feedback}

            Questões respondidas incorretamente:
            ${JSON.stringify(wrongQuestions.map(q => ({
                statement: q.statement,
                correctAnswer: q.correctAnswer,
                selectedOption: q.selectedOption,
                explanation: q.explanation,
            })))}

            Com base no feedback, na trilha original e nas lacunas demonstradas nas questões erradas,
            crie um NOVO plano de estudos progressivo focado nas defasagens do aluno.
            Mantenha coerência com a trilha original, reforçando os conteúdos onde o aluno falhou
            e ajustando a progressão conforme o nível "${evaluation.level}".
            Além disso, gere uma Avaliação Diagnóstica com 5 questões de múltipla escolha
            sobre os pontos fracos identificados.
        `

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema,
            },
        })

        const data = JSON.parse(response.text)

        const newPlan = await StudyPlan.create({
            userId,
            theme: plan.theme,
            note: plan.note,
            difficulty: plan.difficulty,
            targetSubject: data.targetSubject,
            planDetails: data.studyPlan,
        })

        const questionsToInsert = data.diagnosticAssessment.questions.map(q => ({
            studyPlanId: newPlan.id,
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
                studyPlanId: newPlan.id,
                targetSubject: newPlan.targetSubject,
                studyPlan: newPlan.planDetails,
                questions: insertedQuestions.map(q => ({
                    id: q.id,
                    questionNumber: q.questionNumber,
                    statement: q.statement,
                    options: q.options,
                })),
            },
        })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}
