import { CelestialBody, PracticeQuestion, Badge, PerformanceData, Subject, Quiz } from '../types';

export const celestialBodies: CelestialBody[] = [
  // The Sun - Our star, a visual center but not a mission target
  {
    id: 'sol',
    title: 'body.sol.title',
    subject: Subject.Physics,
    description: 'body.sol.description',
    content: 'body.sol.content',
    summary: 'body.sol.summary',
    bodyType: 'Star',
    isCompleted: false, // Not a completable mission
    x: 50,
    y: 50,
  },
  // Inner Planets
  {
    id: 'mercury',
    title: 'body.mercury.title',
    subject: Subject.Physics,
    description: 'body.mercury.description',
    content: 'body.mercury.content',
    summary: 'body.mercury.summary',
    bodyType: 'Terrestrial',
    isCompleted: false,
    x: 42,
    y: 52,
    color: '#A0AEC0', // gray-500
  },
  {
    id: 'venus',
    title: 'body.venus.title',
    subject: Subject.Chemistry,
    description: 'body.venus.description',
    content: 'body.venus.content',
    summary: 'body.venus.summary',
    bodyType: 'Terrestrial',
    isCompleted: false,
    x: 35,
    y: 47,
    color: '#F6E05E', // yellow-400
  },
  {
    id: 'earth',
    title: 'body.earth.title',
    subject: Subject.Biology,
    description: 'body.earth.description',
    content: 'body.earth.content',
    summary: 'body.earth.summary',
    bodyType: 'Terrestrial',
    isCompleted: true, // This is where the journey begins
    x: 27,
    y: 53,
    unlocks: 'moon',
    color: '#4299E1', // blue-400
  },
  {
    id: 'moon',
    title: 'body.moon.title',
    subject: Subject.Physics,
    description: 'body.moon.description',
    content: 'body.moon.content',
    summary: 'body.moon.summary',
    bodyType: 'Moon',
    isCompleted: false,
    x: 24,
    y: 49,
    unlocks: 'mars',
    color: '#A0AEC0', // gray-400
  },
  {
    id: 'mars',
    title: 'body.mars.title',
    subject: Subject.Chemistry,
    description: 'body.mars.description',
    content: 'body.mars.content',
    summary: 'body.mars.summary',
    bodyType: 'Terrestrial',
    isCompleted: false,
    x: 19,
    y: 46,
    unlocks: 'jupiter',
    color: '#E53E3E', // red-600
  },
  // Outer Planets
  {
    id: 'jupiter',
    title: 'body.jupiter.title',
    subject: Subject.Physics,
    description: 'body.jupiter.description',
    content: 'body.jupiter.content',
    summary: 'body.jupiter.summary',
    bodyType: 'GasGiant',
    isCompleted: false,
    x: 10,
    y: 55,
    color: '#D69E2E', // yellow-600
  },
  {
    id: 'saturn',
    title: 'body.saturn.title',
    subject: Subject.Physics,
    description: 'body.saturn.description',
    content: 'body.saturn.content',
    summary: 'body.saturn.summary',
    bodyType: 'GasGiant',
    isCompleted: false,
    x: 70,
    y: 40,
    color: '#F6E05E', // yellow-400
  },
  {
    id: 'uranus',
    title: 'body.uranus.title',
    subject: Subject.Physics,
    description: 'body.uranus.description',
    content: 'body.uranus.content',
    summary: 'body.uranus.summary',
    bodyType: 'IceGiant',
    isCompleted: false,
    x: 80,
    y: 55,
    color: '#63B3ED', // blue-300
  },
  {
    id: 'neptune',
    title: 'body.neptune.title',
    subject: Subject.Physics,
    description: 'body.neptune.description',
    content: 'body.neptune.content',
    summary: 'body.neptune.summary',
    bodyType: 'IceGiant',
    isCompleted: false,
    x: 90,
    y: 45,
    color: '#4299E1', // blue-500
  },
];


