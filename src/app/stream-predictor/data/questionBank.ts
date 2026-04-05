import type { Question } from "./questions";

// ─── QUESTION BANK ──────────────────────────────────────────────────────────
// 150+ questions across 8 categories.
// Every quiz randomly picks a stratified sample so no two quizzes are the same.
//
// Categories:
//   interest    – What naturally draws your attention
//   subject     – Academic subject preferences
//   personality – Big-Five psychometric personality traits
//   aptitude    – Logical, verbal & numerical thinking style
//   scenario    – Real-life situation responses
//   aspiration  – Future dreams and goals
//   hobby       – Free time and leisure
//   values      – Core beliefs and principles
// ─────────────────────────────────────────────────────────────────────────────

export type QuestionCategory =
  | "interest"
  | "subject"
  | "personality"
  | "aptitude"
  | "scenario"
  | "aspiration"
  | "hobby"
  | "values";

export interface BankQuestion extends Question {
  category: QuestionCategory;
}

export const QUESTION_BANK: BankQuestion[] = [

  // ══════════════════════════════════════════════════════
  //  INTEREST  (25 questions)
  // ══════════════════════════════════════════════════════
  {
    id: 101, category: "interest",
    question: "What excites you the most?",
    subtitle: "Pick what truly resonates with you",
    options: [
      { text: "How machines and technology work", scores: { pcm: 3, creative: 1 } },
      { text: "How the human body and nature function", scores: { pcb: 3, humanities: 1 } },
      { text: "How businesses make money and grow", scores: { commerce: 3, humanities: 1 } },
      { text: "How societies, cultures and people think", scores: { humanities: 3, creative: 1 } },
      { text: "Creating art, designs or visual stories", scores: { creative: 3, humanities: 1 } },
    ],
  },
  {
    id: 102, category: "interest",
    question: "Which section do you head to first in a bookstore?",
    options: [
      { text: "Science & Technology", scores: { pcm: 3, pcb: 1 } },
      { text: "Health, Medicine & Nature", scores: { pcb: 3 } },
      { text: "Business, Finance & Economics", scores: { commerce: 3 } },
      { text: "History, Philosophy & Politics", scores: { humanities: 3 } },
      { text: "Art, Design & Photography", scores: { creative: 3 } },
    ],
  },
  {
    id: 103, category: "interest",
    question: "Which YouTube channel would you binge-watch?",
    options: [
      { text: "Tech & gadget reviews, coding tutorials", scores: { pcm: 3 } },
      { text: "Medical cases, biology, health science", scores: { pcb: 3 } },
      { text: "Shark Tank, startup stories, finance tips", scores: { commerce: 3 } },
      { text: "True crime, philosophy, political commentary", scores: { humanities: 3 } },
      { text: "Art processes, design breakdowns, filmmaking", scores: { creative: 3 } },
    ],
  },
  {
    id: 104, category: "interest",
    question: "Your phone's most-used app category is probably...",
    options: [
      { text: "Coding, maths, or science apps", scores: { pcm: 3 } },
      { text: "Health trackers or biology apps", scores: { pcb: 3 } },
      { text: "Finance apps, stock markets, or business news", scores: { commerce: 3 } },
      { text: "News, podcast, or debate/discussion apps", scores: { humanities: 3 } },
      { text: "Instagram, Pinterest, Canva, or creative tools", scores: { creative: 3 } },
    ],
  },
  {
    id: 105, category: "interest",
    question: "What kind of documentary would you watch voluntarily?",
    options: [
      { text: "Space exploration or quantum physics", scores: { pcm: 3 } },
      { text: "Wildlife, human anatomy, or pandemics", scores: { pcb: 3 } },
      { text: "Rise of a business empire or economic collapse", scores: { commerce: 3 } },
      { text: "Political revolutions or social movements", scores: { humanities: 3 } },
      { text: "Behind-the-scenes of film, fashion, or art", scores: { creative: 3 } },
    ],
  },
  {
    id: 106, category: "interest",
    question: "What topic could you research for hours without getting bored?",
    options: [
      { text: "How AI or quantum computing works", scores: { pcm: 3 } },
      { text: "How vaccines or the brain functions", scores: { pcb: 3 } },
      { text: "How the stock market behaves", scores: { commerce: 3 } },
      { text: "Why wars begin or how laws are made", scores: { humanities: 3 } },
      { text: "How great designers or artists think", scores: { creative: 3 } },
    ],
  },
  {
    id: 107, category: "interest",
    question: "At a science fair you'd most likely exhibit...",
    options: [
      { text: "A working robot or an app prototype", scores: { pcm: 3 } },
      { text: "A project on plant genetics or the human nervous system", scores: { pcb: 3 } },
      { text: "A business plan or market analysis project", scores: { commerce: 3 } },
      { text: "A social survey or a mock debate setup", scores: { humanities: 3 } },
      { text: "A design installation or short film", scores: { creative: 3 } },
    ],
  },
  {
    id: 108, category: "interest",
    question: "If you could attend any event, which would you pick?",
    options: [
      { text: "A hackathon or robotics championship", scores: { pcm: 3 } },
      { text: "A medical conference or nature expedition", scores: { pcb: 3 } },
      { text: "A startup pitch competition or TEDx business talk", scores: { commerce: 3 } },
      { text: "A debate tournament or journalism summit", scores: { humanities: 3 } },
      { text: "An art exhibition or film festival", scores: { creative: 3 } },
    ],
  },
  {
    id: 109, category: "interest",
    question: "Which museum would you choose to visit?",
    options: [
      { text: "Science & Technology Museum", scores: { pcm: 3 } },
      { text: "Natural History Museum", scores: { pcb: 3 } },
      { text: "Economic History or Trade Museum", scores: { commerce: 3 } },
      { text: "War & Civilization Museum", scores: { humanities: 3 } },
      { text: "Modern Art or Design Museum", scores: { creative: 3 } },
    ],
  },
  {
    id: 110, category: "interest",
    question: "Which class would you voluntarily take as an elective?",
    options: [
      { text: "Introduction to Machine Learning", scores: { pcm: 3 } },
      { text: "Human Nutrition & Health Science", scores: { pcb: 3 } },
      { text: "Personal Finance & Stock Markets", scores: { commerce: 3 } },
      { text: "Introduction to Law & Ethics", scores: { humanities: 3 } },
      { text: "Graphic Design & Digital Media", scores: { creative: 3 } },
    ],
  },
  {
    id: 111, category: "interest",
    question: "What aspect of a city fascinates you the most?",
    options: [
      { text: "Its infrastructure — bridges, metro, smart systems", scores: { pcm: 3 } },
      { text: "Its hospitals, green spaces, and public health", scores: { pcb: 3 } },
      { text: "Its markets, trade, and economic engine", scores: { commerce: 3 } },
      { text: "Its culture, history, and social diversity", scores: { humanities: 3 } },
      { text: "Its architecture, murals, and artistic identity", scores: { creative: 3 } },
    ],
  },
  {
    id: 112, category: "interest",
    question: "Which innovation are you most excited about?",
    options: [
      { text: "Self-driving cars and neural chips", scores: { pcm: 3 } },
      { text: "CRISPR gene editing and cancer cure", scores: { pcb: 3 } },
      { text: "Blockchain finance and decentralized banking", scores: { commerce: 3 } },
      { text: "AI for social justice and policy making", scores: { humanities: 3 } },
      { text: "AI-generated art and immersive VR experiences", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  SUBJECT  (18 questions)
  // ══════════════════════════════════════════════════════
  {
    id: 201, category: "subject",
    question: "Your favorite subject in school?",
    subtitle: "Which one do you genuinely enjoy the most",
    options: [
      { text: "Mathematics — I love solving problems", scores: { pcm: 3, commerce: 2 } },
      { text: "Biology — The living world fascinates me", scores: { pcb: 3 } },
      { text: "Social Science — History, Civics, Geography", scores: { humanities: 3, commerce: 1 } },
      { text: "Art or Craft — I love creating things", scores: { creative: 3 } },
      { text: "English / Languages — I love reading and writing", scores: { humanities: 2, creative: 2 } },
    ],
  },
  {
    id: 202, category: "subject",
    question: "Which exam would you feel most confident preparing for?",
    options: [
      { text: "JEE (Engineering)", scores: { pcm: 3 } },
      { text: "NEET (Medical)", scores: { pcb: 3 } },
      { text: "CA Foundation (Commerce)", scores: { commerce: 3 } },
      { text: "CLAT (Law) or UPSC", scores: { humanities: 3 } },
      { text: "NID/NIFT (Design)", scores: { creative: 3 } },
    ],
  },
  {
    id: 203, category: "subject",
    question: "Which type of homework do you finish first?",
    options: [
      { text: "Maths problems — I find them satisfying", scores: { pcm: 3, commerce: 1 } },
      { text: "Science diagrams — they're interesting", scores: { pcb: 3, pcm: 1 } },
      { text: "Economics or accounts — logic + numbers", scores: { commerce: 3 } },
      { text: "Essay writing or history notes", scores: { humanities: 3 } },
      { text: "Drawing, craft, or project work", scores: { creative: 3 } },
    ],
  },
  {
    id: 204, category: "subject",
    question: "Which school chapter did you find most fascinating?",
    options: [
      { text: "Laws of Motion or Electricity", scores: { pcm: 3 } },
      { text: "The Human Digestive System or Genetics", scores: { pcb: 3 } },
      { text: "Money, Banking & Globalisation", scores: { commerce: 3 } },
      { text: "The French Revolution or Indian Independence", scores: { humanities: 3 } },
      { text: "Perspective Drawing or Design Principles", scores: { creative: 3 } },
    ],
  },
  {
    id: 205, category: "subject",
    question: "Which project would you most enjoy doing?",
    options: [
      { text: "Build a working circuit or code a program", scores: { pcm: 3 } },
      { text: "Conduct a biology experiment or nature study", scores: { pcb: 3 } },
      { text: "Create a business financial plan", scores: { commerce: 3 } },
      { text: "Write a social research paper or debate prep", scores: { humanities: 3 } },
      { text: "Design a poster, video, or short film", scores: { creative: 3 } },
    ],
  },
  {
    id: 206, category: "subject",
    question: "If you had an extra hour of free study time, what would you do?",
    options: [
      { text: "Solve extra maths or physics problems", scores: { pcm: 3 } },
      { text: "Read about biology discoveries or anatomy", scores: { pcb: 3 } },
      { text: "Study market trends or business case studies", scores: { commerce: 3 } },
      { text: "Read current affairs or political philosophy", scores: { humanities: 3 } },
      { text: "Watch design tutorials or draw something", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  PERSONALITY  (28 questions — psychometric)
  // ══════════════════════════════════════════════════════
  {
    id: 301, category: "personality",
    question: "After a long, exhausting day — what recharges you?",
    subtitle: "This reveals a lot about how your mind works",
    options: [
      { text: "Solving a puzzle or working on a project alone", scores: { pcm: 2, pcb: 1 } },
      { text: "Journaling, reading, or quiet reflection", scores: { humanities: 2, pcb: 1 } },
      { text: "Talking with a close friend about ideas", scores: { humanities: 2, commerce: 1 } },
      { text: "Being around people, socializing, laughing", scores: { commerce: 2, creative: 1 } },
      { text: "Creating something — drawing, music, writing", scores: { creative: 3 } },
    ],
  },
  {
    id: 302, category: "personality",
    question: "When approaching a new problem, you typically...",
    subtitle: "No right or wrong — just describe yourself honestly",
    options: [
      { text: "Break it down into logical steps and analyze data", scores: { pcm: 3, commerce: 1 } },
      { text: "Research thoroughly and look at patterns", scores: { pcb: 2, humanities: 2 } },
      { text: "Think about the practical outcome and cost", scores: { commerce: 3 } },
      { text: "Consider how it affects people emotionally", scores: { humanities: 3 } },
      { text: "Brainstorm wildly and trust your instincts", scores: { creative: 3 } },
    ],
  },
  {
    id: 303, category: "personality",
    question: "People who know you well would describe you as...",
    options: [
      { text: "Logical, precise, and technically-minded", scores: { pcm: 3 } },
      { text: "Curious, careful, and detail-oriented", scores: { pcb: 3, pcm: 1 } },
      { text: "Ambitious, practical, and goal-driven", scores: { commerce: 3 } },
      { text: "Empathetic, thoughtful, and a good listener", scores: { humanities: 3 } },
      { text: "Creative, expressive, and imaginative", scores: { creative: 3 } },
    ],
  },
  {
    id: 304, category: "personality",
    question: "In a group project, you naturally take the role of...",
    options: [
      { text: "The technical expert — you solve the hard problems", scores: { pcm: 3 } },
      { text: "The researcher — you gather facts and evidence", scores: { pcb: 2, humanities: 2 } },
      { text: "The organizer — you plan timelines and manage tasks", scores: { commerce: 3 } },
      { text: "The communicator — you present and persuade", scores: { humanities: 3 } },
      { text: "The creative — you design the look and feel", scores: { creative: 3 } },
    ],
  },
  {
    id: 305, category: "personality",
    question: "When something goes wrong, your first instinct is to...",
    options: [
      { text: "Find the root cause — debug the system", scores: { pcm: 3 } },
      { text: "Observe carefully and run experiments", scores: { pcb: 3 } },
      { text: "Assess the financial or practical damage", scores: { commerce: 3 } },
      { text: "Talk it out and understand everyone's feelings", scores: { humanities: 3 } },
      { text: "Try an unconventional creative solution", scores: { creative: 3 } },
    ],
  },
  {
    id: 306, category: "personality",
    question: "Your biggest strength according to you is...",
    options: [
      { text: "Rational thinking and precision", scores: { pcm: 3 } },
      { text: "Patience and methodical observation", scores: { pcb: 3 } },
      { text: "Strategic thinking and leadership", scores: { commerce: 3 } },
      { text: "Understanding people and communication", scores: { humanities: 3 } },
      { text: "Imagination and originality", scores: { creative: 3 } },
    ],
  },
  {
    id: 307, category: "personality",
    question: "How do you typically make important decisions?",
    subtitle: "Think about what you actually do, not what you should do",
    options: [
      { text: "Analyze all available data and pick the logical answer", scores: { pcm: 3 } },
      { text: "Research, observe, and gather evidence first", scores: { pcb: 2, humanities: 1 } },
      { text: "Weigh risks vs rewards — what gives the best return", scores: { commerce: 3 } },
      { text: "Consider how it will affect others around me", scores: { humanities: 3 } },
      { text: "Trust my gut feeling and creative instinct", scores: { creative: 3 } },
    ],
  },
  {
    id: 308, category: "personality",
    question: "When bored in a class, what do you find yourself doing?",
    options: [
      { text: "Doodling diagrams, circuits, or math patterns", scores: { pcm: 3 } },
      { text: "Sketching biological structures or patterns from nature", scores: { pcb: 3 } },
      { text: "Making mental budgets or business plans", scores: { commerce: 3 } },
      { text: "Writing thoughts, stories, or imaginary debates", scores: { humanities: 2, creative: 1 } },
      { text: "Drawing, doodling characters or design ideas", scores: { creative: 3 } },
    ],
  },
  {
    id: 309, category: "personality",
    question: "How do you respond when you receive critical feedback?",
    subtitle: "Psychometric: emotional resilience indicator",
    options: [
      { text: "Analyze it systematically — is it logically valid?", scores: { pcm: 3 } },
      { text: "Research if the feedback is scientifically accurate", scores: { pcb: 2 } },
      { text: "Consider the practical implications for my goals", scores: { commerce: 2 } },
      { text: "Reflect deeply on how it makes me feel and grow", scores: { humanities: 3 } },
      { text: "Use it as fuel for creative reinvention", scores: { creative: 3 } },
    ],
  },
  {
    id: 310, category: "personality",
    question: "How comfortable are you with uncertainty and ambiguity?",
    subtitle: "Psychometric: openness to experience",
    options: [
      { text: "I prefer clear rules and structured logic", scores: { pcm: 2 } },
      { text: "I follow a systematic process even in chaos", scores: { pcb: 2 } },
      { text: "I calculate the risks and plan contingencies", scores: { commerce: 2 } },
      { text: "I embrace it — complex situations are interesting", scores: { humanities: 3 } },
      { text: "I thrive in it — ambiguity fuels my creativity", scores: { creative: 3 } },
    ],
  },
  {
    id: 311, category: "personality",
    question: "When you see an injustice, you tend to...",
    subtitle: "Psychometric: agreeableness & social conscience",
    options: [
      { text: "Think about systematic solutions to fix the root cause", scores: { pcm: 2, pcb: 1 } },
      { text: "Research evidence and statistics to understand it better", scores: { pcb: 2, humanities: 1 } },
      { text: "Think about the economic or policy reform needed", scores: { commerce: 2, humanities: 1 } },
      { text: "Feel deeply moved and want to speak up or act", scores: { humanities: 3 } },
      { text: "Express my feelings through writing, art, or creation", scores: { creative: 3, humanities: 1 } },
    ],
  },
  {
    id: 312, category: "personality",
    question: "Your friends come to you when they need help with...",
    options: [
      { text: "Fixing tech, math homework, or logical problems", scores: { pcm: 3 } },
      { text: "Health advice or understanding science concepts", scores: { pcb: 3 } },
      { text: "Managing money, planning events, or strategy", scores: { commerce: 3 } },
      { text: "Emotional support or life advice", scores: { humanities: 3 } },
      { text: "Making things look amazing — posters, videos, content", scores: { creative: 3 } },
    ],
  },
  {
    id: 313, category: "personality",
    question: "How do you prefer to learn something new?",
    subtitle: "Psychometric: learning style indicator",
    options: [
      { text: "Through formulas, models, and practical experiments", scores: { pcm: 3 } },
      { text: "Through observation, hands-on dissection, fieldwork", scores: { pcb: 3 } },
      { text: "Through case studies and real-world business examples", scores: { commerce: 3 } },
      { text: "Through stories, debates, and exploring multiple viewpoints", scores: { humanities: 3 } },
      { text: "Through visual formats — videos, illustrations, design", scores: { creative: 3 } },
    ],
  },
  {
    id: 314, category: "personality",
    question: "Which phrase describes you best?",
    subtitle: "Psychometric: self-concept indicator",
    options: [
      { text: "I am most productive when everything is structured", scores: { pcm: 2, pcb: 2 } },
      { text: "I like precision — details and accuracy matter a lot", scores: { pcb: 3 } },
      { text: "I am driven by results and measurable outcomes", scores: { commerce: 3 } },
      { text: "I understand people better than most people do", scores: { humanities: 3 } },
      { text: "I see beauty and meaning in things others miss", scores: { creative: 3 } },
    ],
  },
  {
    id: 315, category: "personality",
    question: "Someone gives you a complex task. Your first reaction is...",
    subtitle: "Psychometric: conscientiousness indicator",
    options: [
      { text: "Excited — I love a good puzzle to crack", scores: { pcm: 3 } },
      { text: "Careful — I'll gather all info before starting", scores: { pcb: 3 } },
      { text: "Focused — I want to know the deadline and deliverables", scores: { commerce: 3 } },
      { text: "Curious — I want to understand the context first", scores: { humanities: 3 } },
      { text: "Inspired — I already have 5 ideas in my head", scores: { creative: 3 } },
    ],
  },
  {
    id: 316, category: "personality",
    question: "How do you handle working under pressure?",
    subtitle: "Psychometric: neuroticism & stress response",
    options: [
      { text: "I break the problem into smaller logical steps", scores: { pcm: 3 } },
      { text: "I stay calm and methodically work through it", scores: { pcb: 3, pcm: 1 } },
      { text: "I prioritize ruthlessly — what's most impactful?", scores: { commerce: 3 } },
      { text: "I seek support from teammates and talk it out", scores: { humanities: 3 } },
      { text: "I find a creative shortcut others missed", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  APTITUDE  (20 questions — psychometric)
  // ══════════════════════════════════════════════════════
  {
    id: 401, category: "aptitude",
    question: "You find a pattern in a series of numbers. You feel...",
    subtitle: "Psychometric: numerical aptitude",
    options: [
      { text: "Deeply satisfied — patterns are everywhere in nature", scores: { pcm: 3 } },
      { text: "Intrigued — could this pattern appear in biology?", scores: { pcb: 2 } },
      { text: "Immediately think: how can I use this for forecasting?", scores: { commerce: 3 } },
      { text: "Wonder what it means philosophically or culturally", scores: { humanities: 2 } },
      { text: "Think: this would make a beautiful visual design", scores: { creative: 2 } },
    ],
  },
  {
    id: 402, category: "aptitude",
    question: "If you had to explain a complex concept, you would use...",
    subtitle: "Psychometric: communication aptitude",
    options: [
      { text: "A precise mathematical equation or diagram", scores: { pcm: 3 } },
      { text: "A biological analogy from nature", scores: { pcb: 3 } },
      { text: "A real-world business case or market example", scores: { commerce: 3 } },
      { text: "A story or historical analogy", scores: { humanities: 3 } },
      { text: "A visual — sketch, infographic, or animation", scores: { creative: 3 } },
    ],
  },
  {
    id: 403, category: "aptitude",
    question: "Which challenge do you find most appealing?",
    subtitle: "Psychometric: problem-type preference",
    options: [
      { text: "Optimizing an algorithm to run 10x faster", scores: { pcm: 3 } },
      { text: "Identifying why a plant species is declining", scores: { pcb: 3 } },
      { text: "Turning a losing business profitable in 6 months", scores: { commerce: 3 } },
      { text: "Mediating a conflict between two communities", scores: { humanities: 3 } },
      { text: "Designing a logo that everyone instantly loves", scores: { creative: 3 } },
    ],
  },
  {
    id: 404, category: "aptitude",
    question: "When you read, you most enjoy...",
    subtitle: "Psychometric: verbal aptitude style",
    options: [
      { text: "Technical manuals, how-things-work articles", scores: { pcm: 3 } },
      { text: "Scientific research papers or medical journals", scores: { pcb: 3 } },
      { text: "Business case studies or economic analyses", scores: { commerce: 3 } },
      { text: "Novels, political essays, memoirs", scores: { humanities: 3 } },
      { text: "Art books, screenplays, poetry collections", scores: { creative: 3 } },
    ],
  },
  {
    id: 405, category: "aptitude",
    question: "How would you describe your memory style?",
    subtitle: "Psychometric: cognitive style indicator",
    options: [
      { text: "Best with formulas, numbers, and logical systems", scores: { pcm: 3 } },
      { text: "Best with processes, biology cycles, and sequences", scores: { pcb: 3 } },
      { text: "Best with trends, figures, and financial data", scores: { commerce: 3 } },
      { text: "Best with names, stories, and contextual details", scores: { humanities: 3 } },
      { text: "Best with images, shapes, colours, and spatial layouts", scores: { creative: 3 } },
    ],
  },
  {
    id: 406, category: "aptitude",
    question: "You're given raw data from a survey. You want to...",
    subtitle: "Psychometric: data interpretation style",
    options: [
      { text: "Build a statistical model or algorithm from it", scores: { pcm: 3 } },
      { text: "Look for health or behavioral patterns", scores: { pcb: 2, humanities: 1 } },
      { text: "Identify market opportunities or financial trends", scores: { commerce: 3 } },
      { text: "Understand the human stories and social implications", scores: { humanities: 3 } },
      { text: "Visualize it beautifully as an infographic or chart", scores: { creative: 3 } },
    ],
  },
  {
    id: 407, category: "aptitude",
    question: "Which type of puzzle do you most enjoy solving?",
    subtitle: "Psychometric: cognitive preference",
    options: [
      { text: "Logic puzzles — mathematical and deductive", scores: { pcm: 3 } },
      { text: "Pattern recognition — like spotting anomalies in nature", scores: { pcb: 2, pcm: 1 } },
      { text: "Strategy games — chess, resource management", scores: { commerce: 3 } },
      { text: "Word puzzles, cryptic crosswords, lateral thinking", scores: { humanities: 3 } },
      { text: "Visual puzzles — jigsaws, spatial reasoning, design", scores: { creative: 3 } },
    ],
  },
  {
    id: 408, category: "aptitude",
    question: "In your mind, the world is mostly governed by...",
    subtitle: "Psychometric: worldview/epistemic style",
    options: [
      { text: "Mathematical laws and physical principles", scores: { pcm: 3 } },
      { text: "Biological and ecological systems", scores: { pcb: 3 } },
      { text: "Economic forces and incentive structures", scores: { commerce: 3 } },
      { text: "Power, culture, ideology, and human behavior", scores: { humanities: 3 } },
      { text: "Creativity, aesthetics, and subjective meaning", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  SCENARIO  (20 questions)
  // ══════════════════════════════════════════════════════
  {
    id: 501, category: "scenario",
    question: "It's a free weekend. What are you most likely doing?",
    options: [
      { text: "Building something — a robot, app, or gadget", scores: { pcm: 3, creative: 1 } },
      { text: "Watching a nature documentary or gardening", scores: { pcb: 3 } },
      { text: "Planning a micro-business or tracking investments", scores: { commerce: 3 } },
      { text: "Reading books, debating, or watching the news", scores: { humanities: 3 } },
      { text: "Drawing, painting, making videos, or playing music", scores: { creative: 3 } },
    ],
  },
  {
    id: 502, category: "scenario",
    question: "You just won ₹10 lakh. What do you do first?",
    options: [
      { text: "Buy a powerful laptop or lab equipment", scores: { pcm: 3 } },
      { text: "Fund a medical or environmental initiative", scores: { pcb: 3, humanities: 1 } },
      { text: "Invest it or start a small business", scores: { commerce: 3 } },
      { text: "Donate to a social cause or NGO", scores: { humanities: 3 } },
      { text: "Set up a creative studio or art space", scores: { creative: 3 } },
    ],
  },
  {
    id: 503, category: "scenario",
    question: "Your school needs a volunteer for a community project. You'd naturally choose...",
    options: [
      { text: "Building a solar-powered device for the school", scores: { pcm: 3 } },
      { text: "Running a health awareness or first-aid camp", scores: { pcb: 3 } },
      { text: "Organizing fundraising or sponsorship", scores: { commerce: 3 } },
      { text: "Interviewing community members and writing their stories", scores: { humanities: 3 } },
      { text: "Designing the event posters and stage backdrop", scores: { creative: 3 } },
    ],
  },
  {
    id: 504, category: "scenario",
    question: "You're watching the news and a story grabs your attention. It's about...",
    options: [
      { text: "A breakthrough in space technology or AI", scores: { pcm: 3 } },
      { text: "A new vaccine or rare disease outbreak", scores: { pcb: 3 } },
      { text: "A company's IPO or India's GDP growth", scores: { commerce: 3 } },
      { text: "A court verdict that changes civil rights", scores: { humanities: 3 } },
      { text: "An Indian filmmaker winning an international award", scores: { creative: 3 } },
    ],
  },
  {
    id: 505, category: "scenario",
    question: "A 10-year-old asks you: 'What should I want to be?' You say...",
    options: [
      { text: "An engineer or scientist — they shape the future", scores: { pcm: 3 } },
      { text: "A doctor — you'll save lives every day", scores: { pcb: 3 } },
      { text: "An entrepreneur — you'll be your own boss", scores: { commerce: 3 } },
      { text: "A lawyer or journalist — give a voice to the voiceless", scores: { humanities: 3 } },
      { text: "An artist or designer — make the world more beautiful", scores: { creative: 3 } },
    ],
  },
  {
    id: 506, category: "scenario",
    question: "You have one month of free time and zero obligations. You'd spend it...",
    options: [
      { text: "Building a side project — app, website, experiment", scores: { pcm: 3 } },
      { text: "Traveling to study nature, wildlife, or local health issues", scores: { pcb: 3 } },
      { text: "Learning trading, building a portfolio, reading business books", scores: { commerce: 3 } },
      { text: "Traveling and writing about culture, history, and people", scores: { humanities: 3 } },
      { text: "Creating content — writing, designing, filmmaking", scores: { creative: 3 } },
    ],
  },
  {
    id: 507, category: "scenario",
    question: "At a dinner table argument, you're most likely defending...",
    options: [
      { text: "Why technology will solve all human problems", scores: { pcm: 3 } },
      { text: "Why Universal Healthcare should be a right", scores: { pcb: 2, humanities: 2 } },
      { text: "Why free markets create the most prosperity", scores: { commerce: 3 } },
      { text: "Why history matters for understanding today's problems", scores: { humanities: 3 } },
      { text: "Why art and creativity are as essential as science", scores: { creative: 3 } },
    ],
  },
  {
    id: 508, category: "scenario",
    question: "If you could shadow one type of professional for a week, it would be...",
    options: [
      { text: "A software engineer at a top tech firm", scores: { pcm: 3 } },
      { text: "A neurosurgeon or research biologist", scores: { pcb: 3 } },
      { text: "A startup founder or investment banker", scores: { commerce: 3 } },
      { text: "A Supreme Court lawyer or foreign correspondent journalist", scores: { humanities: 3 } },
      { text: "A film director or head of design at a brand", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  ASPIRATION  (18 questions)
  // ══════════════════════════════════════════════════════
  {
    id: 601, category: "aspiration",
    question: "Close your eyes. At age 30, what do you see yourself doing?",
    subtitle: "Trust your very first instinct",
    options: [
      { text: "Working at a top tech company or running a startup", scores: { pcm: 3 } },
      { text: "Wearing a white coat and saving lives", scores: { pcb: 3 } },
      { text: "In a boardroom making major business decisions", scores: { commerce: 3 } },
      { text: "Influencing policy, law, or public discourse", scores: { humanities: 3 } },
      { text: "Showcasing work — on screens, galleries, or stages", scores: { creative: 3 } },
    ],
  },
  {
    id: 602, category: "aspiration",
    question: "Which achievement would make you proudest?",
    options: [
      { text: "Inventing technology that changes the world", scores: { pcm: 3 } },
      { text: "Discovering a cure for a deadly disease", scores: { pcb: 3 } },
      { text: "Building a company worth ₹1000+ crore", scores: { commerce: 3 } },
      { text: "Winning a landmark legal case that changes a law", scores: { humanities: 3 } },
      { text: "Creating a film, album, or artwork that moves millions", scores: { creative: 3 } },
    ],
  },
  {
    id: 603, category: "aspiration",
    question: "Your dream workspace looks like...",
    options: [
      { text: "A high-tech lab with powerful computers and whiteboards", scores: { pcm: 3 } },
      { text: "A hospital, research lab, or outdoor field station", scores: { pcb: 3 } },
      { text: "A corporate office tower or my own company", scores: { commerce: 3 } },
      { text: "A law chamber, newsroom, or government office", scores: { humanities: 3 } },
      { text: "A creative studio filled with art supplies and screens", scores: { creative: 3 } },
    ],
  },
  {
    id: 604, category: "aspiration",
    question: "What kind of legacy do you want to leave?",
    options: [
      { text: "A breakthrough invention or scientific discovery", scores: { pcm: 3 } },
      { text: "Healthier communities and a better understanding of life", scores: { pcb: 3, humanities: 1 } },
      { text: "A thriving business that employs hundreds of people", scores: { commerce: 3 } },
      { text: "A fairer, more just society", scores: { humanities: 3 } },
      { text: "A body of creative work that inspires future generations", scores: { creative: 3 } },
    ],
  },
  {
    id: 605, category: "aspiration",
    question: "If money wasn't a factor, you would spend your life...",
    options: [
      { text: "Solving the hardest technical problems in science", scores: { pcm: 3 } },
      { text: "Researching living organisms or healing the sick", scores: { pcb: 3 } },
      { text: "Building businesses and creating economic opportunity", scores: { commerce: 3 } },
      { text: "Advocating for human rights and social change", scores: { humanities: 3 } },
      { text: "Making art, music, films, or beautiful experiences", scores: { creative: 3 } },
    ],
  },
  {
    id: 606, category: "aspiration",
    question: "Which future India headline would make you proudest to have contributed to?",
    options: [
      { text: "India launches its first crewed mission to Mars", scores: { pcm: 3 } },
      { text: "India eradicates TB — doctor leads historic breakthrough", scores: { pcb: 3 } },
      { text: "India becomes a $10 trillion economy", scores: { commerce: 3 } },
      { text: "India tops global Human Development Index", scores: { humanities: 3 } },
      { text: "Indian designer wins BAFTA / Oscar / Cannes Grand Prix", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  HOBBY  (18 questions)
  // ══════════════════════════════════════════════════════
  {
    id: 701, category: "hobby",
    question: "What do you do when you have absolutely no plans?",
    options: [
      { text: "Tinker with gadgets or learn to code something", scores: { pcm: 3 } },
      { text: "Watch science content or explore nature nearby", scores: { pcb: 3 } },
      { text: "Research investing, side hustles, or new business ideas", scores: { commerce: 3 } },
      { text: "Read a book, write a diary, or listen to a podcast", scores: { humanities: 3 } },
      { text: "Draw, make music, photograph things, or edit videos", scores: { creative: 3 } },
    ],
  },
  {
    id: 702, category: "hobby",
    question: "What kind of games do you most enjoy?",
    options: [
      { text: "Puzzle games, coding challenges, or strategy simulations", scores: { pcm: 3 } },
      { text: "Exploration or survival games in natural environments", scores: { pcb: 2, creative: 1 } },
      { text: "City builders, empire games, or economic simulations", scores: { commerce: 3 } },
      { text: "Story-rich RPGs with deep lore and political intrigue", scores: { humanities: 3 } },
      { text: "Creative sandbox games — Minecraft, art, or design tools", scores: { creative: 3 } },
    ],
  },
  {
    id: 703, category: "hobby",
    question: "What kind of content do you most enjoy creating?",
    options: [
      { text: "Technical tutorials, product reviews, or code walkthroughs", scores: { pcm: 3 } },
      { text: "Science explainers or food/health content", scores: { pcb: 3 } },
      { text: "Finance tips, business vlogs, or entrepreneurship content", scores: { commerce: 3 } },
      { text: "Opinion pieces, essays, or political commentary", scores: { humanities: 3 } },
      { text: "Art, photography, reels, music, or storytelling", scores: { creative: 3 } },
    ],
  },
  {
    id: 704, category: "hobby",
    question: "Which extracurricular activity appeals to you most?",
    options: [
      { text: "Science Olympiad or competitive programming club", scores: { pcm: 3 } },
      { text: "Nature club, health awareness drives, or bio quiz", scores: { pcb: 3 } },
      { text: "Entrepreneurship club or stock market simulation", scores: { commerce: 3 } },
      { text: "Debate team, MUN, or journalism club", scores: { humanities: 3 } },
      { text: "Theatre, dance, art, or audio-visual production", scores: { creative: 3 } },
    ],
  },
  {
    id: 705, category: "hobby",
    question: "Which book would you finish in one sitting?",
    options: [
      { text: "A Brief History of Time — Stephen Hawking", scores: { pcm: 3 } },
      { text: "The Gene: An Intimate History — Siddhartha Mukherjee", scores: { pcb: 3 } },
      { text: "Rich Dad Poor Dad — Robert Kiyosaki", scores: { commerce: 3 } },
      { text: "Sapiens — Yuval Noah Harari", scores: { humanities: 3 } },
      { text: "Steal Like an Artist — Austin Kleon", scores: { creative: 3 } },
    ],
  },
  {
    id: 706, category: "hobby",
    question: "If you had to pick a side hustle today, it would be...",
    options: [
      { text: "Freelance app/web development or tutoring maths", scores: { pcm: 3 } },
      { text: "Health and nutrition coaching or nature photography", scores: { pcb: 2, creative: 1 } },
      { text: "Day trading, dropshipping, or consulting", scores: { commerce: 3 } },
      { text: "Writing a blog, podcast, or teaching English online", scores: { humanities: 3 } },
      { text: "Selling artwork, design templates, or editing videos", scores: { creative: 3 } },
    ],
  },

  // ══════════════════════════════════════════════════════
  //  VALUES  (22 questions)
  // ══════════════════════════════════════════════════════
  {
    id: 801, category: "values",
    question: "What scares you the most about your future?",
    subtitle: "Fears reveal what you deeply care about",
    options: [
      { text: "Being stuck doing work that doesn't challenge my intellect", scores: { pcm: 3 } },
      { text: "Not being able to help someone who is suffering", scores: { pcb: 3, humanities: 1 } },
      { text: "Becoming financially unstable or dependent", scores: { commerce: 3 } },
      { text: "Living in a world where injustice goes unchallenged", scores: { humanities: 3 } },
      { text: "Living a boring, creatively dead existence", scores: { creative: 3 } },
    ],
  },
  {
    id: 802, category: "values",
    question: "Which superpower would you choose?",
    subtitle: "This actually reveals your deepest drive",
    options: [
      { text: "Super intelligence — solve any equation instantly", scores: { pcm: 3 } },
      { text: "Healing powers — cure any disease", scores: { pcb: 3 } },
      { text: "Midas touch — multiply wealth at will", scores: { commerce: 3 } },
      { text: "Mind reading — understand anyone's true feelings", scores: { humanities: 3 } },
      { text: "Shapeshifting — transform into anything you imagine", scores: { creative: 3 } },
    ],
  },
  {
    id: 803, category: "values",
    question: "The most important quality in a career for you is...",
    options: [
      { text: "Intellectual challenge — always something to figure out", scores: { pcm: 3 } },
      { text: "Making a tangible difference in people's health or lives", scores: { pcb: 3 } },
      { text: "Financial freedom and strong earning potential", scores: { commerce: 3 } },
      { text: "Voice and impact — being heard and making change", scores: { humanities: 3 } },
      { text: "Creative expression and originality", scores: { creative: 3 } },
    ],
  },
  {
    id: 804, category: "values",
    question: "What does success look like to you?",
    options: [
      { text: "Making a breakthrough no one has made before", scores: { pcm: 3 } },
      { text: "Knowing your work directly improved someone's health", scores: { pcb: 3 } },
      { text: "Financial independence and building lasting wealth", scores: { commerce: 3 } },
      { text: "Being respected for your wisdom and integrity", scores: { humanities: 3 } },
      { text: "Having your creative work recognized and celebrated", scores: { creative: 3 } },
    ],
  },
  {
    id: 805, category: "values",
    question: "Which value do you hold most strongly?",
    subtitle: "Psychometric: core values assessment",
    options: [
      { text: "Truth — facts and evidence over opinion", scores: { pcm: 3, pcb: 1 } },
      { text: "Life — all living things deserve care", scores: { pcb: 3 } },
      { text: "Prosperity — a strong economy lifts all people", scores: { commerce: 3 } },
      { text: "Justice — equality, fairness, and human dignity", scores: { humanities: 3 } },
      { text: "Beauty — aesthetic meaning makes life worth living", scores: { creative: 3 } },
    ],
  },
  {
    id: 806, category: "values",
    question: "Which would bother you most about a job?",
    options: [
      { text: "No room for logical thinking or technical problem-solving", scores: { pcm: 3 } },
      { text: "Being indoors, disconnected from science or nature", scores: { pcb: 3 } },
      { text: "Poor pay and no path to financial growth", scores: { commerce: 3 } },
      { text: "No voice or impact — just following orders blindly", scores: { humanities: 3 } },
      { text: "Boring repetitive tasks with no creative freedom", scores: { creative: 3 } },
    ],
  },
  {
    id: 807, category: "values",
    question: "In an ideal world, you'd spend your day helping...",
    options: [
      { text: "Engineers build smarter systems and infrastructure", scores: { pcm: 3 } },
      { text: "Doctors understand diseases and keep people healthy", scores: { pcb: 3 } },
      { text: "Entrepreneurs build successful companies", scores: { commerce: 3 } },
      { text: "Communities resolve conflicts and live with dignity", scores: { humanities: 3 } },
      { text: "Creators bring ideas to life beautifully", scores: { creative: 3 } },
    ],
  },
];

// ─── SAMPLER ─────────────────────────────────────────────────────────────────
// Picks a stratified random sample from each category so every quiz:
//   • Always has psychometric questions (personality + aptitude)
//   • Feels completely fresh each time
// ─────────────────────────────────────────────────────────────────────────────

const CATEGORY_QUOTA: Record<QuestionCategory, number> = {
  interest:    2,
  subject:     1,
  personality: 2,   // psychometric
  aptitude:    1,   // psychometric
  scenario:    2,
  aspiration:  2,
  hobby:       1,
  values:      1,
};
// Total: 12 questions per quiz session

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function sampleQuestions(): Question[] {
  const byCategory = {} as Record<QuestionCategory, BankQuestion[]>;

  for (const q of QUESTION_BANK) {
    if (!byCategory[q.category]) byCategory[q.category] = [];
    byCategory[q.category].push(q);
  }

  const sampled: Question[] = [];

  for (const [cat, quota] of Object.entries(CATEGORY_QUOTA) as [QuestionCategory, number][]) {
    const pool = shuffleArray(byCategory[cat] || []);
    sampled.push(...pool.slice(0, quota));
  }

  // Shuffle options within each question
  for (const q of sampled) {
    q.options = shuffleArray(q.options);
  }

  // Final shuffle so categories are interleaved randomly (not grouped)
  return shuffleArray(sampled);
}
