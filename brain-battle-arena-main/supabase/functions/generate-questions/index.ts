import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { board, classLevel, pool, battleId } = await req.json();
    
    if (!board || !classLevel || !pool) {
      return new Response(JSON.stringify({ error: "Missing board, classLevel, or pool" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get existing questions from BOTH pools to avoid any repetition across live & practice
    const { data: existingQuestions } = await supabase
      .from("questions")
      .select("question_text")
      .eq("board", board)
      .eq("class_level", classLevel)
      .order("created_at", { ascending: false })
      .limit(200);

    const existingTexts = (existingQuestions || []).map(q => q.question_text).join("\n");

    const subjects: Record<string, Record<string, string[]>> = {
      "CBSE": {
        "9th": ["Mathematics", "Science", "Social Science", "English"],
        "10th": ["Mathematics", "Science", "Social Science", "English"],
        "11th": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
        "12th": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
      },
      "ICSE": {
        "9th": ["Mathematics", "Physics", "Chemistry", "Biology", "History & Civics"],
        "10th": ["Mathematics", "Physics", "Chemistry", "Biology", "History & Civics"],
        "11th": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
        "12th": ["Mathematics", "Physics", "Chemistry", "Biology", "English"],
      },
    };

    const subjectList = subjects[board]?.[classLevel] || ["Mathematics", "Science"];

    const prompt = `Generate exactly 10 multiple choice questions for ${board} Class ${classLevel} students.

DIFFICULTY DISTRIBUTION (STRICT):
- Questions 1-3: EASY difficulty
- Questions 4-7: MEDIUM difficulty  
- Questions 8-10: HARD difficulty

DIAMOND QUESTIONS: Mark questions 2, 5, and 9 as diamond questions (is_diamond: true). All others false.

SUBJECTS: Mix from these subjects: ${subjectList.join(", ")}

Each question must have exactly 4 options (A, B, C, D).
The correct_answer is the 0-based index (0=A, 1=B, 2=C, 3=D).

IMPORTANT: Questions must be aligned to the ${board} Class ${classLevel} syllabus. 
CRITICAL: Do NOT repeat or rephrase ANY of these previously asked questions (from both practice and live sessions):
${existingTexts.slice(0, 3000)}

Return ONLY a valid JSON array with exactly 10 objects, each having:
{
  "question_text": "string",
  "options": ["A option", "B option", "C option", "D option"],
  "correct_answer": 0-3,
  "difficulty": "easy"|"medium"|"hard",
  "subject": "string",
  "is_diamond": boolean
}

Return ONLY the JSON array, no markdown, no explanation.`;

    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: "You are a question generator for Indian school students. Return ONLY valid JSON arrays." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!aiResponse.ok) {
      const status = aiResponse.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await aiResponse.text();
      console.error("AI gateway error:", status, text);
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResponse.json();
    let content = aiData.choices?.[0]?.message?.content || "";
    
    content = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    
    let questions;
    try {
      questions = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI response:", content);
      throw new Error("AI returned invalid JSON");
    }

    if (!Array.isArray(questions) || questions.length < 10) {
      throw new Error("AI returned insufficient questions");
    }

    const questionsToInsert = questions.slice(0, 10).map((q: any, i: number) => ({
      question_text: q.question_text,
      options: q.options,
      correct_answer: q.correct_answer,
      difficulty: q.difficulty,
      subject: q.subject,
      board,
      class_level: classLevel,
      is_diamond: q.is_diamond || false,
      question_pool: pool,
      battle_id: pool === "live" ? battleId : null,
      question_order: i + 1,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from("questions")
      .insert(questionsToInsert)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error("Failed to save questions");
    }

    return new Response(JSON.stringify({ questions: inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-questions error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