export const practiceQuestions: PracticeQuestion[] = [
  // Biology
  {
    id: 'q-bio-1',
    subject: Subject.Biology,
    question: 'question.bio1.q',
    options: ['option.bio1.a', 'option.bio1.b', 'option.bio1.c', 'option.bio1.d'],
    correctAnswer: 'option.bio1.c',
    explanation: 'explanation.bio1'
  },
  {
    id: 'q-bio-2',
    subject: Subject.Biology,
    question: 'question.bio2.q',
    options: ['option.bio2.a', 'option.bio2.b', 'option.bio2.c', 'option.bio2.d'],
    correctAnswer: 'option.bio2.a',
    explanation: 'explanation.bio2'
  },
  // Chemistry
  {
    id: 'q-chem-1',
    subject: Subject.Chemistry,
    question: 'question.chem1.q',
    options: ['option.chem1.a', 'option.chem1.b', 'option.chem1.c', 'option.chem1.d'],
    correctAnswer: 'option.chem1.a',
    explanation: 'explanation.chem1'
  },
   {
    id: 'q-chem-2',
    subject: Subject.Chemistry,
    question: 'question.chem2.q',
    options: ['option.chem2.a', 'option.chem2.b', 'option.chem2.c', 'option.chem2.d'],
    correctAnswer: 'option.chem2.d',
    explanation: 'explanation.chem2'
  },
  // Physics
  {
    id: 'q-phy-1',
    subject: Subject.Physics,
    question: 'question.phy1.q',
    options: ['option.phy1.a', 'option.phy1.b', 'option.phy1.c', 'option.phy1.d'],
    correctAnswer: 'option.phy1.b',
    explanation: 'explanation.phy1'
  },
  {
    id: 'q-phy-2',
    subject: Subject.Physics,
    question: 'question.phy2.q',
    options: ['option.phy2.a', 'option.phy2.b', 'option.phy2.c', 'option.phy2.d'],
    correctAnswer: 'option.phy2.c',
    explanation: 'explanation.phy2'
  }
];

export const badges: Badge[] = [
  {
    id: 'streak-3',
    title: 'badge.streak-3.title',
    description: 'badge.streak-3.description',
    type: 'practice',
    criteria: { streak: 3 }
  },
  {
    id: 'correct-5',
    title: 'badge.correct-5.title',
    description: 'badge.correct-5.description',
    type: 'practice',
    criteria: { correctAnswers: 5 }
  },
  {
    id: 'score-100',
    title: 'badge.score-100.title',
    description: 'badge.score-100.description',
    type: 'practice',
    criteria: { scorePercentage: 100, minQuestions: 5 }
  }
];

export const performanceHistory: PerformanceData[] = [
  { date: "2023-10-01", subject: Subject.Biology, score: 60 },
  { date: "2023-10-01", subject: Subject.Chemistry, score: 75 },
  { date: "2023-10-01", subject: Subject.Physics, score: 50 },
  { date: "2023-10-08", subject: Subject.Biology, score: 70 },
  { date: "2023-10-08", subject: Subject.Chemistry, score: 70 },
  { date: "2023-10-08", subject: Subject.Physics, score: 65 },
  { date: "2023-10-15", subject: Subject.Biology, score: 85 },
  { date: "2023-10-15", subject: Subject.Chemistry, score: 65 },
  { date: "2023-10-15", subject: Subject.Physics, score: 75 },
];

export const quizzes: Quiz[] = [
  {
    id: 'cell_theory_q1',
    question: 'quiz.cell_theory_q1.q',
    options: ['quiz.cell_theory_q1.opt1', 'quiz.cell_theory_q1.opt2', 'quiz.cell_theory_q1.opt3', 'quiz.cell_theory_q1.opt4'],
    correctAnswer: 'quiz.cell_theory_q1.opt2'
  },
  {
    id: 'newton_law_q1',
    question: 'quiz.newton_law_q1.q',
    options: ['quiz.newton_law_q1.opt1', 'quiz.newton_law_q1.opt2', 'quiz.newton_law_q1.opt3', 'quiz.newton_law_q1.opt4'],
    correctAnswer: 'quiz.newton_law_q1.opt1'
  },
  {
    id: 'atom_particle_q1',
    question: 'quiz.atom_particle_q1.q',
    options: ['quiz.atom_particle_q1.opt1', 'quiz.atom_particle_q1.opt2', 'quiz.atom_particle_q1.opt3', 'quiz.atom_particle_q1.opt4'],
    correctAnswer: 'quiz.atom_particle_q1.opt3'
  },
];