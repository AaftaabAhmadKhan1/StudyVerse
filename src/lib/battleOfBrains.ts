export type BattleBoard = 'CBSE' | 'ICSE';
export type BattleClassLevel = '9th' | '10th' | '11th' | '12th';
export type BattleMode = 'live' | 'practice';
export type BattleDifficulty = 'easy' | 'medium' | 'hard';

export interface BattleQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: BattleDifficulty;
  subject: string;
  explanation: string;
  isDiamond?: boolean;
}

export interface BattleAttemptSummary {
  id: string;
  board: BattleBoard;
  classLevel: BattleClassLevel;
  mode: BattleMode;
  score: number;
  total: number;
  accuracy: number;
  completedAt: string;
}

export interface BattleAnswerRecord {
  userId: string;
  questionId: string;
  battleId: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  timeSpent: number;
  coinsEarned: number;
  answeredAt?: string;
  mode?: BattleMode;
  subject?: string;
  difficulty?: BattleDifficulty;
}

export interface BattleProfile {
  userId: string;
  totalQuestionsAnswered: number;
  correctAnswers: number;
  wrongAnswers: number;
  coins: number;
  ownedShopItemIds: string[];
}

export interface BattleAnalyticsSnapshot {
  totalUsers: number;
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  totalCoinsEarned: number;
}

export interface BattleComputedStats {
  accuracy: number;
  avgSpeed: number;
  totalXp: number;
  currentStreak: number;
  bestStreak: number;
  battlesPlayed: number;
  battlesWon: number;
  currentRank: number;
  weeklyXp: number;
  subjectAccuracy: Array<{ label: string; accuracy: number; correct: number; total: number }>;
  weeklyPoints: number[];
  xpPoints: number[];
  recentActivities: Array<{
    title: string;
    detail: string;
    time: string;
    accent: 'green' | 'cyan' | 'amber' | 'violet';
  }>;
}

export interface BattleBadge {
  id: string;
  title: string;
  detail: string;
  accent: 'amber' | 'cyan' | 'violet' | 'muted';
  earned: boolean;
  progressLabel: string;
}

export interface BattleShopItem {
  id: string;
  title: string;
  cost: number;
  icon: string;
  description: string;
}

export interface BattleLevelDefinition {
  name: string;
  minQuestions: number;
}

type QuestionPoolKey = `${BattleBoard}-${BattleClassLevel}`;

const question = (
  id: string,
  questionText: string,
  options: string[],
  correctAnswer: number,
  difficulty: BattleDifficulty,
  subject: string,
  explanation: string
): BattleQuestion => ({
  id,
  question: questionText,
  options,
  correctAnswer,
  difficulty,
  subject,
  explanation,
});

