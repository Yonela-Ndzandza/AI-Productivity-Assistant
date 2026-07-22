import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateWithLovableAI, type ChatMessage } from "./ai-gateway.server";

const GenerateInput = z.object({
  system: z.string().min(1),
  prompt: z.string().min(1),
  temperature: z.number().min(0).max(2).optional(),
});

export const generateAIText = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => GenerateInput.parse(raw))
  .handler(async ({ data }) => {
    const messages: ChatMessage[] = [
      { role: "system", content: data.system },
      { role: "user", content: data.prompt },
    ];
    const text = await generateWithLovableAI({ messages, temperature: data.temperature });
    return { text };
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant", "system"]),
        content: z.string(),
      }),
    )
    .min(1),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((raw: unknown) => ChatInput.parse(raw))
  .handler(async ({ data }) => {
    const system: ChatMessage = {
      role: "system",
      content:
        "You are GlowFlow AI, a warm, encouraging productivity + wellness assistant for women managing hormonal acne. " +
        "Balance practical workplace productivity guidance with gut-friendly, anti-inflammatory nutrition tips. " +
        "Be concise, use short markdown sections and bullet lists. " +
        "Always end wellness-related answers with a brief reminder that this is informational, not medical advice.",
    };
    const text = await generateWithLovableAI({
      messages: [system, ...data.messages],
      temperature: 0.8,
    });
    return { text };
  });
