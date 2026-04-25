import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are CaseMatrix Legal AI, an expert legal virtual assistant designed to help users navigate basic legal concepts, courtroom procedures, and case management terminology. 
Your tone must be highly professional, objective, precise, and empathetic. 
When providing information, keep your responses well-structured and use markdown for readability (bullet points, bold text).
Crucial Rule: Always politely remind the user that you are an AI and your guidance does NOT constitute official legal counsel or attorney-client privilege.
Limit your responses to a reasonable length, providing direct answers rather than overwhelming the user with text.`;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey) {
      return NextResponse.json({ error: 'Groq API Key is not configured' }, { status: 500 });
    }

    // Prepend system prompt
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((msg: any) => ({
        role: msg.from === 'user' ? 'user' : 'assistant',
        content: msg.text
      }))
    ];

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: apiMessages,
        temperature: 0.3,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Groq API Error:', errorData);
      return NextResponse.json({ error: 'Failed to communicate with the AI service' }, { status: 500 });
    }

    const data = await response.json();
    const botReply = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
