import { Level } from '@/types'

export const levels: Level[] = [
  { level: 1, tamil: 'குழந்தை',   roman: 'Kuzhandhai', english: 'Child — just beginning',         xpRequired: 0    },
  { level: 2, tamil: 'மாணவர்',   roman: 'Maanavar',   english: 'Student — starting to learn',    xpRequired: 200  },
  { level: 3, tamil: 'புரிந்தவர்', roman: 'Purindavar', english: 'One who understands',            xpRequired: 500  },
  { level: 4, tamil: 'பேசுவார்',  roman: 'Pesuvar',    english: 'One who speaks',                 xpRequired: 1000 },
  { level: 5, tamil: 'கற்றவர்',   roman: 'Katravar',   english: 'One who has truly learned',      xpRequired: 2000 },
]

export function getLevelFromXP(xp: number): Level {
  let current = levels[0]
  for (const level of levels) {
    if (xp >= level.xpRequired) current = level
    else break
  }
  return current
}

export function getNextLevel(xp: number): Level | null {
  const current = getLevelFromXP(xp)
  const next = levels.find(l => l.level === current.level + 1)
  return next ?? null
}

export function getProgressToNextLevel(xp: number): { current: number; required: number; percent: number } {
  const currentLevel = getLevelFromXP(xp)
  const nextLevel = getNextLevel(xp)

  if (!nextLevel) return { current: 0, required: 0, percent: 100 }

  const xpInLevel = xp - currentLevel.xpRequired
  const xpNeeded = nextLevel.xpRequired - currentLevel.xpRequired
  return {
    current: xpInLevel,
    required: xpNeeded,
    percent: Math.min(100, Math.round((xpInLevel / xpNeeded) * 100)),
  }
}