const QUESTION_POOL: Record<QuestionPoolKey, BattleQuestion[]> = {
  'CBSE-9th': [
    question('cbse9-e1', 'What is the chemical formula of water?', ['H2O', 'CO2', 'NaCl', 'O2'], 0, 'easy', 'Science', 'Water is made of two hydrogen atoms and one oxygen atom.'),
    question('cbse9-e2', 'Who wrote the Indian National Anthem?', ['Mahatma Gandhi', 'Rabindranath Tagore', 'Bankim Chandra', 'Sarojini Naidu'], 1, 'easy', 'Social Science', 'Rabindranath Tagore composed Jana Gana Mana.'),
    question('cbse9-e3', 'Which planet is known as the Red Planet?', ['Venus', 'Mars', 'Jupiter', 'Saturn'], 1, 'easy', 'Science', 'Mars appears red because of iron oxide on its surface.'),
    question('cbse9-m1', 'Which organelle is called the powerhouse of the cell?', ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], 2, 'medium', 'Biology', 'Mitochondria release usable energy for the cell.'),
    question('cbse9-m2', 'What is the SI unit of force?', ['Joule', 'Newton', 'Pascal', 'Watt'], 1, 'medium', 'Physics', 'Force is measured in newtons.'),
    question('cbse9-m3', 'Which gas is most abundant in Earth\'s atmosphere?', ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Hydrogen'], 2, 'medium', 'Science', 'Nitrogen forms most of the atmosphere.'),
    question('cbse9-m4', 'The Bastille was stormed in which year?', ['1776', '1789', '1799', '1804'], 1, 'medium', 'History', 'The storming of the Bastille happened in 1789 during the French Revolution.'),
    question('cbse9-h1', 'The process by which green plants make food is called?', ['Respiration', 'Photosynthesis', 'Digestion', 'Transpiration'], 1, 'hard', 'Biology', 'Plants use sunlight to make food through photosynthesis.'),
    question('cbse9-h2', 'Which Constitutional Amendment added Fundamental Duties?', ['42nd', '44th', '73rd', '86th'], 0, 'hard', 'Civics', 'The 42nd Amendment added Fundamental Duties.'),
    question('cbse9-h3', 'What is the value of square root of 144?', ['11', '12', '13', '14'], 1, 'hard', 'Mathematics', '12 multiplied by 12 equals 144.'),
  ],
  'CBSE-10th': [
    question('cbse10-e1', 'What is the chemical formula of common salt?', ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], 0, 'easy', 'Chemistry', 'Common salt is sodium chloride, NaCl.'),
    question('cbse10-e2', 'Who is known as the Father of the Nation in India?', ['Jawaharlal Nehru', 'Subhas Chandra Bose', 'Mahatma Gandhi', 'Sardar Patel'], 2, 'easy', 'History', 'Mahatma Gandhi is widely referred to as the Father of the Nation.'),
    question('cbse10-e3', 'Which metal is liquid at room temperature?', ['Iron', 'Mercury', 'Gold', 'Silver'], 1, 'easy', 'Chemistry', 'Mercury remains liquid at room temperature.'),
    question('cbse10-m1', 'What is the focal length of a plane mirror?', ['Zero', 'Infinity', '1 meter', '10 cm'], 1, 'medium', 'Physics', 'A plane mirror has an infinite focal length.'),
    question('cbse10-m2', 'The Rowlatt Act was passed in which year?', ['1917', '1919', '1920', '1921'], 1, 'medium', 'History', 'The Rowlatt Act was passed in 1919.'),
    question('cbse10-m3', 'What is the sum of all angles in a triangle?', ['90 degrees', '180 degrees', '270 degrees', '360 degrees'], 1, 'medium', 'Mathematics', 'All angles in a triangle add up to 180 degrees.'),
    question('cbse10-m4', 'Ohm\'s law relates voltage, current and which quantity?', ['Power', 'Resistance', 'Capacitance', 'Inductance'], 1, 'medium', 'Physics', 'Ohm\'s law is V = IR, where R is resistance.'),
    question('cbse10-h1', 'In the periodic table, elements are arranged by?', ['Atomic mass', 'Atomic number', 'Electron count', 'Neutron count'], 1, 'hard', 'Chemistry', 'The modern periodic table is arranged by atomic number.'),
    question('cbse10-h2', 'The Treaty of Versailles was signed after which war?', ['World War II', 'World War I', 'Crimean War', 'Napoleonic Wars'], 1, 'hard', 'History', 'It was signed after World War I.'),
    question('cbse10-h3', 'What is the derivative of x squared?', ['x', '2x', '2x squared', 'x over 2'], 1, 'hard', 'Mathematics', 'The derivative of x squared is 2x.'),
  ],
  'CBSE-11th': [
    question('cbse11-e1', 'What is the unit of electric current?', ['Volt', 'Ampere', 'Ohm', 'Watt'], 1, 'easy', 'Physics', 'Electric current is measured in ampere.'),
    question('cbse11-e2', 'Which is the largest gland in the human body?', ['Pancreas', 'Thyroid', 'Liver', 'Pituitary'], 2, 'easy', 'Biology', 'The liver is the largest gland in the body.'),
    question('cbse11-e3', 'What is the value of log base 10 of 1000?', ['2', '3', '4', '10'], 1, 'easy', 'Mathematics', '10 raised to the power 3 equals 1000.'),
    question('cbse11-m1', 'The hybridization of carbon in methane is?', ['sp', 'sp2', 'sp3', 'sp3d'], 2, 'medium', 'Chemistry', 'Methane has tetrahedral geometry with sp3 hybridization.'),
    question('cbse11-m2', 'Newton\'s second law is written as?', ['F = ma', 'F = mv', 'F = mg', 'F = mc2'], 0, 'medium', 'Physics', 'Force equals mass multiplied by acceleration.'),
    question('cbse11-m3', 'Which type of RNA carries amino acids?', ['mRNA', 'tRNA', 'rRNA', 'snRNA'], 1, 'medium', 'Biology', 'Transfer RNA carries amino acids to ribosomes.'),
    question('cbse11-m4', 'What is the range of sine x?', ['0 to 1', '-1 to 1', '0 to infinity', 'all real numbers'], 1, 'medium', 'Mathematics', 'The sine function ranges from -1 to 1.'),
    question('cbse11-h1', 'What is the Aufbau principle related to?', ['Nuclear fission', 'Electron filling order', 'Chemical bonding', 'Gas laws'], 1, 'hard', 'Chemistry', 'It explains electron filling order in orbitals.'),
    question('cbse11-h2', 'Moment of inertia depends on?', ['Mass only', 'Shape only', 'Mass and distribution', 'Velocity'], 2, 'hard', 'Physics', 'It depends on both mass and how that mass is distributed.'),
    question('cbse11-h3', 'What is the limit of sine x by x as x approaches zero?', ['0', '1', 'Infinity', 'Undefined'], 1, 'hard', 'Mathematics', 'This standard trigonometric limit equals 1.'),
  ],
  'CBSE-12th': [
    question('cbse12-e1', 'What is the SI unit of capacitance?', ['Coulomb', 'Farad', 'Henry', 'Tesla'], 1, 'easy', 'Physics', 'Capacitance is measured in farad.'),
    question('cbse12-e2', 'DNA stands for?', ['Deoxyribonucleic Acid', 'Dinitro Amino Acid', 'Deoxyribo Nucleic Amine', 'None'], 0, 'easy', 'Biology', 'DNA expands to Deoxyribonucleic Acid.'),
    question('cbse12-e3', 'What is the integral of 1 by x?', ['x', 'ln modulus x plus C', '1 by x squared plus C', 'e to x plus C'], 1, 'easy', 'Mathematics', 'The integral of 1 by x is ln modulus x plus constant.'),
    question('cbse12-m1', 'Which law explains electromagnetic induction?', ['Ohm\'s Law', 'Faraday\'s Law', 'Coulomb\'s Law', 'Gauss\'s Law'], 1, 'medium', 'Physics', 'Faraday\'s law explains induced emf.'),
    question('cbse12-m2', 'In which generation of computers were integrated circuits used?', ['First', 'Second', 'Third', 'Fourth'], 2, 'medium', 'Computer Science', 'Integrated circuits were a hallmark of third generation computers.'),
    question('cbse12-m3', 'What is the order of the reaction if rate = k[A] squared?', ['Zero', 'First', 'Second', 'Third'], 2, 'medium', 'Chemistry', 'The exponent 2 gives a second order reaction.'),
    question('cbse12-m4', 'The rank of a 3 by 3 identity matrix is?', ['0', '1', '2', '3'], 3, 'medium', 'Mathematics', 'An identity matrix of order 3 has rank 3.'),
    question('cbse12-h1', 'What is the de Broglie wavelength formula?', ['lambda = h by p', 'lambda = h f', 'lambda = m c squared', 'lambda = E by h'], 0, 'hard', 'Physics', 'De Broglie wavelength is Planck constant divided by momentum.'),
    question('cbse12-h2', 'The coordination number of FCC is?', ['4', '6', '8', '12'], 3, 'hard', 'Chemistry', 'Face centered cubic has coordination number 12.'),
    question('cbse12-h3', 'What is the determinant of a singular matrix?', ['1', '0', '-1', 'Infinity'], 1, 'hard', 'Mathematics', 'A singular matrix always has determinant zero.'),
  ],
  'ICSE-9th': [
    question('icse9-e1', 'What is the chemical symbol for gold?', ['Go', 'Gd', 'Au', 'Ag'], 2, 'easy', 'Chemistry', 'The symbol for gold is Au.'),
    question('icse9-e2', 'The Mughal Empire was founded by?', ['Akbar', 'Babur', 'Humayun', 'Shah Jahan'], 1, 'easy', 'History', 'Babur founded the Mughal Empire in India.'),
    question('icse9-e3', 'What is 15 percent of 200?', ['20', '25', '30', '35'], 2, 'easy', 'Mathematics', '15 percent of 200 is 30.'),
    question('icse9-m1', 'Which vitamin is produced when sunlight falls on skin?', ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], 3, 'medium', 'Biology', 'Sunlight helps the body synthesize vitamin D.'),
    question('icse9-m2', 'Sound travels fastest through?', ['Air', 'Water', 'Steel', 'Vacuum'], 2, 'medium', 'Physics', 'Sound travels fastest through solids such as steel.'),
    question('icse9-m3', 'What is the highest common factor of 24 and 36?', ['6', '8', '12', '18'], 2, 'medium', 'Mathematics', 'The HCF of 24 and 36 is 12.'),
    question('icse9-m4', 'Which tissue transports water in plants?', ['Phloem', 'Xylem', 'Parenchyma', 'Collenchyma'], 1, 'medium', 'Biology', 'Xylem carries water and minerals upward in plants.'),
    question('icse9-h1', 'Rusting of iron is an example of?', ['Physical change', 'Chemical change', 'Nuclear change', 'No change'], 1, 'hard', 'Chemistry', 'Rusting forms a new substance, so it is a chemical change.'),
    question('icse9-h2', 'The Constitution of India was adopted on?', ['15 August 1947', '26 January 1950', '26 November 1949', '30 January 1948'], 2, 'hard', 'Civics', 'The Constitution was adopted on 26 November 1949.'),
    question('icse9-h3', 'If x + 1 by x = 5, then x squared + 1 by x squared equals?', ['23', '25', '27', '21'], 0, 'hard', 'Mathematics', 'Square both sides and subtract 2 to get 23.'),
  ],
  'ICSE-10th': [
    question('icse10-e1', 'What is the pH of pure water?', ['0', '7', '14', '1'], 1, 'easy', 'Chemistry', 'Pure water has pH 7 at room temperature.'),
    question('icse10-e2', 'The Governor of a state is appointed by?', ['Chief Minister', 'President', 'Prime Minister', 'Parliament'], 1, 'easy', 'Civics', 'The Governor is appointed by the President of India.'),
    question('icse10-e3', 'What is the area of a circle of radius 7 cm?', ['44 square cm', '154 square cm', '22 square cm', '308 square cm'], 1, 'easy', 'Mathematics', 'Area is pi r squared, so 22 by 7 times 49 gives 154.'),
    question('icse10-m1', 'Which lens is used to correct myopia?', ['Convex', 'Concave', 'Bifocal', 'Cylindrical'], 1, 'medium', 'Physics', 'A concave lens helps correct myopia.'),
    question('icse10-m2', 'The Quit India Movement started in?', ['1940', '1942', '1944', '1946'], 1, 'medium', 'History', 'Quit India Movement was launched in 1942.'),
    question('icse10-m3', 'What are the products of photosynthesis?', ['Carbon dioxide and water', 'Glucose and oxygen', 'Starch and carbon dioxide', 'Water and oxygen'], 1, 'medium', 'Biology', 'Photosynthesis produces glucose and oxygen.'),
    question('icse10-m4', 'What is the discriminant of ax squared + bx + c = 0?', ['b squared minus 4ac', 'b squared plus 4ac', '4ac minus b squared', '2ab minus c'], 0, 'medium', 'Mathematics', 'The discriminant formula is b squared minus 4ac.'),
    question('icse10-h1', 'What is the IUPAC name of CH3COOH?', ['Methanoic acid', 'Ethanoic acid', 'Propanoic acid', 'Butanoic acid'], 1, 'hard', 'Chemistry', 'CH3COOH is ethanoic acid.'),
    question('icse10-h2', 'What is the ratio in the external section formula?', ['m:n', '-m:n', 'm:-n', 'Both second and third'], 3, 'hard', 'Mathematics', 'The external section formula can be expressed with opposite signs.'),
    question('icse10-h3', 'The Non-Aligned Movement was founded at?', ['Bandung', 'Belgrade', 'Cairo', 'Jakarta'], 1, 'hard', 'History', 'The first NAM summit took place at Belgrade.'),
  ],
  'ICSE-11th': [
    question('icse11-e1', 'What is Avogadro\'s number?', ['6.022 x 10^23', '3.14 x 10^23', '1.6 x 10^-19', '9.8 x 10^23'], 0, 'easy', 'Chemistry', 'Avogadro\'s number is 6.022 x 10^23.'),
    question('icse11-e2', 'Which blood group is the universal donor?', ['A', 'B', 'AB', 'O'], 3, 'easy', 'Biology', 'O negative is the universal donor; in simplified questions this appears as group O.'),
    question('icse11-e3', 'What is the value of sin 90 degrees?', ['0', '1', '-1', '1/2'], 1, 'easy', 'Mathematics', 'sin 90 degrees equals 1.'),
    question('icse11-m1', 'What is the dimensional formula of work?', ['ML squared T^-2', 'MLT^-1', 'ML squared T^-1', 'MLT^-2'], 0, 'medium', 'Physics', 'Work has the same dimensions as energy.'),
    question('icse11-m2', 'Which process converts sugar into ethanol?', ['Oxidation', 'Fermentation', 'Hydrolysis', 'Distillation'], 1, 'medium', 'Chemistry', 'Fermentation converts sugar into ethanol.'),
    question('icse11-m3', 'Krebs cycle occurs in?', ['Cytoplasm', 'Nucleus', 'Mitochondria', 'Ribosome'], 2, 'medium', 'Biology', 'Krebs cycle takes place in mitochondria.'),
    question('icse11-m4', 'What is the sum of first n natural numbers?', ['n(n-1)/2', 'n(n+1)/2', 'n squared over 2', 'n(n+1)'], 1, 'medium', 'Mathematics', 'The sum is n multiplied by n+1 divided by 2.'),
    question('icse11-h1', 'What is the hybridization of SF6?', ['sp3', 'sp3d', 'sp3d2', 'dsp3'], 2, 'hard', 'Chemistry', 'SF6 has octahedral geometry and sp3d2 hybridization.'),
    question('icse11-h2', 'In projectile motion, acceleration at the highest point is?', ['Zero', 'g downward', 'g upward', 'g/2'], 1, 'hard', 'Physics', 'Gravity acts downward throughout the motion.'),
    question('icse11-h3', 'What is the formula for permutations of n things taken r at a time?', ['n!/(n-r)!', 'n!/r!', 'n!/(n-r)!r!', '(n+r)!/n!'], 0, 'hard', 'Mathematics', 'Permutation formula is n factorial divided by n minus r factorial.'),
  ],
  'ICSE-12th': [
    question('icse12-e1', 'What is the charge of an electron?', ['1.6 x 10^-19 C', '9.1 x 10^-31 C', '1.67 x 10^-27 C', '3.2 x 10^-19 C'], 0, 'easy', 'Physics', 'The electronic charge magnitude is 1.6 x 10^-19 coulomb.'),
    question('icse12-e2', 'Which organelle is involved in protein synthesis?', ['Lysosome', 'Ribosome', 'Vacuole', 'Centrosome'], 1, 'easy', 'Biology', 'Ribosomes synthesize proteins.'),
    question('icse12-e3', 'What is the derivative of e^x?', ['x e^(x-1)', 'e^x', 'e^(x+1)', '1/e^x'], 1, 'easy', 'Mathematics', 'The derivative of e^x is e^x itself.'),
    question('icse12-m1', 'What is the principle behind a transformer?', ['Coulomb\'s Law', 'Mutual induction', 'Self induction', 'Ohm\'s Law'], 1, 'medium', 'Physics', 'Transformers work on mutual induction.'),
    question('icse12-m2', 'Which catalyst is used in Haber\'s process?', ['Vanadium pentoxide', 'Iron', 'Platinum', 'Nickel'], 1, 'medium', 'Chemistry', 'Finely divided iron is used in Haber\'s process.'),
    question('icse12-m3', 'Crossing over occurs during which phase of meiosis?', ['Leptotene', 'Pachytene', 'Diplotene', 'Diakinesis'], 1, 'medium', 'Biology', 'Crossing over mainly happens during pachytene.'),
    question('icse12-m4', 'What is the value of integral from 0 to 1 of x squared dx?', ['1/2', '1/3', '1/4', '1'], 1, 'medium', 'Mathematics', 'The result of the definite integral is 1/3.'),
    question('icse12-h1', 'What is the structure of XeF4?', ['Tetrahedral', 'Square planar', 'See-saw', 'Octahedral'], 1, 'hard', 'Chemistry', 'XeF4 has a square planar structure.'),
    question('icse12-h2', 'The resolving power of a microscope depends on?', ['Focal length', 'Wavelength only', 'Aperture only', 'Both wavelength and aperture'], 3, 'hard', 'Physics', 'Resolving power depends on both wavelength and aperture.'),
    question('icse12-h3', 'The degree of the differential equation (d squared y by dx squared)^3 + (dy by dx)^2 = 0 is?', ['1', '2', '3', '6'], 2, 'hard', 'Mathematics', 'The highest order derivative has exponent 3, so the degree is 3.'),
  ],
};

