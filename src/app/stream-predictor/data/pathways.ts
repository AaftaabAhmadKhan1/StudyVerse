export type JourneyType = 'after10' | 'after12';
export type StreamKey = 'pcm' | 'pcb' | 'commerce' | 'humanities';

export interface QuizOption {
  text: string;
  scores: Record<string, number>;
}

export interface QuizQuestion {
  id: string;
  question: string;
  subtitle?: string;
  options: QuizOption[];
}

export interface BatchRecommendation {
  label: string;
  batchName: string;
  link: string;
}

export interface StreamProfile {
  key: StreamKey;
  name: string;
  fullName: string;
  icon: string;
  gradient: string;
  description: string;
  careers: string[];
  subjects: string[];
}

export interface CareerRecommendation {
  key: string;
  title: string;
  subtitle: string;
  icon: string;
  gradient: string;
  summary: string;
  careers: string[];
  exams: string[];
  batches: BatchRecommendation[];
}

interface QuestionBlueprint<T extends string> {
  id: string;
  question: string;
  subtitle?: string;
  options: Record<T, string>;
}

interface PositionedOption<T extends string> extends QuizOption {
  key: T;
}

export const STREAM_ORDER: StreamKey[] = ['pcm', 'pcb', 'commerce', 'humanities'];

export const STREAMS: Record<StreamKey, StreamProfile> = {
  pcm: {
    key: 'pcm',
    name: 'Science (PCM)',
    fullName: 'Physics, Chemistry, Mathematics',
    icon: '⚙️',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    description:
      'You look strongest for a math-driven science path where problem solving, logic, engineering and technology become your core strengths.',
    careers: ['Engineering', 'Computer Science', 'Architecture', 'Data Science', 'Defence Technical Roles'],
    subjects: ['Physics', 'Chemistry', 'Mathematics', 'Computer Science'],
  },
  pcb: {
    key: 'pcb',
    name: 'Science (PCB)',
    fullName: 'Physics, Chemistry, Biology',
    icon: '🧬',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    description:
      'Your answers point toward a biology-led science route, with strong fit for medicine, healthcare, life sciences and allied health careers.',
    careers: ['Medical', 'Biotechnology', 'Pharmacy', 'Nursing / Allied Health', 'Research in Life Sciences'],
    subjects: ['Physics', 'Chemistry', 'Biology', 'Psychology / Physical Education'],
  },
  commerce: {
    key: 'commerce',
    name: 'Commerce',
    fullName: 'Business, Finance and Economics',
    icon: '📈',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    description:
      'You show a strong inclination toward business, finance, markets and practical decision making, which fits the commerce stream very well.',
    careers: ['Chartered Accountancy', 'Finance', 'Business Management', 'Entrepreneurship', 'Economics'],
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'Applied Mathematics / IP'],
  },
  humanities: {
    key: 'humanities',
    name: 'Humanities',
    fullName: 'Arts, Social Sciences and Law',
    icon: '📚',
    gradient: 'from-pink-500 via-rose-500 to-fuchsia-500',
    description:
      'You appear best suited to people, society, communication and critical thinking driven fields, making humanities a strong recommendation.',
    careers: ['Law', 'Journalism', 'Psychology', 'Civil Services', 'Public Policy'],
    subjects: ['History', 'Political Science', 'Psychology', 'Sociology / Geography'],
  },
};

export const CLASS10_BATCHES: Record<StreamKey, BatchRecommendation[]> = {
  pcm: [
    {
      label: 'Class 11 CBSE Science',
      batchName: 'UDAY 2027 (Class 11th)',
      link: 'https://www.pw.live/study-v2/batches/698de475e0f24f0f10b97658/batch-overview?came_from=batch_listing#Description_1',
    },
    {
      label: 'Class 11 ISC Science',
      batchName: 'UDAY ISC 2027 (Class 11th)',
      link: 'https://www.pw.live/study-v2/batches/6982e8036b74c89841978e28/batch-overview?came_from=batch_listing#Description_1',
    },
    {
      label: 'JEE Preparation',
      batchName: 'Arjuna JEE 2027',
      link: 'https://www.pw.live/study-v2/batches/698ad3519549b300a5e1cc6a/batch-overview?came_from=batch_listing#Description_1',
    },
  ],
  pcb: [
    {
      label: 'Class 11 CBSE Science',
      batchName: 'UDAY 2027 (Class 11th)',
      link: 'https://www.pw.live/study-v2/batches/698de475e0f24f0f10b97658/batch-overview?came_from=batch_listing#Description_1',
    },
    {
      label: 'Class 11 ISC Science',
      batchName: 'UDAY ISC 2027 (Class 11th)',
      link: 'https://www.pw.live/study-v2/batches/6982e8036b74c89841978e28/batch-overview?came_from=batch_listing#Description_1',
    },
    {
      label: 'NEET Preparation',
      batchName: 'Arjuna NEET 2027',
      link: 'https://www.pw.live/study-v2/batches/69897f0ad7c19b7b2f7cc35f/batch-overview?came_from=batch_listing#Description_1',
    },
  ],
  commerce: [
    {
      label: 'Class 11 Commerce',
      batchName: 'UDAY 2027 Class 11th Commerce',
      link: 'https://www.pw.live/study-v2/batches/6984a17d4520f144c34e3745/batch-overview?came_from=batch_listing#Description_1',
    },
  ],
  humanities: [
    {
      label: 'Class 11 Humanities',
      batchName: 'UDAY HUMANITIES 2027 (Class 11th)',
      link: 'https://www.pw.live/study-v2/batches/698de47558bc860709d89651/batch-overview?came_from=batch_listing#Description_1',
    },
  ],
};

