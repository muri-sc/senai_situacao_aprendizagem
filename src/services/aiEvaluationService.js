import ai from '../config/gemini.config.js';
import { evaluationSchema } from '../gemini/schemas.gemini.js';

export const evaluateAnswers = async (enrichedQuestions) => {
  const prompt = `
    Você é um professor tutor avaliando o nível de um aluno.

    Avalie com base nas questões abaixo. Cada item inclui correctAnswer (gabarito) e selectedOption (resposta escolhida pelo aluno).
    Questões: ${JSON.stringify(enrichedQuestions)}

    Calcule o número de acertos (0 a 5), defina o nível (Iniciante, Intermediário ou Avançado) e gere um parágrafo de feedback construtivo.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: evaluationSchema
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Erro na comunicação com o Gemini:", error);
    throw new Error("Falha ao processar a avaliação com a IA.");
  }
};
