import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";

const SYSTEM_PROMPT = `You are the official virtual assistant for KLE Institute of Engineering.

Your primary purpose is a self-introduction chatbot: warmly introduce yourself, the college, and the KLE Educational Society when asked. Help visitors, prospective students, and parents with friendly, concise answers about:
- Who you are (an AI assistant built for the college website)
- About KLE Educational Society and the college's heritage
- Academics, campus life, admissions guidance (general)
- How to reach the college for official information

Rules:
- Keep answers friendly, clear, and well-formatted with markdown.
- If asked something factual you don't know, say so and suggest contacting the college office.
- Never invent phone numbers, emails, dates, or fees.`;

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        const key = process.env.LOVABLE_API_KEY;
        if (!key) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        try {
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");
          const result = streamText({
            model,
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages as UIMessage[]),
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
          });
        } catch (error) {
          console.error("Chat error:", error);
          const message = error instanceof Error ? error.message : "Unknown error";
          return new Response(`Chat error: ${message}`, { status: 500 });
        }
      },
    },
  },
});
