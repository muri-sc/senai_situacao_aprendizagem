import aiModel from '../config/gemini.config.js';

export const evaluateAnswers = async (questions, studentAnswers) => {
  const prompt = `
    Você é um professor tutor avaliando o nível de um aluno.
    
    Questões: ${JSON.stringify(questions)}
    Respostas do aluno: ${JSON.stringify(studentAnswers)}
    
    Retorne a avaliação estritamente neste formato JSON:
    {
      "score": <número de acertos de 0 a 5>,
      "level": "<Iniciante | Intermediário | Avançado>",
      "feedback": "<Um parágrafo de feedback construtivo>"
    }
  `;

  try {
    const result = await aiModel.generateContent(prompt);
    // Extrai e converte a resposta da IA para um objeto Javascript
    return JSON.parse(result.response.text());
  } catch (error) {
    console.error("Erro na comunicação com o Gemini:", error);
    throw new Error("Falha ao processar a avaliação com a IA.");
  }
};