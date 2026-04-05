import { Question, Player, UserStats, RewardItem, SeasonLevel, ClassLevel, Board } from '@/types/game';

// Helper to create questions
const q = (
  id: string, question: string, options: string[], correctAnswer: number,
  difficulty: 'easy' | 'medium' | 'hard', isDiamond: boolean,
  subject: string, cls: ClassLevel, board: Board
): Question => ({ id, question, options, correctAnswer, difficulty, isDiamond, subject, class: cls, board });

export const mockQuestions: Question[] = [
  // ===== CBSE CLASS 9 =====
  // Easy (3+)
  q('cbse9-e1', 'What is the chemical formula of water?', ['H2O', 'CO2', 'NaCl', 'O2'], 0, 'easy', true, 'Chemistry', '9th', 'CBSE'),
  q('cbse9-e2', 'Who wrote the Indian National Anthem?', ['Mahatma Gandhi', 'Rabindranath Tagore', 'Bankim Chandra', 'Sarojini Naidu'], 1, 'easy', false, 'Social Science', '9th', 'CBSE'),
  q('cbse9-e3', 'What is the value of π (pi) approximately?', ['3.14', '2.14', '4.14', '1.14'], 0, 'easy', false, 'Mathematics', '9th', 'CBSE'),
  q('cbse9-e4', 'Which planet is known as the Red Planet?', ['Venus', 'Mars', 'Jupiter', 'Saturn'], 1, 'easy', false, 'Science', '9th', 'CBSE'),
  // Medium (4+)
  q('cbse9-m1', 'Which organelle is known as the powerhouse of the cell?', ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi Body'], 2, 'medium', true, 'Biology', '9th', 'CBSE'),
  q('cbse9-m2', 'What is the SI unit of force?', ['Joule', 'Newton', 'Pascal', 'Watt'], 1, 'medium', false, 'Physics', '9th', 'CBSE'),
  q('cbse9-m3', 'The largest continent in the world is:', ['Africa', 'Europe', 'Asia', 'North America'], 2, 'medium', false, 'Geography', '9th', 'CBSE'),
  q('cbse9-m4', 'Which gas is most abundant in Earth\'s atmosphere?', ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], 2, 'medium', false, 'Science', '9th', 'CBSE'),
  q('cbse9-m5', 'In the French Revolution, the Bastille was stormed in which year?', ['1776', '1789', '1799', '1804'], 1, 'medium', false, 'History', '9th', 'CBSE'),
  // Hard (3+)
  q('cbse9-h1', 'The process by which green plants make their food is called:', ['Respiration', 'Photosynthesis', 'Digestion', 'Transpiration'], 1, 'hard', true, 'Biology', '9th', 'CBSE'),
  q('cbse9-h2', 'Which amendment of the Indian Constitution deals with Fundamental Duties?', ['42nd', '44th', '73rd', '86th'], 0, 'hard', false, 'Civics', '9th', 'CBSE'),
  q('cbse9-h3', 'What is the value of √(144)?', ['11', '12', '13', '14'], 1, 'hard', false, 'Mathematics', '9th', 'CBSE'),

  // ===== CBSE CLASS 10 =====
  q('cbse10-e1', 'What is the chemical formula of common salt?', ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], 0, 'easy', true, 'Chemistry', '10th', 'CBSE'),
  q('cbse10-e2', 'Who is known as the Father of the Nation?', ['Jawaharlal Nehru', 'Subhas Chandra Bose', 'Mahatma Gandhi', 'Sardar Patel'], 2, 'easy', false, 'Social Science', '10th', 'CBSE'),
  q('cbse10-e3', 'What is the LCM of 12 and 18?', ['24', '36', '48', '72'], 1, 'easy', false, 'Mathematics', '10th', 'CBSE'),
  q('cbse10-e4', 'Which metal is liquid at room temperature?', ['Iron', 'Mercury', 'Gold', 'Silver'], 1, 'easy', false, 'Chemistry', '10th', 'CBSE'),
  q('cbse10-m1', 'What is the focal length of a plane mirror?', ['Zero', 'Infinity', '1 meter', '10 cm'], 1, 'medium', true, 'Physics', '10th', 'CBSE'),
  q('cbse10-m2', 'The Rowlatt Act was passed in which year?', ['1917', '1919', '1920', '1921'], 1, 'medium', false, 'History', '10th', 'CBSE'),
  q('cbse10-m3', 'Which hormone is responsible for the fight-or-flight response?', ['Insulin', 'Thyroxine', 'Adrenaline', 'Estrogen'], 2, 'medium', false, 'Biology', '10th', 'CBSE'),
  q('cbse10-m4', 'What is the sum of all angles in a triangle?', ['90°', '180°', '270°', '360°'], 1, 'medium', false, 'Mathematics', '10th', 'CBSE'),
  q('cbse10-m5', 'Ohm\'s Law relates voltage, current and:', ['Power', 'Resistance', 'Capacitance', 'Inductance'], 1, 'medium', false, 'Physics', '10th', 'CBSE'),
  q('cbse10-h1', 'In the periodic table, elements are arranged by:', ['Atomic mass', 'Atomic number', 'Electron count', 'Neutron count'], 1, 'hard', true, 'Chemistry', '10th', 'CBSE'),
  q('cbse10-h2', 'The Treaty of Versailles was signed after which war?', ['World War II', 'World War I', 'Crimean War', 'Napoleonic Wars'], 1, 'hard', false, 'History', '10th', 'CBSE'),
  q('cbse10-h3', 'What is the derivative of x²?', ['x', '2x', '2x²', 'x/2'], 1, 'hard', false, 'Mathematics', '10th', 'CBSE'),

  // ===== CBSE CLASS 11 =====
  q('cbse11-e1', 'What is the unit of electric current?', ['Volt', 'Ampere', 'Ohm', 'Watt'], 1, 'easy', true, 'Physics', '11th', 'CBSE'),
  q('cbse11-e2', 'Which is the largest gland in the human body?', ['Pancreas', 'Thyroid', 'Liver', 'Pituitary'], 2, 'easy', false, 'Biology', '11th', 'CBSE'),
  q('cbse11-e3', 'What is the value of log₁₀(1000)?', ['2', '3', '4', '10'], 1, 'easy', false, 'Mathematics', '11th', 'CBSE'),
  q('cbse11-m1', 'The hybridization of carbon in methane is:', ['sp', 'sp2', 'sp3', 'sp3d'], 2, 'medium', true, 'Chemistry', '11th', 'CBSE'),
  q('cbse11-m2', 'Newton\'s second law states F = ?', ['ma', 'mv', 'mg', 'mc²'], 0, 'medium', false, 'Physics', '11th', 'CBSE'),
  q('cbse11-m3', 'Which type of RNA carries amino acids?', ['mRNA', 'tRNA', 'rRNA', 'snRNA'], 1, 'medium', false, 'Biology', '11th', 'CBSE'),
  q('cbse11-m4', 'What is the range of the function sin(x)?', ['[0, 1]', '[-1, 1]', '[0, ∞)', '(-∞, ∞)'], 1, 'medium', false, 'Mathematics', '11th', 'CBSE'),
  q('cbse11-m5', 'Which Indian state has the longest coastline?', ['Tamil Nadu', 'Gujarat', 'Maharashtra', 'Kerala'], 1, 'medium', false, 'Geography', '11th', 'CBSE'),
  q('cbse11-h1', 'What is the Aufbau principle related to?', ['Nuclear fission', 'Electron filling order', 'Chemical bonding', 'Gas laws'], 1, 'hard', true, 'Chemistry', '11th', 'CBSE'),
  q('cbse11-h2', 'The moment of inertia depends on:', ['Mass only', 'Shape only', 'Mass and distribution', 'Velocity'], 2, 'hard', false, 'Physics', '11th', 'CBSE'),
  q('cbse11-h3', 'What is the limit of sin(x)/x as x→0?', ['0', '1', '∞', 'undefined'], 1, 'hard', false, 'Mathematics', '11th', 'CBSE'),

  // ===== CBSE CLASS 12 =====
  q('cbse12-e1', 'What is the SI unit of capacitance?', ['Coulomb', 'Farad', 'Henry', 'Tesla'], 1, 'easy', true, 'Physics', '12th', 'CBSE'),
  q('cbse12-e2', 'DNA stands for:', ['Deoxyribonucleic Acid', 'Dinitro Amino Acid', 'Deoxyribo Nucleic Amine', 'None'], 0, 'easy', false, 'Biology', '12th', 'CBSE'),
  q('cbse12-e3', 'What is the integral of 1/x?', ['x', 'ln|x| + C', '1/x² + C', 'e^x + C'], 1, 'easy', false, 'Mathematics', '12th', 'CBSE'),
  q('cbse12-m1', 'Which law explains electromagnetic induction?', ['Ohm\'s Law', 'Faraday\'s Law', 'Coulomb\'s Law', 'Gauss\'s Law'], 1, 'medium', true, 'Physics', '12th', 'CBSE'),
  q('cbse12-m2', 'In which generation of computers were ICs used?', ['First', 'Second', 'Third', 'Fourth'], 2, 'medium', false, 'Computer Science', '12th', 'CBSE'),
  q('cbse12-m3', 'What is the order of the reaction if rate = k[A]²?', ['Zero', 'First', 'Second', 'Third'], 2, 'medium', false, 'Chemistry', '12th', 'CBSE'),
  q('cbse12-m4', 'The rank of a 3×3 identity matrix is:', ['0', '1', '2', '3'], 3, 'medium', false, 'Mathematics', '12th', 'CBSE'),
  q('cbse12-m5', 'Which article of the Indian Constitution deals with Right to Education?', ['Article 19', 'Article 21', 'Article 21A', 'Article 25'], 2, 'medium', false, 'Political Science', '12th', 'CBSE'),
  q('cbse12-h1', 'What is the de Broglie wavelength formula?', ['λ = h/p', 'λ = hf', 'λ = mc²', 'λ = E/h'], 0, 'hard', true, 'Physics', '12th', 'CBSE'),
  q('cbse12-h2', 'The coordination number of FCC is:', ['4', '6', '8', '12'], 3, 'hard', false, 'Chemistry', '12th', 'CBSE'),
  q('cbse12-h3', 'What is the determinant of a singular matrix?', ['1', '0', '-1', 'Infinity'], 1, 'hard', false, 'Mathematics', '12th', 'CBSE'),

  // ===== ICSE CLASS 9 =====
  q('icse9-e1', 'What is the chemical symbol for Gold?', ['Go', 'Gd', 'Au', 'Ag'], 2, 'easy', true, 'Chemistry', '9th', 'ICSE'),
  q('icse9-e2', 'The Mughal Empire was founded by:', ['Akbar', 'Babur', 'Humayun', 'Shah Jahan'], 1, 'easy', false, 'History', '9th', 'ICSE'),
  q('icse9-e3', 'What is 15% of 200?', ['20', '25', '30', '35'], 2, 'easy', false, 'Mathematics', '9th', 'ICSE'),
  q('icse9-m1', 'Which vitamin is produced by sunlight on skin?', ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'], 3, 'medium', true, 'Biology', '9th', 'ICSE'),
  q('icse9-m2', 'Sound travels fastest through:', ['Air', 'Water', 'Steel', 'Vacuum'], 2, 'medium', false, 'Physics', '9th', 'ICSE'),
  q('icse9-m3', 'The Tropic of Cancer passes through how many Indian states?', ['6', '7', '8', '9'], 2, 'medium', false, 'Geography', '9th', 'ICSE'),
  q('icse9-m4', 'What is the HCF of 24 and 36?', ['6', '8', '12', '18'], 2, 'medium', false, 'Mathematics', '9th', 'ICSE'),
  q('icse9-m5', 'Which tissue transports water in plants?', ['Phloem', 'Xylem', 'Parenchyma', 'Collenchyma'], 1, 'medium', false, 'Biology', '9th', 'ICSE'),
  q('icse9-h1', 'Rusting of iron is an example of:', ['Physical change', 'Chemical change', 'Nuclear change', 'No change'], 1, 'hard', true, 'Chemistry', '9th', 'ICSE'),
  q('icse9-h2', 'The Indian Constitution was adopted on:', ['15 Aug 1947', '26 Jan 1950', '26 Nov 1949', '30 Jan 1948'], 2, 'hard', false, 'Civics', '9th', 'ICSE'),
  q('icse9-h3', 'If x + 1/x = 5, what is x² + 1/x²?', ['23', '25', '27', '21'], 0, 'hard', false, 'Mathematics', '9th', 'ICSE'),

  // ===== ICSE CLASS 10 =====
  q('icse10-e1', 'What is the pH of pure water?', ['0', '7', '14', '1'], 1, 'easy', true, 'Chemistry', '10th', 'ICSE'),
  q('icse10-e2', 'The Governor of a state is appointed by:', ['Chief Minister', 'President', 'Prime Minister', 'Parliament'], 1, 'easy', false, 'Civics', '10th', 'ICSE'),
  q('icse10-e3', 'What is the area of a circle with radius 7 cm?', ['44 cm²', '154 cm²', '22 cm²', '308 cm²'], 1, 'easy', false, 'Mathematics', '10th', 'ICSE'),
  q('icse10-m1', 'Which lens is used to correct myopia?', ['Convex', 'Concave', 'Bifocal', 'Cylindrical'], 1, 'medium', true, 'Physics', '10th', 'ICSE'),
  q('icse10-m2', 'The Quit India Movement started in:', ['1940', '1942', '1944', '1946'], 1, 'medium', false, 'History', '10th', 'ICSE'),
  q('icse10-m3', 'What are the products of photosynthesis?', ['CO2 and water', 'Glucose and O2', 'Starch and CO2', 'Water and O2'], 1, 'medium', false, 'Biology', '10th', 'ICSE'),
  q('icse10-m4', 'What is the discriminant of ax² + bx + c = 0?', ['b² - 4ac', 'b² + 4ac', '4ac - b²', '2ab - c'], 0, 'medium', false, 'Mathematics', '10th', 'ICSE'),
  q('icse10-m5', 'Lactic acid fermentation occurs in:', ['Lungs', 'Muscles', 'Liver', 'Brain'], 1, 'medium', false, 'Biology', '10th', 'ICSE'),
  q('icse10-h1', 'What is the IUPAC name of CH₃COOH?', ['Methanoic acid', 'Ethanoic acid', 'Propanoic acid', 'Butanoic acid'], 1, 'hard', true, 'Chemistry', '10th', 'ICSE'),
  q('icse10-h2', 'The ratio of division in section formula for external division is:', ['m:n', '-m:n', 'm:-n', 'Both B and C'], 3, 'hard', false, 'Mathematics', '10th', 'ICSE'),
  q('icse10-h3', 'The Non-Aligned Movement was founded at:', ['Bandung', 'Belgrade', 'Cairo', 'Jakarta'], 1, 'hard', false, 'History', '10th', 'ICSE'),

  // ===== ICSE CLASS 11 =====
  q('icse11-e1', 'What is Avogadro\'s number?', ['6.022 × 10²³', '3.14 × 10²³', '1.6 × 10⁻¹⁹', '9.8 × 10²³'], 0, 'easy', true, 'Chemistry', '11th', 'ICSE'),
  q('icse11-e2', 'Which blood group is the universal donor?', ['A', 'B', 'AB', 'O'], 3, 'easy', false, 'Biology', '11th', 'ICSE'),
  q('icse11-e3', 'What is the value of sin 90°?', ['0', '1', '-1', '1/2'], 1, 'easy', false, 'Mathematics', '11th', 'ICSE'),
  q('icse11-m1', 'What is the dimensional formula of work?', ['[ML²T⁻²]', '[MLT⁻¹]', '[ML²T⁻¹]', '[MLT⁻²]'], 0, 'medium', true, 'Physics', '11th', 'ICSE'),
  q('icse11-m2', 'Which process converts sugar into ethanol?', ['Oxidation', 'Fermentation', 'Hydrolysis', 'Distillation'], 1, 'medium', false, 'Chemistry', '11th', 'ICSE'),
  q('icse11-m3', 'Krebs cycle occurs in:', ['Cytoplasm', 'Nucleus', 'Mitochondria', 'Ribosome'], 2, 'medium', false, 'Biology', '11th', 'ICSE'),
  q('icse11-m4', 'What is the sum of first n natural numbers?', ['n(n-1)/2', 'n(n+1)/2', 'n²/2', 'n(n+1)'], 1, 'medium', false, 'Mathematics', '11th', 'ICSE'),
  q('icse11-m5', 'Who proposed the heliocentric model?', ['Ptolemy', 'Copernicus', 'Galileo', 'Kepler'], 1, 'medium', false, 'Physics', '11th', 'ICSE'),
  q('icse11-h1', 'What is the hybridization of SF₆?', ['sp3', 'sp3d', 'sp3d2', 'dsp3'], 2, 'hard', true, 'Chemistry', '11th', 'ICSE'),
  q('icse11-h2', 'In projectile motion, acceleration at the highest point is:', ['Zero', 'g downward', 'g upward', 'g/2'], 1, 'hard', false, 'Physics', '11th', 'ICSE'),
  q('icse11-h3', 'What is the number of permutations of n things taken r at a time?', ['n!/(n-r)!', 'n!/r!', 'n!/(n-r)!r!', '(n+r)!/n!'], 0, 'hard', false, 'Mathematics', '11th', 'ICSE'),

  // ===== ICSE CLASS 12 =====
  q('icse12-e1', 'What is the charge of an electron?', ['1.6 × 10⁻¹⁹ C', '9.1 × 10⁻³¹ C', '1.67 × 10⁻²⁷ C', '3.2 × 10⁻¹⁹ C'], 0, 'easy', true, 'Physics', '12th', 'ICSE'),
  q('icse12-e2', 'Which organelle is involved in protein synthesis?', ['Lysosome', 'Ribosome', 'Vacuole', 'Centrosome'], 1, 'easy', false, 'Biology', '12th', 'ICSE'),
  q('icse12-e3', 'What is the derivative of e^x?', ['xe^(x-1)', 'e^x', 'e^(x+1)', '1/e^x'], 1, 'easy', false, 'Mathematics', '12th', 'ICSE'),
  q('icse12-m1', 'What is the principle of a transformer?', ['Coulomb\'s Law', 'Mutual Induction', 'Self Induction', 'Ohm\'s Law'], 1, 'medium', true, 'Physics', '12th', 'ICSE'),
  q('icse12-m2', 'Which catalyst is used in Haber\'s process?', ['Vanadium pentoxide', 'Iron', 'Platinum', 'Nickel'], 1, 'medium', false, 'Chemistry', '12th', 'ICSE'),
  q('icse12-m3', 'Crossing over occurs during which phase?', ['Leptotene', 'Pachytene', 'Diplotene', 'Diakinesis'], 1, 'medium', false, 'Biology', '12th', 'ICSE'),
  q('icse12-m4', 'What is the value of ∫₀¹ x² dx?', ['1/2', '1/3', '1/4', '1'], 1, 'medium', false, 'Mathematics', '12th', 'ICSE'),
  q('icse12-m5', 'What is the speed of light in vacuum?', ['3 × 10⁶ m/s', '3 × 10⁸ m/s', '3 × 10¹⁰ m/s', '3 × 10⁴ m/s'], 1, 'medium', false, 'Physics', '12th', 'ICSE'),
  q('icse12-h1', 'What is the structure of XeF₄?', ['Tetrahedral', 'Square planar', 'See-saw', 'Octahedral'], 1, 'hard', true, 'Chemistry', '12th', 'ICSE'),
  q('icse12-h2', 'The resolving power of a microscope depends on:', ['Focal length', 'Wavelength of light', 'Aperture only', 'Both B and C'], 3, 'hard', false, 'Physics', '12th', 'ICSE'),
  q('icse12-h3', 'The degree of the differential equation (d²y/dx²)³ + (dy/dx)² = 0 is:', ['1', '2', '3', '6'], 2, 'hard', false, 'Mathematics', '12th', 'ICSE'),
];

