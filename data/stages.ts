import { LearnerStage, StageInfo } from '@/types'

// Learner stages. Not the same thing as XP levels in levels.ts.
// Tamil labels to be confirmed by native reviewer.
export const stages: StageInfo[] = [
  {
    stage: 'newbie',
    tamil: 'தொடக்கம்',
    roman: 'Thodakkam',
    english: 'Newbie',
    description: "I'm starting from scratch, or close to it.",
    homeSubline: 'Start with sounds. The script will follow.',
    defaultLearnTab: 'words',
    startHereTitle: 'Everyday words',
    startHereCopy: 'Hear the words your family uses every day.',
  },
  {
    stage: 'intermediate',
    tamil: 'இடைநிலை',
    roman: 'Idainilai',
    english: 'Intermediate',
    description: "I understand and speak some, but I can't read the script.",
    homeSubline: "You already hear it. Let's teach your eyes.",
    defaultLearnTab: 'letters',
    startHereTitle: 'The letters',
    startHereCopy: 'Put shapes to the sounds you already know.',
  },
  {
    stage: 'advanced',
    tamil: 'மேம்பட்டவர்',
    roman: 'Membattavar',
    english: 'Advanced',
    description: 'I speak comfortably and can read a little.',
    homeSubline: 'Sharpen what you have. The dialogue is where it lives.',
    defaultLearnTab: 'dialogues',
    startHereTitle: 'Cinema dialogue',
    startHereCopy: 'Lines with swagger. Read them, then say them.',
  },
]

export function getStageInfo(stage: LearnerStage): StageInfo {
  return stages.find(s => s.stage === stage) ?? stages[0]
}
