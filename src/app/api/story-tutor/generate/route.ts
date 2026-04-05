import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { topic, theme, ageGroup } = await req.json();

    if (!topic || !theme) {
      return NextResponse.json(
        { error: 'Topic and theme are required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `
      You are an expert children's educator and storyteller.
      Topic to teach: ${topic}
      Theme of the story: ${theme}
      Target Age Group: ${ageGroup || '8-10'} years old.

      Write a highly engaging, fun, and educational story that explains the concept of "${topic}" using the theme of "${theme}". 
      The story should be easy to understand for the target age group, using analogies that fit the theme.
      
      After the story, provide 3 multiple-choice questions to test their understanding of the concept based on the story.

      Return the response STRICTLY as a JSON object with the following structure:
      {
        "title": "A catchy title for the story",
        "story": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "..."],
        "conceptSummary": "A 1-2 sentence simple summary of the educational concept",
        "quiz": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswerIndex": 0,
            "explanation": "Why this answer is correct"
          }
        ]
      }
    `;

    const response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful AI that generates educational stories and quizzes in JSON format.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('Failed to generate content');
    }

    const parsedContent = JSON.parse(content);

    return NextResponse.json({ data: parsedContent, success: true });
  } catch (error: any) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate story', success: false },
      { status: 500 }
    );
  }
}