// Function to get filtered and selected questions for a quiz
export function getQuizQuestions(board: Board, classLevel: ClassLevel): Question[] {
  const filtered = mockQuestions.filter(q => q.board === board && q.class === classLevel);
  
  const easy = filtered.filter(q => q.difficulty === 'easy');
  const medium = filtered.filter(q => q.difficulty === 'medium');
  const hard = filtered.filter(q => q.difficulty === 'hard');

  // Shuffle helper
  const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

  // Pick 3 easy, 4 medium, 3 hard — ensure at least 1 diamond per difficulty
  const pickWithDiamond = (arr: Question[], count: number): Question[] => {
    const diamonds = arr.filter(q => q.isDiamond);
    const nonDiamonds = arr.filter(q => !q.isDiamond);
    const picked: Question[] = [];

    // Ensure 1 diamond
    if (diamonds.length > 0) {
      picked.push(shuffle(diamonds)[0]);
    }

    // Fill rest from remaining
    const remaining = shuffle([...diamonds.filter(q => !picked.includes(q)), ...nonDiamonds]);
    for (const q of remaining) {
      if (picked.length >= count) break;
      picked.push(q);
    }

    return shuffle(picked);
  };

  const selected = [
    ...pickWithDiamond(easy, 3),
    ...pickWithDiamond(medium, 4),
    ...pickWithDiamond(hard, 3),
  ];

  return selected;
}

