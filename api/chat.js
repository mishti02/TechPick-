export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();

    const contents = body.messages.map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));

    const geminiBody = {
      system_instruction: { parts: [{ text: body.system }] },
      contents,
      generationConfig: { maxOutputTokens: 1000 }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      }
    );

    const data = await response.json();
    
    // Return full Gemini response for debugging
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      return new Response(JSON.stringify({
        content: [{ text: "Debug: " + JSON.stringify(data) }]
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({
      content: [{ text }]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    return new Response(JSON.stringify({
      content: [{ text: "Error: " + error.message }]
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
}
