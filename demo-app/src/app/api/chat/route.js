import { GoogleGenerativeAI } from "@google/generative-ai";

const normalizationMap = {
  "aa+": "a",
  // You can add more mapping rules here
};

/**
 * Normalizes the query string based on the normalizationMap.
 */
function normalizeQuery(query) {
  let normalized = query;
  for (const [pattern, replacement] of Object.entries(normalizationMap)) {
    const regex = new RegExp(pattern, 'g');
    normalized = normalized.replace(regex, replacement);
  }
  return normalized;
}

/**
 * Mock FAISS vector search call.
 * In a real app, this would query a vector database.
 */
async function get_context(query, k) {
  // Simulating a small delay for the "search"
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return Array.from({ length: k }, (_, i) => ({
    sur: `${Math.floor(Math.random() * 114) + 1}`,
    verse: `${Math.floor(Math.random() * 100) + 1}`,
    text: `Sample retrieved context for "${query}" - Result index ${i + 1}. This represents a relevant snippet from the database.`
  }));
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { query, k = 10 } = body;

    if (!query) {
      return Response.json({ error: "Query is required" }, { status: 400 });
    }

    // 1. Apply normalization
    const normalizedQuery = normalizeQuery(query);

    // 2. Perform mock vector search
    const chunksWithText = await get_context(normalizedQuery, k);

    // 3. Construct prompt and call Gemini
    const apiKey = process.env.GOOGLE_AI_STUDIO_KEY;
    if (!apiKey) {
      return Response.json({ error: "GOOGLE_AI_STUDIO_KEY is not configured in .env" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const contextContext = chunksWithText
      .map(c => `[Surah ${c.sur}, Verse ${c.verse}]: ${c.text}`)
      .join("\n\n");

    const prompt = `
You are a helpful AI assistant. Use the following retrieved context to answer the user's query.
If the answer is not in the context, say that you don't know based on the provided sources, but try to be as helpful as possible.

Context:
${contextContext}

Query: ${normalizedQuery}

Answer:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const answer = response.text();

    // 4. Return JSON
    return Response.json({
      answer,
      chunks: chunksWithText.map(c => ({ sur: c.sur, verse: c.verse, text: c.text }))
    });

  } catch (error) {
    console.error("Chat API Error:", error);
    return Response.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
