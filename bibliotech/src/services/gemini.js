import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
const modelName =
    import.meta.env.VITE_GEMINI_MODEL_NAME || "gemini-2.5-flash-lite";

let genAI = null;

if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
}

export async function getBookRecommendations(book) {
    if (!genAI) {
        return [
            {
                titulo: "El Hobbit",
                razon: "Comparte el universo de fantasía",
                relevancia: 0.9,
            },
            {
                titulo: "Las Crónicas de Narnia",
                razon: "Aventura fantástica similar",
                relevancia: 0.8,
            },
        ];
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    const prompt = `Dado el libro "${book.titulo}" de ${book.autor} (género: ${book.genero}), sugiere 3 libros similares. Responde SOLO con JSON válido, sin markdown, sin explicación. Formato exacto:
[{"titulo":"...","razon":"...","relevancia":0.9},{"titulo":"...","razon":"...","relevancia":0.8},{"titulo":"...","razon":"...","relevancia":0.7}]`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return JSON.parse(text);
}

export async function chatWithGemini(messages) {
    if (!genAI) {
        return "La IA no está configurada. Agrega VITE_GEMINI_API_KEY en el archivo .env";
    }

    const model = genAI.getGenerativeModel({ model: modelName });
    const systemPrompt =
        "Eres un asistente de biblioteca amigable. Ayudas a los usuarios a encontrar libros, responder preguntas literarias y recomendar lecturas. Sé conciso y útil.";
    const lastMessage = messages[messages.length - 1].content;
    const result = await model.generateContent(
        `${systemPrompt}\n\nUsuario: ${lastMessage}`,
    );
    return result.response.text();
}
