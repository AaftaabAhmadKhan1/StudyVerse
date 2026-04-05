import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  getFallbackBattleQuestions,
  type BattleBoard,
  type BattleClassLevel,
  type BattleMode,
  type BattleQuestion,
} from '@/lib/battleOfBrains';

const SYSTEM_PROMPT = `You generate quiz questions for Indian school students.
Return strict JSON only in this shape:
{
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": ["a", "b", "c", "d"],
      "correctAnswer": 0,
      "difficulty": "easy|medium|hard",
      "subject": "string",
      "explanation": "string"
    }
  ]
}

Rules:
- Generate exactly 10 multiple-choice questions.
- Use this difficulty mix exactly: 3 easy, 4 medium, 3 hard.
- Questions must match the selected board and class level in the Indian school system.
- Every question must have 4 options.
- correctAnswer must be an integer from 0 to 3.
- Keep explanations short and accurate.
- Avoid markdown, prose, or code fences.`;

function sanitizeQuestions(raw: unknown, board: BattleBoard, classLevel: BattleClassLevel) {
  if (!raw || typeof raw !== 'object' || !Array.isArray((raw as { questions?: unknown[] }).questions)) {
    return getFallbackBattleQuestions(board, classLevel);
  }

  const normalized = (raw as { questions: unknown[] }).questions
    .map((item, index): BattleQuestion | null => {
      if (!item || typeof item !== 'object') return null;
      const q = item as Record<string, unknown>;
      if (typeof q.question !== 'string' || !Array.isArray(q.options) || q.options.length !== 4) return null;
      const correctAnswer = Number(q.correctAnswer);
      if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) return null;
      const difficulty = q.difficulty;
      if (difficulty !== 'easy' && difficulty !== 'medium' && difficulty !== 'hard') return null;
      const options = q.options.map((opt) => String(opt));
      return {
        id: typeof q.id === 'string' && q.id ? q.id : `${board.toLowerCase()}-${classLevel}-${index + 1}`,
        question: q.question.trim(),
        options,
        correctAnswer,
        difficulty,
        subject: typeof q.subject === 'string' && q.subject ? q.subject : 'General',
        explanation:
          typeof q.explanation === 'string' && q.explanation
            ? q.explanation
            : 'This is the correct answer for the selected concept.',
      };
    })
    .filter(Boolean) as BattleQuestion[];

  if (normalized.length < 10) {
    return getFallbackBattleQuestions(board, classLevel);
  }

  return normalized.slice(0, 10);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const board = body.board as BattleBoard;
    const classLevel = body.classLevel as BattleClassLevel;
    const mode = body.mode as BattleMode;

    if (!board || !classLevel || !mode) {
      return NextResponse.json({ error: 'Missing board, classLevel, or mode.' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        questions: getFallbackBattleQuestions(board, classLevel),
        source: 'fallback',
      });
    }

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      temperature: 0.6,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        {
          role: 'user',
          content: `Generate a ${mode} battle quiz for ${board} class ${classLevel} students in India. Blend subjects relevant to the board and class. Keep the language crisp, classroom-ready, and age-appropriate.`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({
        questions: getFallbackBattleQuestions(board, classLevel),
        source: 'fallback',
      });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = null;
    }

    return NextResponse.json({
      questions: sanitizeQuestions(parsed, board, classLevel),
      source: 'openai',
    });
  } catch (error) {
    console.error('Battle Of Brains question generation failed:', error);
    return NextResponse.json(
      {
        error: 'Question generation failed.',
      },
      { status: 500 }
    );
  }
}
