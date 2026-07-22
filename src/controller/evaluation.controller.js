import aiEvaluationService from '../services/aiEvaluationService.js';
import Evaluation from '../models/Evaluation.js';

export const processStudentEvaluation = async (req, res) => {
  const { studentId, questions, studentAnswers } = req.body;

  // Validação básica de entrada
  if (!studentId || !questions || !studentAnswers) {
    return res.status(400).json({ error: "Faltam dados obrigatórios na requisição." });
  }

  try {
    // 1. Chama o serviço da IA para corrigir as questões
    const aiResult = await aiEvaluationService.evaluateAnswers(questions, studentAnswers);

    // 2. Salva o resultado no banco de dados
    const savedEvaluation = await Evaluation.create({
      studentId,
      score: aiResult.score,
      level: aiResult.level,
      feedback: aiResult.feedback,
      rawAnswers: studentAnswers
    });

    // 3. Retorna sucesso para o frontend
    return res.status(201).json({
      message: "Avaliação concluída e salva com sucesso!",
      data: savedEvaluation
    });
  } catch (error) {
    // Captura erros tanto do banco quanto da IA
    return res.status(500).json({ error: error.message });
  }
};