export const BOARD_OPTIONS: BattleBoard[] = ['CBSE', 'ICSE'];
export const CLASS_OPTIONS: BattleClassLevel[] = ['9th', '10th', '11th', '12th'];
export const RECENT_ATTEMPTS_KEY = 'pw-studyverse-battle-attempts';
export const BATTLE_PROFILE_KEY = 'pw-studyverse-battle-profile';
export const BATTLE_ANALYTICS_KEY = 'pw-studyverse-battle-analytics';
export const BATTLE_RESPONSES_KEY = 'pw-studyverse-battle-responses';
export const BATTLE_USER_ID_KEY = 'pw-studyverse-battle-user-id';

export const BATTLE_SHOP_ITEMS: BattleShopItem[] = [
  { id: 'bob-cap', title: 'BOB Cap', cost: 50, icon: 'cap', description: 'Style upgrade for your profile.' },
  { id: 'bob-tshirt', title: 'BOB T-Shirt', cost: 100, icon: 'shirt', description: 'Official Battle Of Brain merch.' },
  { id: 'study-guide-book', title: 'Study Guide Book', cost: 150, icon: 'book', description: 'Boost your revision kit.' },
  { id: 'sample-paper-pack', title: 'Sample Paper Pack', cost: 200, icon: 'paper', description: 'Unlock extra mock practice.' },
];