export const CLASS12_RECOMMENDATIONS: Record<string, CareerRecommendation> = {
  engineering: {
    key: 'engineering',
    title: 'Engineering and Technology',
    subtitle: 'Best fit after Class 12th PCM',
    icon: '🛠️',
    gradient: 'from-blue-500 via-indigo-500 to-violet-500',
    summary:
      'You appear strongest for a structured problem-solving career path based on maths, physics, systems and technology.',
    careers: ['B.Tech / Engineering', 'Computer Science', 'AI / Data Roles', 'Architecture', 'Core Engineering'],
    exams: ['JEE Main', 'JEE Advanced', 'State Engineering Entrances'],
    batches: [{ label: 'JEE', batchName: 'Prayas JEE 2027', link: 'https://www.pw.live/study-v2/batches/69897f0a4c12aeb013d4ea52/batch-overview?came_from=batch_listing#Description_1' }],
  },
  defence: {
    key: 'defence',
    title: 'Defence and Uniform Services',
    subtitle: 'Strong defence-oriented pathway',
    icon: '🛡️',
    gradient: 'from-slate-500 via-cyan-500 to-sky-500',
    summary:
      'Your answers suggest a disciplined, mission-driven path where service, leadership and high-pressure decision making suit you well.',
    careers: ['Army / Navy / Air Force Officer', 'NDA Pathway', 'AFCAT Pathway', 'CDS Pathway', 'Defence Leadership Roles'],
    exams: ['NDA', 'AFCAT', 'CDS'],
    batches: [
      { label: 'Defence NDA', batchName: 'NDA (II) Shaurya 2026', link: 'https://www.pw.live/study-v2/batches/698af10bb9b6a554bda6a244/batch-overview?came_from=batch_listing#Description_1' },
      { label: 'Defence AFCAT', batchName: 'AFCAT (II) GARUD 2026', link: 'https://www.pw.live/study-v2/batches/6981f6943583acf55bb7d988/batch-overview?came_from=batch_listing#Description_1' },
      { label: 'CDS', batchName: 'CDS (II) VIRAAT 2026', link: 'https://www.pw.live/study-v2/batches/698af10d09494b495cfd5c02/batch-overview?came_from=batch_listing#Description_1' },
    ],
  },
  architecture_design: {
    key: 'architecture_design',
    title: 'Architecture and Applied Design',
    subtitle: 'Creative-technical route after PCM',
    icon: '🏗️',
    gradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
    summary:
      'You seem to enjoy combining logic with design, making architecture and structured design-oriented technical careers a strong fit.',
    careers: ['Architecture', 'Planning', 'Product Design', 'Interior and Spatial Design', 'Built Environment Roles'],
    exams: ['NATA', 'JEE Paper 2', 'Architecture College Entrances'],
    batches: [{ label: 'JEE', batchName: 'Prayas JEE 2027', link: 'https://www.pw.live/study-v2/batches/69897f0a4c12aeb013d4ea52/batch-overview?came_from=batch_listing#Description_1' }],
  },
  graduation_science: {
    key: 'graduation_science',
    title: 'Science Graduation Path',
    subtitle: 'Broad science degree and exploration',
    icon: '🎓',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    summary:
      'A broad science graduation path looks suitable for you, especially if you want to keep multiple science and research options open.',
    careers: ['B.Sc', 'Research', 'Biotech', 'Data / Analytics Foundations', 'Higher Studies in Science'],
    exams: ['CUET Science', 'University Science Entrances'],
    batches: [{ label: 'CUET Science', batchName: 'Pravesh CUET Science 2.0 2026', link: 'https://www.pw.live/study-v2/batches/6979ec0f648d27615bf95eb9/batch-overview?came_from=batch_listing#Description_1' }],
  },
  medical: {
    key: 'medical',
    title: 'Medical and Healthcare',
    subtitle: 'Best fit after Class 12th PCB',
    icon: '🩺',
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    summary:
      'Your answers align strongly with medicine, patient care and biology-focused competitive preparation.',
    careers: ['MBBS', 'BDS', 'BAMS / BHMS', 'Nursing', 'Allied Health Sciences'],
    exams: ['NEET', 'Medical State Counselling Pathways'],
    batches: [{ label: 'NEET', batchName: 'Yakeen NEET 2027', link: 'https://www.pw.live/study-v2/batches/69897f0a4c12aeb013d4ea52/batch-overview?came_from=batch_listing#Description_1' }],
  },
  biotech_research: {
    key: 'biotech_research',
    title: 'Biotech and Research Sciences',
    subtitle: 'Research-focused biology pathway',
    icon: '🔬',
    gradient: 'from-emerald-500 via-lime-500 to-cyan-500',
    summary:
      'You seem interested in biology beyond clinical medicine, which points well toward biotech, lab science and research-driven science careers.',
    careers: ['Biotechnology', 'Microbiology', 'Biomedical Research', 'Genetics', 'Lab Sciences'],
    exams: ['CUET Science', 'Biotech and Science University Entrances'],
    batches: [{ label: 'CUET Science', batchName: 'Pravesh CUET Science 2.0 2026', link: 'https://www.pw.live/study-v2/batches/6979ec0f648d27615bf95eb9/batch-overview?came_from=batch_listing#Description_1' }],
  },
  allied_health: {
    key: 'allied_health',
    title: 'Allied Health and Patient Care',
    subtitle: 'Healthcare route beyond MBBS',
    icon: '💚',
    gradient: 'from-teal-500 via-emerald-500 to-green-500',
    summary:
      'Your pattern suggests strong alignment with healthcare, patient support and therapeutic roles outside the traditional MBBS-only route.',
    careers: ['Physiotherapy', 'Nursing', 'Radiology', 'Nutrition', 'Medical Lab Technology'],
    exams: ['NEET-related counselling routes', 'Allied Health Entrances', 'State Health University Admissions'],
    batches: [{ label: 'NEET', batchName: 'Yakeen NEET 2027', link: 'https://www.pw.live/study-v2/batches/69897f0a4c12aeb013d4ea52/batch-overview?came_from=batch_listing#Description_1' }],
  },
  graduation_commerce: {
    key: 'graduation_commerce',
    title: 'Commerce Graduation and Management',
    subtitle: 'Broad commerce degree pathway',
    icon: '📊',
    gradient: 'from-orange-500 via-amber-500 to-yellow-500',
    summary:
      'A graduation path in commerce, management or business studies seems like the most flexible match for your interests.',
    careers: ['B.Com', 'BBA', 'Economics', 'Management', 'Business Analytics'],
    exams: ['CUET Commerce', 'IPMAT', 'University Commerce Entrances'],
    batches: [{ label: 'CUET Commerce', batchName: 'Pravesh CUET Commerce 3.0 2026', link: 'https://www.pw.live/study-v2/batches/6933dea418e97318a3bf5c73/batch-overview?came_from=batch_listing#Description_1' }],
  },
  chartered_accountancy: {
    key: 'chartered_accountancy',
    title: 'Chartered Accountancy and Finance',
    subtitle: 'Strong commerce specialization fit',
    icon: '💼',
    gradient: 'from-amber-500 via-orange-500 to-yellow-500',
    summary:
      'You look well matched for an accounting, audit and finance-heavy route with strong structure and long-term professional value.',
    careers: ['Chartered Accountant', 'Auditing', 'Taxation', 'Financial Planning', 'Corporate Finance'],
    exams: ['CA Foundation', 'Commerce Degree Entrances'],
    batches: [{ label: 'CA', batchName: 'CA Foundation Sampurna September 2026', link: 'https://www.pw.live/study-v2/batches/67bebfdc57b811862726ff1c/batch-overview?came_from=batch_listing#Description_1' }],
  },
  management_business: {
    key: 'management_business',
    title: 'Management and Business Leadership',
    subtitle: 'Business growth oriented route',
    icon: '🚀',
    gradient: 'from-orange-500 via-rose-500 to-pink-500',
    summary:
      'You look driven by leadership, strategy and business building, which makes management and entrepreneurship-oriented routes a strong match.',
    careers: ['Management', 'Entrepreneurship', 'Marketing', 'Business Operations', 'Startups'],
    exams: ['CUET Commerce', 'IPMAT', 'BBA Entrances'],
    batches: [{ label: 'CUET Commerce', batchName: 'Pravesh CUET Commerce 3.0 2026', link: 'https://www.pw.live/study-v2/batches/6933dea418e97318a3bf5c73/batch-overview?came_from=batch_listing#Description_1' }],
  },
  economics_analytics: {
    key: 'economics_analytics',
    title: 'Economics and Business Analytics',
    subtitle: 'Data-aware commerce pathway',
    icon: '📉',
    gradient: 'from-yellow-500 via-orange-500 to-amber-500',
    summary:
      'Your answers suggest interest in decisions, numbers and market behavior, which suits economics, analytics and quantitative business roles.',
    careers: ['Economics', 'Business Analytics', 'Financial Analysis', 'Policy Economics', 'Market Research'],
    exams: ['CUET Commerce', 'Economics Degree Entrances', 'BBA / BMS Entrances'],
    batches: [{ label: 'CUET Commerce', batchName: 'Pravesh CUET Commerce 3.0 2026', link: 'https://www.pw.live/study-v2/batches/6933dea418e97318a3bf5c73/batch-overview?came_from=batch_listing#Description_1' }],
  },
  graduation_humanities: {
    key: 'graduation_humanities',
    title: 'Humanities Graduation and Social Sciences',
    subtitle: 'Broad humanities career foundation',
    icon: '🏛️',
    gradient: 'from-pink-500 via-rose-500 to-fuchsia-500',
    summary:
      'You are well suited for a humanities pathway that opens careers in law, psychology, journalism, public policy and social sciences.',
    careers: ['BA / Social Sciences', 'Law', 'Psychology', 'Journalism and Media', 'Public Policy'],
    exams: ['CUET Humanities', 'CLAT', 'Mass Communication / Liberal Arts Entrances'],
    batches: [{ label: 'CUET Humanities', batchName: 'Pravesh CUET Humanities 2.0 2026', link: 'https://www.pw.live/study-v2/batches/6984769400caeeb96d80f311/batch-overview?came_from=batch_listing#Description_1' }],
  },
  law_policy: {
    key: 'law_policy',
    title: 'Law and Public Policy',
    subtitle: 'Argument and governance focused path',
    icon: '⚖️',
    gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
    summary:
      'You seem drawn to argument, structure, justice and institutions, which points strongly toward law and governance-related careers.',
    careers: ['Law', 'Policy Research', 'Public Administration', 'Legal Studies', 'Governance Roles'],
    exams: ['CLAT', 'CUET Humanities', 'Law College Entrances'],
    batches: [{ label: 'CUET Humanities', batchName: 'Pravesh CUET Humanities 2.0 2026', link: 'https://www.pw.live/study-v2/batches/6984769400caeeb96d80f311/batch-overview?came_from=batch_listing#Description_1' }],
  },
  psychology_media: {
    key: 'psychology_media',
    title: 'Psychology, Media and Communication',
    subtitle: 'People and communication-centered route',
    icon: '🎙️',
    gradient: 'from-fuchsia-500 via-pink-500 to-orange-400',
    summary:
      'Your answers lean toward people, communication and understanding behavior, which fits psychology, media and communication pathways well.',
    careers: ['Psychology', 'Journalism', 'Media Studies', 'Counselling', 'Content and Communication'],
    exams: ['CUET Humanities', 'Mass Communication Entrances', 'Psychology Program Admissions'],
    batches: [{ label: 'CUET Humanities', batchName: 'Pravesh CUET Humanities 2.0 2026', link: 'https://www.pw.live/study-v2/batches/6984769400caeeb96d80f311/batch-overview?came_from=batch_listing#Description_1' }],
  },
  civil_services_social: {
    key: 'civil_services_social',
    title: 'Civil Services and Social Impact',
    subtitle: 'Leadership through public impact',
    icon: '🌍',
    gradient: 'from-purple-500 via-pink-500 to-rose-500',
    summary:
      'You appear aligned with leadership, public impact and social problem solving, which suits civil services and social-sector pathways.',
    careers: ['Civil Services', 'Social Work', 'Public Administration', 'Development Sector', 'NGO / Policy Roles'],
    exams: ['CUET Humanities', 'Civil Services Foundation Routes', 'Social Science Entrances'],
    batches: [{ label: 'CUET Humanities', batchName: 'Pravesh CUET Humanities 2.0 2026', link: 'https://www.pw.live/study-v2/batches/6984769400caeeb96d80f311/batch-overview?came_from=batch_listing#Description_1' }],
  },
};

