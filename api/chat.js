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

    const groqBody = {
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        { role: "system", content: body.system },
        ...body.messages.map(m => ({
          role: m.role,
          content: m.content
        }))
      ]
    };

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify(groqBody),
    });

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

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
