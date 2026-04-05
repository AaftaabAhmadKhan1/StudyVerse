export type StreamKey = "pcm" | "pcb" | "commerce" | "humanities" | "creative";

export interface StreamInfo {
  key: StreamKey;
  name: string;
  fullName: string;
  icon: string;
  color: string;
  gradient: string;
  description: string;
  careers: string[];
  subjects: string[];
}

export interface QuestionOption {
  text: string;
  scores: Partial<Record<StreamKey, number>>;
}

export interface Question {
  id: number;
  question: string;
  subtitle?: string;
  options: QuestionOption[];
}

export const STREAMS: Record<StreamKey, StreamInfo> = {
  pcm: {
    key: "pcm",
    name: "Science (PCM)",
    fullName: "Physics, Chemistry, Mathematics",
    icon: "🔬",
    color: "#6366f1",
    gradient: "from-indigo-500 to-blue-600",
    description:
      "You have an analytical mind that thrives on solving complex problems. The world of Science with PCM opens doors to engineering, technology, architecture, and research. Your logical thinking and love for numbers will take you far.",
    careers: [
      "Software Engineer",
      "Data Scientist",
      "Mechanical Engineer",
      "Architect",
      "Aerospace Engineer",
      "AI/ML Researcher",
      "Civil Engineer",
      "Physicist",
    ],
    subjects: ["Physics", "Chemistry", "Mathematics", "Computer Science"],
  },
  pcb: {
    key: "pcb",
    name: "Science (PCB)",
    fullName: "Physics, Chemistry, Biology",
    icon: "🧬",
    color: "#10b981",
    gradient: "from-emerald-500 to-teal-600",
    description:
      "You have a deep curiosity about life and the natural world. Science with PCB leads to medical sciences, biotechnology, environmental science, and healthcare. Your empathy and scientific mind are a powerful combination.",
    careers: [
      "Doctor / Surgeon",
      "Pharmacist",
      "Biotechnologist",
      "Veterinarian",
      "Microbiologist",
      "Physiotherapist",
      "Dentist",
      "Environmental Scientist",
    ],
    subjects: ["Physics", "Chemistry", "Biology", "Psychology"],
  },
  commerce: {
    key: "commerce",
    name: "Commerce",
    fullName: "Business, Finance & Economics",
    icon: "📊",
    color: "#f59e0b",
    gradient: "from-amber-500 to-orange-600",
    description:
      "You have a sharp business mind and an intuitive understanding of money, markets, and management. Commerce opens pathways to finance, entrepreneurship, economics, and corporate leadership.",
    careers: [
      "Chartered Accountant",
      "Investment Banker",
      "Entrepreneur",
      "Financial Analyst",
      "Economist",
      "Company Secretary",
      "Marketing Manager",
      "Management Consultant",
    ],
    subjects: [
      "Accountancy",
      "Business Studies",
      "Economics",
      "Mathematics / Informatics",
    ],
  },
  humanities: {
    key: "humanities",
    name: "Humanities",
    fullName: "Arts, Social Sciences & Law",
    icon: "📚",
    color: "#ec4899",
    gradient: "from-pink-500 to-rose-600",
    description:
      "You have a deep understanding of people, society, and culture. Humanities opens doors to law, journalism, psychology, public policy, and social impact. Your ability to think critically and communicate makes you a natural leader.",
    careers: [
      "Lawyer / Advocate",
      "Journalist",
      "Psychologist",
      "Civil Services (IAS/IPS)",
      "Political Analyst",
      "Social Worker",
      "Historian",
      "Content Strategist",
    ],
    subjects: [
      "History",
      "Political Science",
      "Sociology",
      "Psychology / Geography",
    ],
  },
  creative: {
    key: "creative",
    name: "Creative Arts & Design",
    fullName: "Fine Arts, Design, Media & Performance",
    icon: "🎨",
    color: "#8b5cf6",
    gradient: "from-violet-500 to-purple-600",
    description:
      "You have a vivid imagination and an eye for beauty. Creative Arts & Design leads to careers in design, filmmaking, animation, fashion, and performing arts. Your creativity is your superpower.",
    careers: [
      "UI/UX Designer",
      "Graphic Designer",
      "Film Director",
      "Fashion Designer",
      "Animator",
      "Interior Designer",
      "Musician",
      "Photographer",
    ],
    subjects: [
      "Fine Arts",
      "Design Studies",
      "Media Studies",
      "Computer Graphics",
    ],
  },
};