const CLASS10_BANK: QuestionBlueprint<StreamKey>[] = [
  { id: 'c10-1', question: 'Which type of problem do you enjoy solving the most?', subtitle: 'Pick the one that feels natural to you', options: { pcm: 'Maths, logic and technical puzzles', pcb: 'Biology, health and living systems', commerce: 'Money, trade and practical decisions', humanities: 'People, society and ideas' } },
  { id: 'c10-2', question: 'If you had one free hour every day, how would you like to spend it?', options: { pcm: 'Solving reasoning or maths questions', pcb: 'Reading about the human body or nature', commerce: 'Watching business or finance content', humanities: 'Reading current affairs or history' } },
  { id: 'c10-3', question: 'Which school subject usually pulls you in the most?', options: { pcm: 'Mathematics and physics concepts', pcb: 'Biology and environmental science', commerce: 'Economics and business basics', humanities: 'History, civics and geography' } },
  { id: 'c10-4', question: 'Which kind of career sounds most exciting right now?', options: { pcm: 'Engineer, coder or architect', pcb: 'Doctor, biologist or health expert', commerce: 'CA, banker or entrepreneur', humanities: 'Lawyer, journalist or civil servant' } },
  { id: 'c10-5', question: 'Your friends are most likely to ask you for help with...', options: { pcm: 'A difficult numerical or technical question', pcb: 'A science diagram or biology explanation', commerce: 'Planning, budgeting or managing something', humanities: 'Writing, debating or understanding a topic' } },
  { id: 'c10-6', question: 'Which statement sounds most like you?', options: { pcm: 'I enjoy precision and finding one right answer', pcb: 'I care deeply about life, care and wellbeing', commerce: 'I notice opportunities, value and strategy quickly', humanities: 'I naturally think about fairness and perspectives' } },
  { id: 'c10-7', question: 'In a group project, what role would you pick first?', options: { pcm: 'The builder or technical planner', pcb: 'The researcher for science or evidence', commerce: 'The organizer of budget and execution', humanities: 'The presenter, writer or discussion lead' } },
  { id: 'c10-8', question: 'Which future achievement would make you proudest?', options: { pcm: 'Creating something innovative that works', pcb: 'Helping people through science or medicine', commerce: 'Building financial success or a company', humanities: 'Influencing society through ideas or leadership' } },
  { id: 'c10-9', question: 'What kind of documentary would you click first?', options: { pcm: 'Technology, space or engineering', pcb: 'Medicine, wildlife or health science', commerce: 'Markets, startups or money stories', humanities: 'Politics, culture or historical change' } },
  { id: 'c10-10', question: 'What usually motivates you more?', options: { pcm: 'Mastering difficult concepts and systems', pcb: 'Understanding people, health and life', commerce: 'Reaching practical and financial goals', humanities: 'Exploring human behavior and society' } },
  { id: 'c10-11', question: 'Which kind of challenge feels rewarding instead of tiring?', options: { pcm: 'Long calculations or technical practice', pcb: 'Careful memorization with scientific understanding', commerce: 'Analysing business cases and trade-offs', humanities: 'Reading, interpreting and writing arguments' } },
  { id: 'c10-12', question: 'Which campus activity would attract you most?', options: { pcm: 'Robotics or coding club', pcb: 'Health, environment or biology club', commerce: 'Commerce, finance or entrepreneurship club', humanities: 'Debate, MUN or literary society' } },
  { id: 'c10-13', question: 'When making a decision, what do you rely on most?', options: { pcm: 'Logic and objective analysis', pcb: 'Evidence, care and scientific understanding', commerce: 'Practical outcome and value', humanities: 'Human impact and context' } },
  { id: 'c10-14', question: 'Which entrance exam family sounds closest to your current ambition?', options: { pcm: 'JEE and technical entrances', pcb: 'NEET and health-focused entrances', commerce: 'CA Foundation and commerce pathways', humanities: 'CUET or CLAT style humanities paths' } },
  { id: 'c10-15', question: 'Which statement feels most true about your future self?', options: { pcm: 'I want to build, design or solve complex systems', pcb: 'I want to heal, research or improve lives', commerce: 'I want to manage, lead or grow organizations', humanities: 'I want to guide, influence or understand people deeply' } },
  { id: 'c10-16', question: 'Which YouTube playlist would you open first?', options: { pcm: 'Coding, robotics or problem solving', pcb: 'Human anatomy, health or biology', commerce: 'Startup, finance or stock market basics', humanities: 'History, geopolitics or law explainers' } },
  { id: 'c10-17', question: 'What type of school competition would excite you most?', options: { pcm: 'Science or robotics olympiad', pcb: 'Biology quiz or health awareness event', commerce: 'Business pitch or budgeting contest', humanities: 'Debate, speech or quiz on current affairs' } },
  { id: 'c10-18', question: 'If given a school exhibition stall, what would you create?', options: { pcm: 'A model machine or working circuit', pcb: 'A life science or human body display', commerce: 'A mock business or product sales plan', humanities: 'A social awareness or governance display' } },
  { id: 'c10-19', question: 'Which chapter usually feels easiest to keep revisiting?', options: { pcm: 'Numericals, formulas and concept application', pcb: 'Diagrams, life cycles and body systems', commerce: 'Business cases and money concepts', humanities: 'Cause-effect stories from history and society' } },
  { id: 'c10-20', question: 'What kind of teacher explanation do you enjoy most?', options: { pcm: 'One that breaks a hard concept into steps', pcb: 'One that connects theory to life and health', commerce: 'One that links ideas to real-world money decisions', humanities: 'One that explains why people and societies act the way they do' } },
  { id: 'c10-21', question: 'Which kind of future workplace can you imagine yourself in?', options: { pcm: 'Lab, tech office or engineering site', pcb: 'Hospital, clinic or science lab', commerce: 'Office, company or business setup', humanities: 'Courtroom, newsroom, office of governance or social fieldwork' } },
  { id: 'c10-22', question: 'Which line sounds most satisfying to hear about yourself?', options: { pcm: 'You think sharply and solve tough problems', pcb: 'You are caring and understand life deeply', commerce: 'You are practical and know how to create value', humanities: 'You communicate well and understand people deeply' } },
  { id: 'c10-23', question: 'Which assignment style would you least postpone?', options: { pcm: 'A worksheet full of challenging numerical questions', pcb: 'A science notebook with diagrams and explanations', commerce: 'A project on selling, costing or business planning', humanities: 'An essay or presentation on society and governance' } },
  { id: 'c10-24', question: 'Which long-term dream feels most natural to you?', options: { pcm: 'Inventing or engineering something useful', pcb: 'Working in medicine or biological science', commerce: 'Running or managing a successful business', humanities: 'Influencing society through law, policy or communication' } },
  { id: 'c10-25', question: 'Which type of news story would you read fully?', options: { pcm: 'A new technology breakthrough', pcb: 'A health or medical discovery', commerce: 'A business merger or market shift', humanities: 'A legal or policy change' } },
  { id: 'c10-26', question: 'What kind of school assignment would you proudly submit?', options: { pcm: 'A working model with calculations', pcb: 'A biology case study or health poster', commerce: 'A business plan with costing', humanities: 'A well-argued social analysis' } },
  { id: 'c10-27', question: 'Which skill do you most want people to notice in you?', options: { pcm: 'Analytical and technical thinking', pcb: 'Scientific understanding with care', commerce: 'Business sense and planning', humanities: 'Communication and perspective' } },
  { id: 'c10-28', question: 'Which kind of internship would feel most exciting someday?', options: { pcm: 'A tech, coding or engineering setup', pcb: 'A hospital, clinic or lab', commerce: 'A finance, startup or office role', humanities: 'A media, legal or policy role' } },
];