export const BATTLE_LEVELS: BattleLevelDefinition[] = [
  { name: 'Bronze', minQuestions: 0 },
  { name: 'Silver', minQuestions: 45 },
  { name: 'Gold', minQuestions: 90 },
  { name: 'Platinum', minQuestions: 135 },
  { name: 'Diamond', minQuestions: 180 },
  { name: 'Master', minQuestions: 225 },
  { name: 'Ace', minQuestions: 270 },
  { name: 'Conquer', minQuestions: 315 },
];

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function getFallbackBattleQuestions(
  board: BattleBoard,
  classLevel: BattleClassLevel
): BattleQuestion[] {
  const key = `${board}-${classLevel}` as QuestionPoolKey;
  const pool = QUESTION_POOL[key] || QUESTION_POOL['CBSE-9th'];
  const easy = shuffle(pool.filter((item) => item.difficulty === 'easy')).slice(0, 3);
  const medium = shuffle(pool.filter((item) => item.difficulty === 'medium')).slice(0, 4);
  const hard = shuffle(pool.filter((item) => item.difficulty === 'hard')).slice(0, 3);
  return shuffle([...easy, ...medium, ...hard]).slice(0, 10);
}

export function buildBattleQuestionSet(
  board: BattleBoard,
  classLevel: BattleClassLevel
): BattleQuestion[] {
  const key = `${board}-${classLevel}` as QuestionPoolKey;
  const pool = QUESTION_POOL[key] || QUESTION_POOL['CBSE-9th'];
  const easy = shuffle(pool.filter((item) => item.difficulty === 'easy'))
    .slice(0, 3)
    .map((item, index) => ({ ...item, isDiamond: index === 0 }));
  const medium = shuffle(pool.filter((item) => item.difficulty === 'medium'))
    .slice(0, 4)
    .map((item, index) => ({ ...item, isDiamond: index === 0 }));
  const hard = shuffle(pool.filter((item) => item.difficulty === 'hard'))
    .slice(0, 3)
    .map((item, index) => ({ ...item, isDiamond: index === 0 }));

  return [...easy, ...medium, ...hard];
}