export const mockPlayers: Player[] = [
  { id: '1', username: 'BrainMaster', avatar: '🧠', score: 980, rank: 1, level: 'diamond', tier: 1 },
  { id: '2', username: 'QuizKing', avatar: '👑', score: 920, rank: 2, level: 'platinum', tier: 2 },
  { id: '3', username: 'SmartPanda', avatar: '🐼', score: 880, rank: 3, level: 'gold', tier: 1 },
  { id: '4', username: 'NerdNinja', avatar: '🥷', score: 850, rank: 4, level: 'gold', tier: 2 },
  { id: '5', username: 'WiseFox', avatar: '🦊', score: 820, rank: 5, level: 'gold', tier: 3 },
  { id: '6', username: 'ThinkTank', avatar: '💡', score: 780, rank: 6, level: 'silver', tier: 1 },
  { id: '7', username: 'BookWorm', avatar: '📚', score: 750, rank: 7, level: 'silver', tier: 2 },
  { id: '8', username: 'StarStudent', avatar: '⭐', score: 720, rank: 8, level: 'silver', tier: 3 },
  { id: '9', username: 'CuriousCat', avatar: '🐱', score: 700, rank: 9, level: 'bronze', tier: 1 },
  { id: '10', username: 'BrainStorm', avatar: '⚡', score: 680, rank: 10, level: 'bronze', tier: 2 },
];