const PCM_KEYS = ['engineering', 'defence', 'architecture_design', 'graduation_science'] as const;
const PCB_KEYS = ['medical', 'biotech_research', 'allied_health', 'graduation_science'] as const;
const COMMERCE_KEYS = ['chartered_accountancy', 'management_business', 'economics_analytics', 'graduation_commerce'] as const;
const HUMANITIES_KEYS = ['law_policy', 'psychology_media', 'civil_services_social', 'graduation_humanities'] as const;

const CLASS12_BANK: Record<StreamKey, QuestionBlueprint<string>[]> = {
  pcm: [
    { id: 'pcm-1', question: 'Which type of work sounds most energizing after Class 12th?', options: { engineering: 'Engineering, coding and building systems', defence: 'A disciplined defence career with leadership', architecture_design: 'Designing buildings, spaces and structures', graduation_science: 'A broad science degree before choosing a specialization' } },
    { id: 'pcm-2', question: 'Which exam track would you prepare for most seriously?', options: { engineering: 'JEE and engineering entrances', defence: 'NDA, AFCAT or CDS style defence exams', architecture_design: 'NATA or JEE Paper 2', graduation_science: 'CUET Science and science degree entrances' } },
    { id: 'pcm-3', question: 'What kind of challenge makes you feel most alive?', options: { engineering: 'Designing or debugging technical solutions', defence: 'High-pressure situations needing discipline and courage', architecture_design: 'Balancing structure with visual design', graduation_science: 'Exploring concepts broadly before specialization' } },
    { id: 'pcm-4', question: 'Which environment would suit you best?', options: { engineering: 'Labs, tech teams and project-based work', defence: 'Training academies and command structure', architecture_design: 'Studios, design desks and site visits', graduation_science: 'University learning with flexible future options' } },
    { id: 'pcm-5', question: 'What result would make you happiest in the next few years?', options: { engineering: 'Cracking a top engineering entrance', defence: 'Entering a defence officer pipeline', architecture_design: 'Getting into a strong architecture program', graduation_science: 'Getting into a strong science degree program' } },
    { id: 'pcm-6', question: 'What kind of projects would you actually enjoy spending hours on?', options: { engineering: 'Apps, devices, systems or machines', defence: 'Fitness, drills, strategy and mission prep', architecture_design: 'Design boards, models and layouts', graduation_science: 'Experiments, analysis and science exploration' } },
    { id: 'pcm-7', question: 'Which role sounds closest to your natural identity?', options: { engineering: 'Builder and solver', defence: 'Leader under pressure', architecture_design: 'Designer with technical thinking', graduation_science: 'Curious learner and explorer' } },
    { id: 'pcm-8', question: 'Which subject pairing feels strongest for your future?', options: { engineering: 'Mathematics plus technology', defence: 'Mathematics plus physical endurance', architecture_design: 'Mathematics plus design sense', graduation_science: 'Mathematics plus broad science concepts' } },
    { id: 'pcm-9', question: 'If you join a college club, what would you pick first?', options: { engineering: 'Coding, robotics or innovation club', defence: 'NCC or discipline-driven leadership activity', architecture_design: 'Design, model making or sketching club', graduation_science: 'Research, quiz or science society' } },
    { id: 'pcm-10', question: 'What kind of success sounds most satisfying?', options: { engineering: 'Creating working products or systems', defence: 'Serving in a respected national role', architecture_design: 'Designing spaces people admire and use', graduation_science: 'Building a strong academic foundation for future options' } },
    { id: 'pcm-11', question: 'What type of preparation style suits you best?', options: { engineering: 'Concept plus problem-solving practice', defence: 'Discipline, routine and all-round readiness', architecture_design: 'Portfolio, aptitude and visual thinking practice', graduation_science: 'Balanced academic prep with future flexibility' } },
    { id: 'pcm-12', question: 'Which mentor would inspire you the most?', options: { engineering: 'A top engineer or technologist', defence: 'A decorated officer or service leader', architecture_design: 'A renowned architect or planner', graduation_science: 'A scientist or researcher with broad expertise' } },
    { id: 'pcm-13', question: 'What kind of day-to-day work can you see yourself enjoying?', options: { engineering: 'Building, testing and improving systems', defence: 'Training, commanding and making field decisions', architecture_design: 'Sketching, planning and solving space problems', graduation_science: 'Studying, experimenting and keeping pathways open' } },
    { id: 'pcm-14', question: 'Which statement feels most like you?', options: { engineering: 'I want to solve hard practical problems', defence: 'I want responsibility, structure and service', architecture_design: 'I want technical work with a visual edge', graduation_science: 'I want time to explore before narrowing down' } },
    { id: 'pcm-15', question: 'Which future conversation sounds best?', options: { engineering: 'Discussing innovation and technology', defence: 'Discussing leadership and service', architecture_design: 'Discussing design and usable spaces', graduation_science: 'Discussing science, research and study paths' } },
    { id: 'pcm-16', question: 'What kind of result do you want from your college years?', options: { engineering: 'Strong placement-ready technical skills', defence: 'A route into armed forces careers', architecture_design: 'A professional design and architecture profile', graduation_science: 'A versatile science base for higher study' } },
    { id: 'pcm-17', question: 'What kind of pressure are you most comfortable with?', options: { engineering: 'Tough technical deadlines', defence: 'Physical and mental discipline under stress', architecture_design: 'Creative deadlines with precision', graduation_science: 'Academic rigour and concept depth' } },
    { id: 'pcm-18', question: 'Which future path would your strongest strengths support?', options: { engineering: 'Analytical and technical problem solving', defence: 'Courage, discipline and decision making', architecture_design: 'Spatial thinking and design logic', graduation_science: 'Curiosity and science exploration' } },
    { id: 'pcm-19', question: 'Which college project would you volunteer for first?', options: { engineering: 'Building a prototype or app', defence: 'Planning a drill or leadership challenge', architecture_design: 'Designing a space or model', graduation_science: 'Running an experiment-based research project' } },
    { id: 'pcm-20', question: 'What kind of internship would attract you most?', options: { engineering: 'Software, core tech or engineering intern work', defence: 'Defence-prep, training or service-oriented exposure', architecture_design: 'Architecture studio or planning firm work', graduation_science: 'Research lab or science department exposure' } },
    { id: 'pcm-21', question: 'What kind of identity feels most motivating?', options: { engineering: 'Technical expert and creator', defence: 'Officer and leader', architecture_design: 'Designer of meaningful spaces', graduation_science: 'Science learner with broad potential' } },
    { id: 'pcm-22', question: 'Which conversation would keep your attention longest?', options: { engineering: 'New tools, systems and machines', defence: 'Service, command and national responsibility', architecture_design: 'Spaces, structures and urban ideas', graduation_science: 'Research questions and scientific exploration' } },
  ],
  pcb: [
    { id: 'pcb-1', question: 'Which direction feels strongest for you after Class 12th?', options: { medical: 'Doctor or medical entrance pathway', biotech_research: 'Biotech, lab science or research', allied_health: 'Allied healthcare and patient care careers', graduation_science: 'A broader science degree and later specialization' } },
    { id: 'pcb-2', question: 'Which exam family feels most aligned right now?', options: { medical: 'NEET', biotech_research: 'Science and biotech degree entrances', allied_health: 'Allied health or healthcare admissions', graduation_science: 'CUET Science and science degree entrances' } },
    { id: 'pcb-3', question: 'What kind of impact do you want to create?', options: { medical: 'Directly helping patients and saving lives', biotech_research: 'Creating discoveries in biology and lab sciences', allied_health: 'Supporting recovery, diagnosis or ongoing care', graduation_science: 'Keeping broad science options open' } },
    { id: 'pcb-4', question: 'Which study style suits you better?', options: { medical: 'Focused preparation for one major goal', biotech_research: 'Scientific exploration with research depth', allied_health: 'Applied learning for healthcare roles', graduation_science: 'Keeping more academic options open' } },
    { id: 'pcb-5', question: 'Which future sounds more like you?', options: { medical: 'Medicine, dentistry or clinical healthcare', biotech_research: 'Life science graduation, biotech or research', allied_health: 'Physiotherapy, nursing or diagnostics', graduation_science: 'Science graduation with later specialization' } },
    { id: 'pcb-6', question: 'Which work environment sounds best?', options: { medical: 'Hospital or clinical setup', biotech_research: 'Research lab or biotech workspace', allied_health: 'Patient-facing care and support environment', graduation_science: 'University science campus and broad learning' } },
    { id: 'pcb-7', question: 'Which topic would you willingly spend extra time on?', options: { medical: 'Human disease, diagnosis and treatment', biotech_research: 'Cells, genes and biological mechanisms', allied_health: 'Recovery, care and patient wellbeing', graduation_science: 'A mix of biology, chemistry and future options' } },
    { id: 'pcb-8', question: 'What kind of satisfaction matters most?', options: { medical: 'Being responsible for life-saving decisions', biotech_research: 'Contributing to discovery and innovation', allied_health: 'Helping patients improve every day', graduation_science: 'Building a versatile scientific foundation' } },
    { id: 'pcb-9', question: 'What kind of mentor would inspire you most?', options: { medical: 'A respected doctor', biotech_research: 'A scientist or researcher', allied_health: 'A healthcare specialist focused on care', graduation_science: 'A professor with broad science guidance' } },
    { id: 'pcb-10', question: 'Which preparation path feels most motivating?', options: { medical: 'Competitive exam mastery', biotech_research: 'Research-oriented science training', allied_health: 'Role-specific healthcare preparation', graduation_science: 'Open-ended academic exploration' } },
    { id: 'pcb-11', question: 'What kind of conversations excite you most?', options: { medical: 'Cases, symptoms and treatment', biotech_research: 'Experiments, data and biological innovation', allied_health: 'Rehab, nutrition or patient progress', graduation_science: 'How science can lead to many different futures' } },
    { id: 'pcb-12', question: 'What do you want your first college years to emphasize?', options: { medical: 'Clear medical entrance commitment', biotech_research: 'Scientific depth and lab exposure', allied_health: 'Practical healthcare training', graduation_science: 'Academic breadth and freedom to choose later' } },
    { id: 'pcb-13', question: 'Which strength feels most like yours?', options: { medical: 'Staying focused on one big goal', biotech_research: 'Curiosity and scientific patience', allied_health: 'Care, empathy and practical support', graduation_science: 'Flexibility with a science-first mindset' } },
    { id: 'pcb-14', question: 'Which result would make you proudest?', options: { medical: 'Cracking a top medical seat', biotech_research: 'Joining a strong biotech or science program', allied_health: 'Starting a respected healthcare course', graduation_science: 'Entering a solid science degree and exploring options' } },
    { id: 'pcb-15', question: 'What kind of biology appeals to you most?', options: { medical: 'Human health and treatment', biotech_research: 'Molecular biology and innovation', allied_health: 'Body support, care and diagnostics', graduation_science: 'A broad understanding before specializing' } },
    { id: 'pcb-16', question: 'What kind of routine can you best commit to?', options: { medical: 'High-intensity exam preparation', biotech_research: 'Deep subject study and experimental thinking', allied_health: 'Applied healthcare learning and care skills', graduation_science: 'Balanced study with long-term flexibility' } },
    { id: 'pcb-17', question: 'What role feels closest to your future self?', options: { medical: 'Clinician', biotech_research: 'Researcher', allied_health: 'Healthcare practitioner', graduation_science: 'Science graduate exploring possibilities' } },
    { id: 'pcb-18', question: 'What kind of challenge attracts you?', options: { medical: 'Tackling complex medical competition', biotech_research: 'Understanding scientific puzzles deeply', allied_health: 'Improving patient outcomes practically', graduation_science: 'Building a broad science path first' } },
    { id: 'pcb-19', question: 'Which kind of college assignment would you enjoy most?', options: { medical: 'A clinical case-based discussion', biotech_research: 'A lab report or research summary', allied_health: 'A care plan or patient support task', graduation_science: 'A broad science exploration assignment' } },
    { id: 'pcb-20', question: 'Which environment helps you imagine your future most clearly?', options: { medical: 'A hospital or patient-care ward', biotech_research: 'A biotech or research lab', allied_health: 'A diagnostics, rehab or wellness center', graduation_science: 'A science campus with varied future routes' } },
    { id: 'pcb-21', question: 'What kind of achievement would feel most meaningful?', options: { medical: 'Securing a respected medical seat', biotech_research: 'Joining a strong life-science research path', allied_health: 'Starting a trusted healthcare support role', graduation_science: 'Creating a flexible science foundation for later choices' } },
    { id: 'pcb-22', question: 'What kind of problem would you most want to solve?', options: { medical: 'Illness and treatment challenges', biotech_research: 'Biological questions and innovation gaps', allied_health: 'Patient recovery and care support issues', graduation_science: 'Scientific questions before locking into one role' } },
  ],
  commerce: [
    { id: 'commerce-1', question: 'Which path attracts you most after Class 12th?', options: { chartered_accountancy: 'Professional finance and CA-style specialization', management_business: 'Management and entrepreneurship direction', economics_analytics: 'Economics, markets and analytics', graduation_commerce: 'A broad commerce or management degree pathway' } },
    { id: 'commerce-2', question: 'Which exam would you prioritize first?', options: { chartered_accountancy: 'CA Foundation', management_business: 'IPMAT or management entrances', economics_analytics: 'Economics or analytics-oriented degree entrances', graduation_commerce: 'CUET Commerce and broad degree admissions' } },
    { id: 'commerce-3', question: 'What type of work sounds most fulfilling?', options: { chartered_accountancy: 'Accounts, audit, tax and compliance', management_business: 'Leading teams and growing businesses', economics_analytics: 'Studying markets, data and decision trends', graduation_commerce: 'Keeping multiple commerce career options open' } },
    { id: 'commerce-4', question: 'Which preparation style suits you best?', options: { chartered_accountancy: 'A structured professional qualification route', management_business: 'Case studies, strategy and business exposure', economics_analytics: 'Quantitative thinking with real-world data', graduation_commerce: 'A degree-first route with flexibility' } },
    { id: 'commerce-5', question: 'Which version of success feels more exciting?', options: { chartered_accountancy: 'Becoming a respected finance professional', management_business: 'Building or running a successful venture', economics_analytics: 'Interpreting numbers to shape decisions', graduation_commerce: 'Graduating with broad options still open' } },
    { id: 'commerce-6', question: 'Which topic would you binge-learn?', options: { chartered_accountancy: 'Taxation, audit and accounting systems', management_business: 'Brand growth, startups and leadership', economics_analytics: 'Macro trends, markets and data', graduation_commerce: 'A balanced mix of commerce subjects' } },
    { id: 'commerce-7', question: 'Which workplace sounds best?', options: { chartered_accountancy: 'A professional finance or audit firm', management_business: 'A fast-moving company or startup', economics_analytics: 'An analytics or economics-focused team', graduation_commerce: 'A degree setting that keeps options broad' } },
    { id: 'commerce-8', question: 'What kind of challenge do you enjoy?', options: { chartered_accountancy: 'Precision and rule-based financial work', management_business: 'Taking decisions and owning outcomes', economics_analytics: 'Finding patterns in numbers and trends', graduation_commerce: 'Exploring before choosing a specialization' } },
    { id: 'commerce-9', question: 'Which mentor would inspire you most?', options: { chartered_accountancy: 'A top CA or finance expert', management_business: 'A founder or business leader', economics_analytics: 'An economist or business analyst', graduation_commerce: 'A versatile commerce professor' } },
    { id: 'commerce-10', question: 'What would make your college path feel right?', options: { chartered_accountancy: 'A clear route into finance credentials', management_business: 'Business exposure and leadership learning', economics_analytics: 'Strong analytical and economic thinking', graduation_commerce: 'A degree that still allows multiple futures' } },
    { id: 'commerce-11', question: 'What kind of conversations excite you most?', options: { chartered_accountancy: 'Tax, compliance and financial structure', management_business: 'Growth, leadership and brand strategy', economics_analytics: 'Markets, policy and quantitative trends', graduation_commerce: 'Broad business and commerce opportunities' } },
    { id: 'commerce-12', question: 'What strength feels closest to yours?', options: { chartered_accountancy: 'Accuracy and financial discipline', management_business: 'Initiative and leadership', economics_analytics: 'Pattern recognition and interpretation', graduation_commerce: 'Adaptability across many business topics' } },
    { id: 'commerce-13', question: 'Which future role sounds most natural?', options: { chartered_accountancy: 'Finance specialist', management_business: 'Business manager or founder', economics_analytics: 'Analyst or economist', graduation_commerce: 'Commerce graduate with multiple directions' } },
    { id: 'commerce-14', question: 'Which college outcome do you value most?', options: { chartered_accountancy: 'Professional credibility', management_business: 'Business readiness', economics_analytics: 'Analytical depth', graduation_commerce: 'Future flexibility' } },
    { id: 'commerce-15', question: 'What kind of task would you choose first?', options: { chartered_accountancy: 'Preparing and verifying financial details', management_business: 'Pitching a plan or leading execution', economics_analytics: 'Reading a trend and explaining it', graduation_commerce: 'Learning the basics before locking in a path' } },
    { id: 'commerce-16', question: 'Which environment gives you confidence?', options: { chartered_accountancy: 'Clear systems and rules', management_business: 'Action and decision-making', economics_analytics: 'Data-backed reasoning', graduation_commerce: 'A flexible degree pathway' } },
    { id: 'commerce-17', question: 'What kind of pressure suits you best?', options: { chartered_accountancy: 'Accuracy under financial deadlines', management_business: 'Fast decisions with visible outcomes', economics_analytics: 'Complex numbers and strategic thinking', graduation_commerce: 'Building a foundation before specializing' } },
    { id: 'commerce-18', question: 'Which path would your strongest skills support?', options: { chartered_accountancy: 'Accounting and financial structure', management_business: 'Leadership and business growth', economics_analytics: 'Economics and analytics', graduation_commerce: 'Broad commerce learning first' } },
    { id: 'commerce-19', question: 'Which college activity would attract you most?', options: { chartered_accountancy: 'Finance or audit workshops', management_business: 'Startup incubator or leadership cell', economics_analytics: 'Market research or analytics club', graduation_commerce: 'A general commerce society' } },
    { id: 'commerce-20', question: 'What kind of internship sounds best?', options: { chartered_accountancy: 'Accounts, audit or finance operations', management_business: 'Business strategy or startup execution', economics_analytics: 'Analyst or research support work', graduation_commerce: 'A general business exposure role' } },
    { id: 'commerce-21', question: 'Which strength do you want to sharpen most?', options: { chartered_accountancy: 'Accuracy and financial judgment', management_business: 'Leadership and initiative', economics_analytics: 'Analytical interpretation', graduation_commerce: 'Versatility across commerce fields' } },
    { id: 'commerce-22', question: 'What kind of long-term win matters most?', options: { chartered_accountancy: 'Becoming a trusted finance expert', management_business: 'Leading a company or venture', economics_analytics: 'Becoming known for sharp market understanding', graduation_commerce: 'Keeping your path wide while building a strong base' } },
  ],
  humanities: [
    { id: 'humanities-1', question: 'Which path feels most natural after Class 12th?', options: { law_policy: 'Law and governance-related roles', psychology_media: 'Psychology, communication or media', civil_services_social: 'Civil services and social impact work', graduation_humanities: 'A broad humanities degree with multiple options' } },
    { id: 'humanities-2', question: 'Which exam family would you most likely prepare for?', options: { law_policy: 'CLAT or law entrances', psychology_media: 'Media, psychology or communication admissions', civil_services_social: 'Public service-oriented preparation routes', graduation_humanities: 'CUET Humanities and broad humanities admissions' } },
    { id: 'humanities-3', question: 'What kind of work matters to you most?', options: { law_policy: 'Argument, structure and justice', psychology_media: 'Understanding people and communicating clearly', civil_services_social: 'Leading change in society and public systems', graduation_humanities: 'Building a foundation while deciding later' } },
    { id: 'humanities-4', question: 'Which future sounds closer to your ambition?', options: { law_policy: 'Law, policy and institutions', psychology_media: 'Psychology, journalism or media work', civil_services_social: 'Civil services or social development', graduation_humanities: 'A broad humanities degree before specializing' } },
    { id: 'humanities-5', question: 'What would feel like a strong next step?', options: { law_policy: 'A route into law and governance learning', psychology_media: 'A people-focused communication or psychology route', civil_services_social: 'A path connected to public service and impact', graduation_humanities: 'A general degree with flexibility' } },
    { id: 'humanities-6', question: 'What kind of conversations attract you most?', options: { law_policy: 'Debates on rights, law and power', psychology_media: 'How people think, feel and communicate', civil_services_social: 'How society can improve through leadership', graduation_humanities: 'A mix of humanities ideas without narrowing early' } },
    { id: 'humanities-7', question: 'Which environment sounds best?', options: { law_policy: 'Courtrooms, policy desks or legal study spaces', psychology_media: 'Studios, counselling rooms or media spaces', civil_services_social: 'Administrative, field or public-facing systems', graduation_humanities: 'A college environment with wide exposure' } },
    { id: 'humanities-8', question: 'What kind of challenge appeals to you?', options: { law_policy: 'Building arguments and interpreting rules', psychology_media: 'Understanding minds and communicating stories', civil_services_social: 'Handling public issues and leadership decisions', graduation_humanities: 'Exploring multiple subjects before choosing deeply' } },
    { id: 'humanities-9', question: 'Which mentor would inspire you most?', options: { law_policy: 'A lawyer, judge or policy thinker', psychology_media: 'A psychologist, journalist or communicator', civil_services_social: 'A civil servant or social leader', graduation_humanities: 'A humanities professor with broad perspective' } },
    { id: 'humanities-10', question: 'What kind of result would make you proudest?', options: { law_policy: 'Joining a respected law path', psychology_media: 'Entering a strong psychology or media route', civil_services_social: 'Building toward public impact leadership', graduation_humanities: 'Securing a strong humanities degree and exploring options' } },
    { id: 'humanities-11', question: 'What kind of daily work feels meaningful?', options: { law_policy: 'Researching cases and constructing positions', psychology_media: 'Listening, writing, speaking and understanding people', civil_services_social: 'Working on real community or governance issues', graduation_humanities: 'Studying across subjects to shape direction later' } },
    { id: 'humanities-12', question: 'Which kind of strength feels closest to yours?', options: { law_policy: 'Reasoned argument and clarity', psychology_media: 'Empathy and expression', civil_services_social: 'Responsibility and public-minded thinking', graduation_humanities: 'Curiosity across many human-centered fields' } },
    { id: 'humanities-13', question: 'What type of preparation style suits you best?', options: { law_policy: 'Structured reading and argument building', psychology_media: 'Reflection, expression and people-based understanding', civil_services_social: 'Long-term purpose and public awareness', graduation_humanities: 'Exploration with flexibility' } },
    { id: 'humanities-14', question: 'Which topic would you willingly spend weekends on?', options: { law_policy: 'Constitution, justice or public rules', psychology_media: 'Behavior, stories and communication', civil_services_social: 'Policy, administration and society', graduation_humanities: 'A broad range of social science topics' } },
    { id: 'humanities-15', question: 'Which role sounds most natural to your future self?', options: { law_policy: 'Law or policy professional', psychology_media: 'Psychology or media professional', civil_services_social: 'Public service leader', graduation_humanities: 'Humanities graduate exploring paths' } },
    { id: 'humanities-16', question: 'What kind of output would satisfy you most?', options: { law_policy: 'A strong legal argument or policy note', psychology_media: 'A meaningful conversation or impactful story', civil_services_social: 'A decision that improves real lives', graduation_humanities: 'A broad understanding that guides later choices' } },
    { id: 'humanities-17', question: 'What kind of pressure can you handle best?', options: { law_policy: 'Defending a position with evidence', psychology_media: 'Expressing clearly in human situations', civil_services_social: 'Balancing people and systems under responsibility', graduation_humanities: 'Keeping options open without rushing' } },
    { id: 'humanities-18', question: 'Which path would your strongest traits support?', options: { law_policy: 'Law and policy', psychology_media: 'Psychology and media', civil_services_social: 'Civil services and social impact', graduation_humanities: 'Broad humanities exploration' } },
    { id: 'humanities-19', question: 'Which college club would you likely join first?', options: { law_policy: 'Debate, policy or legal literacy club', psychology_media: 'Psychology, theatre or media club', civil_services_social: 'Public affairs or social outreach group', graduation_humanities: 'A broad humanities discussion society' } },
    { id: 'humanities-20', question: 'Which kind of internship would interest you most?', options: { law_policy: 'A legal, policy or governance office', psychology_media: 'A counselling, media or communication role', civil_services_social: 'A public administration or NGO role', graduation_humanities: 'A general humanities research internship' } },
    { id: 'humanities-21', question: 'Which strength do you most want to use in your career?', options: { law_policy: 'Argument and structured reasoning', psychology_media: 'Empathy and communication', civil_services_social: 'Leadership and social responsibility', graduation_humanities: 'Breadth of understanding and flexibility' } },
    { id: 'humanities-22', question: 'What kind of future would feel most fulfilling?', options: { law_policy: 'Helping shape justice and institutions', psychology_media: 'Helping people through understanding or media', civil_services_social: 'Improving society through service and leadership', graduation_humanities: 'Exploring widely before locking your final path' } },
  ],
};