export function getBattleUserId() {
  if (typeof window === 'undefined') return 'server-user';
  const existing = window.localStorage.getItem(BATTLE_USER_ID_KEY);
  if (existing) return existing;
  const generated = `bob-user-${Math.random().toString(36).slice(2, 10)}`;
  window.localStorage.setItem(BATTLE_USER_ID_KEY, generated);
  return generated;
}

export function syncBattleIdentity(userId?: string | null) {
  if (typeof window === 'undefined' || !userId) return;
  window.localStorage.setItem(BATTLE_USER_ID_KEY, userId);
  const profile = getBattleProfile();
  if (profile.userId !== userId) {
    saveBattleProfile({ ...profile, userId });
  }
}

export function getBattleProfile(): BattleProfile {
  const fallback: BattleProfile = {
    userId: typeof window === 'undefined' ? 'server-user' : getBattleUserId(),
    totalQuestionsAnswered: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    coins: 0,
    ownedShopItemIds: [],
  };

  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(BATTLE_PROFILE_KEY);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveBattleProfile(profile: BattleProfile) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BATTLE_PROFILE_KEY, JSON.stringify(profile));
}

export function getBattleAnalytics(): BattleAnalyticsSnapshot {
  const fallback: BattleAnalyticsSnapshot = {
    totalUsers: 0,
    totalQuestionsSolved: 0,
    totalCorrectAnswers: 0,
    totalCoinsEarned: 0,
  };

  if (typeof window === 'undefined') return fallback;
  try {
    const stored = window.localStorage.getItem(BATTLE_ANALYTICS_KEY);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

export function saveBattleAnalytics(stats: BattleAnalyticsSnapshot) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(BATTLE_ANALYTICS_KEY, JSON.stringify(stats));
}

export function getBattleResponses(): BattleAnswerRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = window.localStorage.getItem(BATTLE_RESPONSES_KEY);
    return stored ? (JSON.parse(stored) as BattleAnswerRecord[]) : [];
  } catch {
    return [];
  }
}

