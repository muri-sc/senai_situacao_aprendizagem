import { Op } from "sequelize"
import Evaluation from "../model/evaluation.model.js"
import { StudyPlan } from "../model/study-plan.model.js"
import { Question } from "../model/question.model.js"

function buildEnrichedQuestions(questions, studentAnswers) {
    return questions.map((q) => {
        const questionKey = String(q.questionNumber)
        const selectedIndex = studentAnswers[questionKey]

        if (selectedIndex === undefined) {
            throw new Error(`Resposta ausente para a questão ${q.questionNumber}.`)
        }

        if (selectedIndex < 1 || selectedIndex > q.options.length) {
            throw new Error(`Alternativa inválida para a questão ${q.questionNumber}.`)
        }

        return {
            id: q.questionNumber,
            statement: q.statement,
            options: q.options,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
            selectedOption: q.options[selectedIndex - 1],
            selectedIndex,
        }
    })
}

export default async function ensureAnsweredStudyPlan(req, res, next) {
    try {
        const userId = req.user.id

        const evaluation = await Evaluation.findOne({
            where: {
                studentId: userId,
                studyPlanId: { [Op.ne]: null },
            },
            order: [["id", "DESC"]],
        })

        if (!evaluation) {
            return res.status(404).json({ message: "Nenhum plano avaliado encontrado." })
        }

        const plan = await StudyPlan.findOne({
            where: { id: evaluation.studyPlanId, userId },
        })

        if (!plan) {
            return res.status(404).json({ message: "Nenhum plano avaliado encontrado." })
        }

        const questions = await Question.findAll({
            where: { studyPlanId: plan.id, userId },
            order: [["questionNumber", "ASC"]],
        })

        if (questions.length === 0) {
            return res.status(404).json({ message: "Nenhum plano avaliado encontrado." })
        }

        let enrichedQuestions
        try {
            enrichedQuestions = buildEnrichedQuestions(questions, evaluation.rawAnswers)
        } catch (validationError) {
            return res.status(400).json({ error: validationError.message })
        }

        const wrongQuestions = enrichedQuestions.filter(
            (q) => q.selectedOption !== q.correctAnswer
        )

        req.remedialContext = {
            evaluation,
            plan,
            wrongQuestions,
            schedule: plan.planDetails?.schedule ?? [],
        }

        next()
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}
