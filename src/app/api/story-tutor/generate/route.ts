import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { topic, ageGroup } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      // Fallback data if no API key is provided
      let fallbackVideoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
      try {
        const youtubeKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBsGZNsD-W2Wsc_YTUng-H8-hEJ6Nr9uVg';
        const searchQuery = `${topic} educational animation for kids`;
        const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=${youtubeKey}`;
        const ytResp = await fetch(ytUrl);
        const ytData = await ytResp.json();
        if (ytData.items && ytData.items.length > 0) {
          fallbackVideoUrl = `https://www.youtube.com/embed/${ytData.items[0].id.videoId}`;
        }
      } catch (e) {
        console.error('Failed to fetch YouTube video for fallback:', e);
      }

      const fallbackData = {
        title: `The Magical Adventure of ${topic}`,
        videoUrl: fallbackVideoUrl,
        conceptSummary: `Here is a fun summary of ${topic}!`,
        story: [
          `Once upon a time, there was an amazing discovery about ${topic}.`,
          `The brave heroes of our story needed to understand how ${topic} worked in order to save the day! They experimented, learned, and found out that it's all about how elements interact in fascinating ways.`,
          `Through teamwork and clever thinking, they completely mastered the concept of ${topic} and lived happily ever after, always eager to learn more!`
        ],
        quiz: [
          {
            question: `What was the main topic the heroes learned about?`,
            options: [topic, "Making Pizza", "Sleeping Next to a Dragon", "Eating Candy"],
            correctAnswerIndex: 0,
            explanation: `The story was entirely about their journey to understand ${topic}.`
          },
          {
            question: `What helped the heroes master the concept?`,
            options: ["Giving up", "Teamwork and clever thinking", "Forgetting the theme", "A magical spell that did all the work"],
            correctAnswerIndex: 1,
            explanation: `Through teamwork and clever thinking, they completely mastered the concept.`
          },
          {
            question: `Why did the heroes need to learn about ${topic}?`,
            options: ["To save the day", "Because they were bored", "To win a shiny trophy", "To pass a difficult exam"],
            correctAnswerIndex: 0,
            explanation: `They needed to understand how ${topic} worked in order to save the day!`
          }
        ]
      };
      
      return NextResponse.json({ data: fallbackData, success: true, source: 'fallback' });
    }

    const prompt = `
      You are an expert children's educator and storyteller.
      Topic to teach: ${topic}
      Target Age Group: ${ageGroup || '8-10'} years old.

      Write a highly engaging, fun, and educational story that explains the concept of "${topic}". 
      The story should be easy to understand for the target age group, using analogies that make learning fun.
      
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
    
    // Fetch an animated YouTube video matching the topic and theme
    let videoUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";
    try {
      const youtubeKey = process.env.YOUTUBE_API_KEY || 'AIzaSyBsGZNsD-W2Wsc_YTUng-H8-hEJ6Nr9uVg';
      const searchQuery = `${topic} educational animation for kids`;
      const ytUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(searchQuery)}&key=${youtubeKey}`;
      
      const ytResp = await fetch(ytUrl);
      const ytData = await ytResp.json();
      
      if (ytData.items && ytData.items.length > 0) {
        const videoId = ytData.items[0].id.videoId;
        videoUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      console.error('Failed to fetch YouTube video:', e);
    }
    
    parsedContent.videoUrl = videoUrl;

    return NextResponse.json({ data: parsedContent, success: true });
  } catch (error: any) {
    console.error('Error generating story:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate story', success: false },
      { status: 500 }
    );
  }
}