export function recordBattleAnswerBatch(records: BattleAnswerRecord[]) {
  if (typeof window === 'undefined' || records.length === 0) return;
  const normalizedRecords = records.map((record) => ({
    ...record,
    answeredAt: record.answeredAt ?? new Date().toISOString(),
  }));
  const existing = getBattleResponses();
  const nextResponses = [...existing, ...normalizedRecords];
  window.localStorage.setItem(BATTLE_RESPONSES_KEY, JSON.stringify(nextResponses));

  const currentProfile = getBattleProfile();
  const userId = currentProfile.userId || getBattleUserId();
  const ownRecords = nextResponses.filter((record) => record.userId === userId);
  const updatedProfile: BattleProfile = {
    userId,
    totalQuestionsAnswered: ownRecords.length,
    correctAnswers: ownRecords.filter((record) => record.isCorrect).length,
    wrongAnswers: ownRecords.filter((record) => !record.isCorrect).length,
    coins:
      currentProfile.coins + normalizedRecords.reduce((sum, record) => sum + record.coinsEarned, 0),
    ownedShopItemIds: currentProfile.ownedShopItemIds,
  };
  saveBattleProfile(updatedProfile);

  const uniqueUsers = new Set(nextResponses.map((record) => record.userId));
  saveBattleAnalytics({
    totalUsers: uniqueUsers.size,
    totalQuestionsSolved: nextResponses.length,
    totalCorrectAnswers: nextResponses.filter((record) => record.isCorrect).length,
    totalCoinsEarned: nextResponses.reduce((sum, record) => sum + record.coinsEarned, 0),
  });
}

