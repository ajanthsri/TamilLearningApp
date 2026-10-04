import { PlacementSeed } from '@/types'

// Fixed onboarding checks. Same questions for everyone at a stage so tester
// results can be compared. IDs refer to words.ts and letters.ts.
// Confirm with native reviewer before testing.
export const PLACEMENT_SETS: Record<'intermediate' | 'advanced', PlacementSeed[]> = {
  // Do you recognise everyday spoken Tamil? Romanisation shown, audio plays.
  intermediate: [
    { type: 'word', id: 13 },   // தண்ணீர் — water
    { type: 'word', id: 4 },    // அக்கா — elder sister
    { type: 'word', id: 18 },   // அன்பு — love
    { type: 'word', id: 29 },   // நாளை — tomorrow
    { type: 'letter', id: 1 },  // அ — a
  ],
  // Can you read the script? Romanisation hidden, no auto audio.
  advanced: [
    { type: 'word', id: 26, hideRoman: true },   // வானம் — sky
    { type: 'letter', id: 9, hideRoman: true },  // ஐ — ai
    { type: 'word', id: 19, hideRoman: true },   // மகிழ்ச்சி — joy
    { type: 'letter', id: 15, hideRoman: true }, // த — tha
    { type: 'word', id: 30, hideRoman: true },   // நேற்று — yesterday
  ],
}

/** What the result screen suggests. null = confirm their own choice. */
export function placementSuggestion(
  chosen: 'intermediate' | 'advanced',
  score: number,
): 'newbie' | 'intermediate' | 'advanced' | null {
  if (chosen === 'intermediate') {
    if (score <= 1) return 'newbie'
    if (score === 5) return 'advanced'
    return null
  }
  if (score <= 1) return 'newbie'
  if (score === 2) return 'intermediate'
  return null
}