function randomUnit() {
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const values = new Uint32Array(1);
    crypto.getRandomValues(values);
    return values[0] / 4294967296;
  }
  return Math.random();
}

function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(randomUnit() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

const QUESTION_VARIANT_OPENERS = [
  'Right now,',
  'Imagine this clearly:',
  'Think honestly:',
  'Suppose you had to choose today:',
  'In your ideal future,',
  'When you picture yourself ahead,',
  'If this situation came up tomorrow,',
  'From your natural instinct,',
];

const QUESTION_VARIANT_ENDINGS = [
  'Choose the option that feels most natural.',
  'Pick the one you would genuinely choose.',
  'Go with the option that sounds most like you.',
  'Select the answer that matches your strongest instinct.',
  'Choose the one that feels easiest for you to imagine.',
  'Pick the path you would most likely follow.',
];

const OPTION_PREFIXES = [
  '',
  'I would prefer ',
  'I feel drawn to ',
  'Most likely, ',
  'Usually, I would choose ',
  'My first instinct is ',
];

function expandQuestionBank<T extends string>(
  bank: QuestionBlueprint<T>[],
  targetCount = 10000
): QuestionBlueprint<T>[] {
  if (bank.length >= targetCount) return bank.slice(0, targetCount);

  const expanded: QuestionBlueprint<T>[] = [];

  for (let index = 0; index < targetCount; index += 1) {
    const base = bank[index % bank.length];
    const opener = QUESTION_VARIANT_OPENERS[index % QUESTION_VARIANT_OPENERS.length];
    const ending = QUESTION_VARIANT_ENDINGS[Math.floor(index / bank.length) % QUESTION_VARIANT_ENDINGS.length];
    const prefixOffset = index % OPTION_PREFIXES.length;

    expanded.push({
      id: `${base.id}-v${index + 1}`,
      question: `${opener} ${base.question}`.trim(),
      subtitle: base.subtitle || ending,
      options: Object.fromEntries(
        Object.entries(base.options).map(([key, value], optionIndex) => {
          const prefix = OPTION_PREFIXES[(prefixOffset + optionIndex) % OPTION_PREFIXES.length];
          const normalizedValue =
            prefix && !value.toLowerCase().startsWith('i ')
              ? `${prefix}${value.charAt(0).toLowerCase()}${value.slice(1)}`
              : value;
          return [key, normalizedValue];
        })
      ) as Record<T, string>,
    });
  }

  return expanded;
}

function buildBalancedOptions<T extends string>(
  optionKeys: readonly T[],
  item: QuestionBlueprint<T>,
  positionUsage: Record<string, number[]>
): QuizOption[] {
  const baseOptions: PositionedOption<T>[] = optionKeys.map((key) => ({
    key,
    text: item.options[key],
    scores: { [key]: 3 },
  }));

  let bestOrder = shuffleArray(baseOptions);
  let bestScore = Number.POSITIVE_INFINITY;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate = shuffleArray(baseOptions);
    const score = candidate.reduce(
      (sum, option, index) => sum + (positionUsage[option.key]?.[index] || 0),
      0
    );

    if (score < bestScore) {
      bestOrder = candidate;
      bestScore = score;
    }
  }

  bestOrder.forEach((option, index) => {
    positionUsage[option.key][index] += 1;
  });

  return bestOrder.map(({ key: _key, ...option }) => option);
}