export function getBattleComputedStats(profile = getBattleProfile(), responses = getBattleResponses()): BattleComputedStats {
  const ownResponses = responses.filter((record) => record.userId === profile.userId);
  const total = ownResponses.length;
  const correct = ownResponses.filter((record) => record.isCorrect).length;
  const accuracy = total ? (correct / total) * 100 : 0;
  const avgSpeed = total
    ? ownResponses.reduce((sum, record) => sum + record.timeSpent, 0) / total
    : 0;

  const groupedByBattle = new Map<string, BattleAnswerRecord[]>();
  ownResponses.forEach((record) => {
    const existing = groupedByBattle.get(record.battleId) ?? [];
    existing.push(record);
    groupedByBattle.set(record.battleId, existing);
  });

  const battles = Array.from(groupedByBattle.values());
  const battlesWon = battles.filter((records) => {
    const battleCorrect = records.filter((record) => record.isCorrect).length;
    return battleCorrect >= Math.ceil(records.length / 2);
  }).length;

  let currentStreak = 0;
  let bestStreak = 0;
  let runningStreak = 0;
  ownResponses.forEach((record) => {
    if (record.isCorrect) {
      runningStreak += 1;
      bestStreak = Math.max(bestStreak, runningStreak);
    } else {
      runningStreak = 0;
    }
  });
  for (let i = ownResponses.length - 1; i >= 0; i -= 1) {
    if (!ownResponses[i].isCorrect) break;
    currentStreak += 1;
  }

  const totalXp =
    correct * 20 +
    ownResponses.filter((record) => record.coinsEarned > 0).length * 15 +
    battlesWon * 50;

  const totalUsers = Math.max(1, getBattleAnalytics().totalUsers);
  const currentRank = Math.max(1, totalUsers - battlesWon);

  const subjectMap = new Map<string, { correct: number; total: number }>();
  ownResponses.forEach((record) => {
    const key = record.subject ?? 'Mixed';
    const current = subjectMap.get(key) ?? { correct: 0, total: 0 };
    current.total += 1;
    if (record.isCorrect) current.correct += 1;
    subjectMap.set(key, current);
  });

  const subjectAccuracy = Array.from(subjectMap.entries()).map(([label, value]) => ({
    label,
    accuracy: value.total ? (value.correct / value.total) * 100 : 0,
    correct: value.correct,
    total: value.total,
  }));

  const today = new Date();
  const dayBuckets = Array.from({ length: 7 }, (_, index) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - index));
    return d.toISOString().slice(0, 10);
  });

  const dayXpMap = new Map<string, number>(dayBuckets.map((day) => [day, 0]));
  ownResponses.forEach((record) => {
    const day = (record.answeredAt ?? new Date().toISOString()).slice(0, 10);
    if (!dayXpMap.has(day)) return;
    const existing = dayXpMap.get(day) ?? 0;
    dayXpMap.set(day, existing + (record.isCorrect ? 20 : 5) + record.coinsEarned * 3);
  });
  const weeklyPoints = dayBuckets.map((day) => dayXpMap.get(day) ?? 0);

  const xpPoints: number[] = [];
  let cumulativeXp = 0;
  battles.forEach((records) => {
    const battleXp =
      records.filter((record) => record.isCorrect).length * 20 +
      records.reduce((sum, record) => sum + record.coinsEarned * 3, 0);
    cumulativeXp += battleXp;
    xpPoints.push(cumulativeXp);
  });

  const recentActivities = battles
    .slice(-4)
    .reverse()
    .map((records, index) => {
      const correctCount = records.filter((record) => record.isCorrect).length;
      const mode = records[0]?.mode === 'live' ? 'Live Battle' : 'Practice Session';
      const subject = records[0]?.subject ?? 'Mixed';
      return {
        title: correctCount >= Math.ceil(records.length / 2) ? `Won ${mode}` : `${mode} Completed`,
        detail: `${subject} · ${correctCount}/${records.length} Correct · +${records.reduce((sum, record) => sum + record.coinsEarned, 0)} Coins`,
        time: index === 0 ? 'Just now' : `${index + 1} session${index > 0 ? 's' : ''} ago`,
        accent: (correctCount >= Math.ceil(records.length / 2)
          ? 'green'
          : records[0]?.mode === 'live'
            ? 'amber'
            : 'cyan') as 'green' | 'cyan' | 'amber' | 'violet',
      };
    });

  return {
    accuracy,
    avgSpeed,
    totalXp,
    currentStreak,
    bestStreak,
    battlesPlayed: battles.length,
    battlesWon,
    currentRank,
    weeklyXp: weeklyPoints.reduce((sum, value) => sum + value, 0),
    subjectAccuracy,
    weeklyPoints,
    xpPoints: xpPoints.length ? xpPoints : [0],
    recentActivities,
  };
}

