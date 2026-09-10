import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const BASE_SYSTEM =
  "You are a senior workplace productivity assistant. Always write clear, concise, professional, workplace-appropriate content. Never invent specific facts, names, numbers or dates that were not provided by the user; use neutral placeholders in square brackets instead. Output plain text only (no markdown code fences, no commentary about yourself).";

const EmailInput = z.object({
  purpose: z.string().min(1).max(4000),
  tone: z.enum(["friendly", "formal", "persuasive"]),
  recipient: z.string().max(200).optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const { generateText } = await import("./ai-gateway.server");
    const toneGuide = {
      friendly: "warm, approachable and human, but still professional",
      formal: "formal, precise and businesslike",
      persuasive: "confident and persuasive, leading to a clear ask",
    }[data.tone];

    return generateText(
      BASE_SYSTEM,
      [
        "Write a polished professional email.",
        `Tone: ${toneGuide}.`,
        data.recipient ? `Recipient: ${data.recipient}.` : "",
        `Purpose / rough notes from the sender:\n"""${data.purpose}"""`,
        "",
        "Format exactly like this:",
        "Subject: <one concise subject line>",
        "",
        "<greeting>",
        "",
        "<2-4 short paragraphs, tightly written, no filler>",
        "",
        "<sign-off>",
        "[Your name]",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  });

const NotesInput = z.object({
  notes: z.string().min(1).max(20000),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) => {
    const { generateText } = await import("./ai-gateway.server");
    return generateText(
      BASE_SYSTEM,
      [
        "Summarize the following meeting notes for a busy team.",
        "Use these exact section headings, in this order, each on its own line:",
        "SUMMARY",
        "KEY DECISIONS",
        "ACTION ITEMS",
        "DEADLINES",
        "IMPORTANT DISCUSSION POINTS",
        "",
        "Rules: SUMMARY is 2-4 sentences. All other sections are short bullet lines starting with '- '. Action items use the form '- [Owner] task'. If a section has no content, write '- None noted'.",
        "",
        `Meeting notes:\n"""${data.notes}"""`,
      ].join("\n"),
    );
  });

const PlannerInput = z.object({
  tasks: z.string().min(1).max(8000),
  horizon: z.enum(["daily", "weekly"]),
  hoursPerDay: z.string().max(40).optional(),
  workingHours: z.string().max(120).optional(),
});

export const planTasks = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => PlannerInput.parse(input))
  .handler(async ({ data }) => {
    const { generateText } = await import("./ai-gateway.server");
    return generateText(
      BASE_SYSTEM,
      [
        `Build an optimized ${data.horizon} work schedule.`,
        data.hoursPerDay ? `Available focus hours per day: ${data.hoursPerDay}.` : "",
        data.workingHours ? `Working hours / constraints: ${data.workingHours}.` : "",
        `Tasks, priorities and deadlines provided by the user:\n"""${data.tasks}"""`,
        "",
        "Output using these exact headings:",
        "PRIORITIES",
        "- ranked list, highest impact and most deadline-critical first, each with a one-line reason",
        "",
        "SCHEDULE",
        data.horizon === "daily"
          ? "- time-blocked timetable lines like '09:00-10:30 — Task (priority)' including short breaks"
          : "- one block per weekday: 'Monday' then time-blocked lines beneath it",
        "",
        "NOTES & RISKS",
        "- short bullets on tight deadlines, overload or things to renegotiate",
        "",
        "Keep it realistic: never schedule more work than the available time allows.",
      ]
        .filter(Boolean)
        .join("\n"),
    );
  });