export const mockUserStats: UserStats = {
  totalQuestions: 150,
  correctAnswers: 120,
  wrongAnswers: 30,
  answeredIn5Sec: 25,
  answeredIn10Sec: 45,
  answeredIn30Sec: 50,
  gamesWon: 8,
  top5Finishes: 15,
  top10Finishes: 25,
  currentLevel: 'gold',
  currentTier: 2,
  totalCoins: 175,
  questionsToNextTier: 4,
};

export const rewardItems: RewardItem[] = [
  { id: 'r1', name: 'BOB Cap', description: 'Exclusive Battle of Brain cap', cost: 50, icon: '🧢', unlocked: true },
  { id: 'r2', name: 'BOB T-Shirt', description: 'Premium branded t-shirt', cost: 100, icon: '👕', unlocked: true },
  { id: 'r3', name: 'Study Guide Book', description: 'Complete CBSE/ICSE guide', cost: 150, icon: '📖', unlocked: false },
  { id: 'r4', name: 'Sample Paper Pack', description: '50+ practice papers', cost: 200, icon: '📝', unlocked: false },
];

export const seasonLevels: { level: SeasonLevel; name: string; color: string; minQuestions: number }[] = [
  { level: 'bronze', name: 'Bronze', color: 'bronze', minQuestions: 0 },
  { level: 'silver', name: 'Silver', color: 'silver', minQuestions: 30 },
  { level: 'gold', name: 'Gold', color: 'gold', minQuestions: 60 },
  { level: 'platinum', name: 'Platinum', color: 'platinum', minQuestions: 90 },
  { level: 'diamond', name: 'Diamond', color: 'diamond', minQuestions: 120 },
  { level: 'master', name: 'Master', color: 'master', minQuestions: 150 },
  { level: 'conquer', name: 'Conquer', color: 'conquer', minQuestions: 180 },
  { level: 'survivor', name: 'Survivor', color: 'survivor', minQuestions: 210 },
];
