import { PracticeQuestion, Subject, Badge, PerformanceData, StudyModule } from '../types';

export const practiceQuestions: PracticeQuestion[] = [
  {
    id: 'bio1',
    subject: Subject.Biology,
    question: 'What is the powerhouse of the cell?',
    options: ['Nucleus', 'Ribosome', 'Mitochondrion', 'Cell Wall'],
    correctAnswer: 'Mitochondrion',
    explanation: "The mitochondrion is responsible for generating most of the cell's supply of adenosine triphosphate (ATP), used as a source of chemical energy."
  },
  {
    id: 'bio2',
    subject: Subject.Biology,
    question: 'Which of these is not part of the respiratory system?',
    options: ['Lungs', 'Diaphragm', 'Trachea', 'Esophagus'],
    correctAnswer: 'Esophagus',
    explanation: 'The esophagus is part of the digestive system. The lungs, diaphragm, and trachea are all key components of the respiratory system.'
  },
  {
    id: 'chem1',
    subject: Subject.Chemistry,
    question: 'What is the chemical symbol for Gold?',
    options: ['Ag', 'Au', 'G', 'Go'],
    correctAnswer: 'Au',
    explanation: 'The symbol Au for gold comes from its Latin name, "aurum".'
  },
  {
    id: 'chem2',
    subject: Subject.Chemistry,
    question: 'What is the pH of a neutral substance?',
    options: ['0', '7', '14', '1'],
    correctAnswer: '7',
    explanation: 'A pH of 7 is neutral. A pH less than 7 is acidic, and a pH greater than 7 is basic.'
  },
  {
    id: 'phys1',
    subject: Subject.Physics,
    question: 'What is the unit of electrical resistance?',
    options: ['Volt', 'Ampere', 'Ohm', 'Watt'],
    correctAnswer: 'Ohm',
    explanation: 'The Ohm (Ω) is the SI unit of electrical resistance, named after German physicist Georg Ohm.'
  },
   {
    id: 'phys2',
    subject: Subject.Physics,
    question: "What does Newton's first law of motion state?",
    options: ['F=ma', 'For every action, there is an equal and opposite reaction', 'An object at rest stays at rest', 'Energy cannot be created or destroyed'],
    correctAnswer: 'An object at rest stays at rest',
    explanation: "Newton's first law, also known as the law of inertia, states that an object at rest will stay at rest and an object in motion will stay in motion with the same speed and in the same direction unless acted upon by an unbalanced force."
  }
];

export const badges: Badge[] = [
  {
    id: 'practice_streak_3',
    title: 'Getting Started',
    description: 'Achieve a 3-question correct streak.',
    type: 'practice',
    criteria: { streak: 3 }
  },
  {
    id: 'practice_streak_5',
    title: 'On Fire!',
    description: 'Achieve a 5-question correct streak in a single practice session.',
    type: 'practice',
    criteria: { streak: 5 }
  },
  {
    id: 'practice_perfect_score',
    title: 'Perfectionist',
    description: 'Get a perfect score (100%) in a practice session with at least 5 questions.',
    type: 'practice',
    criteria: { scorePercentage: 100, minQuestions: 5 }
  },
   {
    id: 'practice_10_correct',
    title: 'Knowledge Builder',
    description: 'Answer 10 questions correctly in a single session.',
    type: 'practice',
    criteria: { correctAnswers: 10 }
  }
];

export const performanceHistory: PerformanceData[] = [
  { date: '2024-06-01', subject: Subject.Biology, score: 75 },
  { date: '2024-06-01', subject: Subject.Chemistry, score: 60 },
  { date: '2024-06-01', subject: Subject.Physics, score: 68 },
  { date: '2024-06-08', subject: Subject.Biology, score: 80 },
  { date: '2024-06-08', subject: Subject.Chemistry, score: 62 },
  { date: '2024-06-08', subject: Subject.Physics, score: 75 },
  { date: '2024-06-15', subject: Subject.Biology, score: 82 },
  { date: '2024-06-15', subject: Subject.Chemistry, score: 70 },
  { date: '2024-06-15', subject: Subject.Physics, score: 73 },
   { date: '2024-06-22', subject: Subject.Biology, score: 88 },
  { date: '2024-06-22', subject: Subject.Chemistry, score: 71 },
];

export const studyModules: StudyModule[] = [
    {
        id: 'bio-01',
        subject: Subject.Biology,
        title: 'Cellular Biology',
        summary: 'Explore the fundamental unit of life, the cell. Learn about its structure, organelles, and basic functions.',
        content: 'The cell is the basic structural, functional, and biological unit of all known organisms. A cell is the smallest unit of life. Cells are often called the "building blocks of life". The study of cells is called cell biology, cellular biology, or cytology.',
        isCompleted: true,
        x: 150,
        y: 200,
        unlocks: 'bio-02',
    },
    {
        id: 'bio-02',
        subject: Subject.Biology,
        title: 'Genetics and DNA',
        summary: 'Dive into the world of heredity, genes, and the molecule that carries the instructions for life.',
        content: 'Genetics is the study of genes, genetic variation, and heredity in living organisms. It is a branch of biology. Gregor Mendel, an Augustinian friar and scientist, is known as the "father of modern genetics" for his work on pea plants.',
        isCompleted: false,
        x: 350,
        y: 150,
    },
    {
        id: 'chem-01',
        subject: Subject.Chemistry,
        title: 'The Periodic Table',
        summary: 'Understand the organization of elements and the periodic trends that govern their properties.',
        content: 'The periodic table is a tabular arrangement of the chemical elements, ordered by their atomic number, electron configurations, and recurring chemical properties. Elements are presented in order of increasing atomic number.',
        isCompleted: true,
        x: 250,
        y: 400,
    },
    {
        id: 'phys-01',
        subject: Subject.Physics,
        title: "Newton's Laws of Motion",
        summary: 'Learn the three fundamental laws that describe the relationship between an object and the forces acting upon it.',
        content: "Newton's laws of motion are three physical laws that, together, laid the foundation for classical mechanics. They describe the relationship between a body and the forces acting upon it, and its motion in response to those forces.",
        isCompleted: false,
        x: 500,
        y: 350,
    }
];