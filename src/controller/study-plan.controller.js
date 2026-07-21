import { GoogleGenAI } from "@google/genai"
import { quizSchema, responseSchema } from "../gemini/schemas.gemini"

export {
    createTeachingPlan,
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY })

async function createTeachingPlan(req, res) {
    try {
        const { theme, note, difficulty } = req.body

        const prompt = `
            Você é um avaliador pedagógico profissional.
            Crie um plano de estudos progressivo para o assunto: "${theme}".
            Observação adicional do usuário: "${note}".
            Dificuldade desejada pelo usuário: "${difficulty}".
            Além disso, gere uma Avaliação Diagnóstica com 5 questões de múltipla escolha.
            Este teste servirá para medir o conhecimento prévio do aluno antes de iniciar os estudos,
            cobrindo conceitos base do tema.
        `
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: responseSchema
            }
        })

        const data = JSON.parse(response.text)

        return res.status(201).json({ message: "Teaching plan created", data: data })
    } catch (err) {
        return res.status(500).json({ message: "Internal server error", error: err.message })
    }
}