export function getBattleBadges(
  profile = getBattleProfile(),
  computedStats = getBattleComputedStats(profile)
): BattleBadge[] {
  const levelState = getBattleLevelState(profile.totalQuestionsAnswered);
  const totalCoinsEarned = getBattleResponses()
    .filter((record) => record.userId === profile.userId)
    .reduce((sum, record) => sum + record.coinsEarned, 0);

  return [
    {
      id: 'brainiac-king',
      title: 'Brainiac King',
      detail: 'Win 50 battles in Battle Of Brains.',
      earned: computedStats.battlesWon >= 50,
      progressLabel: `${computedStats.battlesWon}/50 battles won`,
      accent: computedStats.battlesWon >= 50 ? 'amber' : 'muted',
    },
    {
      id: 'speedster',
      title: 'Speedster',
      detail: 'Maintain an average answer speed under 10 seconds.',
      earned:
        profile.totalQuestionsAnswered >= 10 &&
        computedStats.avgSpeed > 0 &&
        computedStats.avgSpeed < 10,
      progressLabel:
        profile.totalQuestionsAnswered < 10
          ? `${profile.totalQuestionsAnswered}/10 answers tracked`
          : `${computedStats.avgSpeed.toFixed(1)}s average`,
      accent:
        profile.totalQuestionsAnswered >= 10 &&
        computedStats.avgSpeed > 0 &&
        computedStats.avgSpeed < 10
          ? 'cyan'
          : 'muted',
    },
    {
      id: 'survivor',
      title: 'Survivor',
      detail: 'Answer 5 questions in a row correctly.',
      earned: computedStats.bestStreak >= 5,
      progressLabel: `${computedStats.bestStreak}/5 streak`,
      accent: computedStats.bestStreak >= 5 ? 'violet' : 'muted',
    },
    {
      id: 'diamond-mind',
      title: 'Diamond Mind',
      detail: 'Reach Diamond level or above.',
      earned: levelState.currentLevelIndex >= 4,
      progressLabel: `${levelState.currentLevel.name} tier ${levelState.currentTier}`,
      accent: levelState.currentLevelIndex >= 4 ? 'amber' : 'muted',
    },
    {
      id: 'coin-collector',
      title: 'Coin Collector',
      detail: 'Earn 100 total coins from diamond questions.',
      earned: totalCoinsEarned >= 100,
      progressLabel: `${totalCoinsEarned}/100 coins earned`,
      accent: totalCoinsEarned >= 100 ? 'cyan' : 'muted',
    },
  ];
}

export function purchaseBattleItem(itemId: string) {
  const item = BATTLE_SHOP_ITEMS.find((entry) => entry.id === itemId);
  if (!item) return { status: 'missing' as const, profile: getBattleProfile() };

  const profile = getBattleProfile();
  if (profile.ownedShopItemIds.includes(itemId)) {
    return { status: 'owned' as const, profile };
  }
  if (profile.coins < item.cost) {
    return { status: 'locked' as const, profile };
  }

  const updatedProfile: BattleProfile = {
    ...profile,
    coins: profile.coins - item.cost,
    ownedShopItemIds: [...profile.ownedShopItemIds, itemId],
  };
  saveBattleProfile(updatedProfile);
  return { status: 'purchased' as const, profile: updatedProfile };
}

export function getBattleLevelState(totalQuestionsAnswered: number) {
  const currentLevelIndex = BATTLE_LEVELS.reduce((acc, level, index) => {
    if (totalQuestionsAnswered >= level.minQuestions) return index;
    return acc;
  }, 0);
  const currentLevel = BATTLE_LEVELS[currentLevelIndex];
  const nextLevel = BATTLE_LEVELS[currentLevelIndex + 1];
  const tierProgressWithinLevel = totalQuestionsAnswered - currentLevel.minQuestions;
  const currentTier = Math.min(3, Math.floor(tierProgressWithinLevel / 10) + 1);
  const tierDotsCompleted = Math.min(3, Math.floor(tierProgressWithinLevel / 10));
  const progressToNextLevel = nextLevel
    ? Math.min(
        100,
        Math.max(
          0,
          ((totalQuestionsAnswered - currentLevel.minQuestions) /
            (nextLevel.minQuestions - currentLevel.minQuestions)) *
            100
        )
      )
    : 100;

  return {
    currentLevel,
    nextLevel,
    currentLevelIndex,
    currentTier,
    tierDotsCompleted,
    progressToNextLevel,
  };
}

export function buildMockLeaderboard(score: number) {
  const safeScore = Math.max(0, Math.min(10, score));
  return [
    { rank: 1, name: 'Neural Ninja', score: Math.max(9, safeScore + 2), streak: 14 },
    { rank: 2, name: 'Concept Crusher', score: Math.max(8, safeScore + 1), streak: 11 },
    { rank: 3, name: 'You', score: safeScore, streak: Math.max(1, safeScore) },
    { rank: 4, name: 'Vector Vishal', score: Math.max(5, safeScore - 1), streak: 7 },
    { rank: 5, name: 'Quiz Queen', score: Math.max(4, safeScore - 2), streak: 5 },
  ];
}

export function calculateBattleCountdown() {
  const now = new Date();
  const nextBattle = new Date(now);
  nextBattle.setHours(17, 0, 0, 0);
  if (nextBattle.getTime() <= now.getTime()) {
    nextBattle.setDate(nextBattle.getDate() + 1);
  }

  const ms = nextBattle.getTime() - now.getTime();
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    hours,
    minutes,
    seconds,
    label: `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
  };
}
