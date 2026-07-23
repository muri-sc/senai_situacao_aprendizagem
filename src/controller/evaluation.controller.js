import { evaluateAnswers } from '../services/aiEvaluationService.js';
import Evaluation from '../model/evaluation.model.js';
import { StudyPlan } from '../model/study-plan.model.js';
import { Question } from '../model/question.model.js';

function buildEnrichedQuestions(questions, studentAnswers) {
  return questions.map((q) => {
    const questionKey = String(q.questionNumber);
    const selectedIndex = studentAnswers[questionKey];

    if (selectedIndex === undefined) {
      throw new Error(`Resposta ausente para a questão ${q.questionNumber}.`);
    }

    if (selectedIndex < 1 || selectedIndex > q.options.length) {
      throw new Error(`Alternativa inválida para a questão ${q.questionNumber}.`);
    }

    return {
      id: q.questionNumber,
      statement: q.statement,
      options: q.options,
      correctAnswer: q.correctAnswer,
      selectedOption: q.options[selectedIndex - 1],
      selectedIndex,
    };
  });
}

export async function processStudentEvaluation(req, res) {
  const userId = req.user.id;
  const { studentAnswers } = req.body;

  try {
    const plan = await StudyPlan.findOne({
      where: { userId },
      order: [['id', 'DESC']],
    });

    if (!plan) {
      return res.status(404).json({ error: "Nenhum plano de estudos encontrado para este usuário." });
    }

    const questions = await Question.findAll({
      where: { studyPlanId: plan.id, userId },
      order: [['questionNumber', 'ASC']],
    });

    if (questions.length === 0) {
      return res.status(404).json({ error: "Nenhuma questão encontrada para o plano de estudos." });
    }

    let enrichedQuestions;
    try {
      enrichedQuestions = buildEnrichedQuestions(questions, studentAnswers);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    const aiResult = await evaluateAnswers(enrichedQuestions);

    const savedEvaluation = await Evaluation.create({
      studentId: userId,
      score: aiResult.score,
      level: aiResult.level,
      feedback: aiResult.feedback,
      rawAnswers: studentAnswers,
    });

    return res.status(201).json({
      message: "Avaliação concluída e salva com sucesso!",
      data: savedEvaluation,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