function buildQuestionSet<T extends string>(
  bank: QuestionBlueprint<T>[],
  optionKeys: readonly T[],
  count = 15
): QuizQuestion[] {
  const randomizedBank = shuffleArray(expandQuestionBank(bank, 10000));
  const positionUsage = Object.fromEntries(
    optionKeys.map((key) => [key, new Array(optionKeys.length).fill(0)])
  ) as Record<string, number[]>;

  return randomizedBank
    .slice(0, Math.min(count, randomizedBank.length))
    .map((item) => ({
      id: item.id,
      question: item.question,
      subtitle: item.subtitle,
      options: buildBalancedOptions(optionKeys, item, positionUsage),
    }));
}

export const CLASS12_SCORE_KEYS: Record<StreamKey, readonly string[]> = {
  pcm: PCM_KEYS,
  pcb: PCB_KEYS,
  commerce: COMMERCE_KEYS,
  humanities: HUMANITIES_KEYS,
};

export function buildClass10QuestionSet(): QuizQuestion[] {
  return buildQuestionSet(CLASS10_BANK, STREAM_ORDER, 15);
}

export function buildClass12QuestionSet(stream: StreamKey): QuizQuestion[] {
  return buildQuestionSet(CLASS12_BANK[stream], CLASS12_SCORE_KEYS[stream], 15);
}
