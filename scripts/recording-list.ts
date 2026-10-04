/**
 * Writes audio/recording-list-lk.csv: every Tamil line in the app, with the
 * filename to record it as. Run with: npm run audio:list
 *
 * Record each line, save it into public/audio/lk/ under the given filename
 * (.mp3, .m4a or .wav all work), then run the build. The build matches files
 * back to their Tamil text so every play button uses the recording.
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { words } from '../data/words'
import { phrases } from '../data/phrases'
import { dialogues } from '../data/dialogues'
import { letters } from '../data/letters'
import { packs } from '../data/packs'
import { levels } from '../data/levels'
import { stages } from '../data/stages'
import { PRAISE, ENCOURAGE, NICE, NUDGE, RESULT, UI } from '../data/copy'

export type Row = { file: string; group: string; tamil: string; roman: string; english: string }

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 28)
const pad = (n: number) => String(n).padStart(2, '0')

export function buildRows(): Row[] {
  const rows: Row[] = []
  const seen = new Set<string>()
  const add = (group: string, n: number, tamil: string, roman: string, english: string) => {
    if (seen.has(tamil)) return // record each Tamil text once
    seen.add(tamil)
    rows.push({ file: `${group}-${pad(n)}-${slug(roman || english)}`, group, tamil, roman, english })
  }

  words.forEach(w => add('word', w.id, w.tamil, w.roman, w.english))
  phrases.forEach(p => add('phrase', p.id, p.tamil, p.roman, p.english))
  dialogues.forEach(d => add('dialogue', d.id, d.tamil, d.roman, d.english))
  let dw = 0
  dialogues.forEach(d => d.breakdown?.forEach(w => add('dword', ++dw, w.tamil, w.roman, w.english)))
  letters.forEach(l => add('letter', l.id, l.tamil, l.roman, `Letter ${l.roman}`))
  letters.forEach(l => add('example', l.id, l.example.tamil, l.example.roman, l.example.english))
  packs.forEach(p => add('pack', p.number, p.tamil, p.roman, p.english))
  levels.forEach(l => add('level', l.level, l.tamil, l.roman, l.english))
  stages.forEach((s, i) => add('stage', i + 1, s.tamil, s.roman, s.english))
  let i = 0
  ;[...PRAISE, ...ENCOURAGE, ...NICE, ...NUDGE, ...Object.values(RESULT), ...Object.values(UI)].forEach(line =>
    add('ui', ++i, line.tamil, '', line.english.replace(/\{answer\}/g, '…')),
  )
  return rows
}

const csvCell = (v: string) => (/[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v)

if (process.argv[1]?.includes('recording-list')) {
  const rows = buildRows()
  const header = 'file,group,tamil,roman,english,recorded'
  const body = rows.map(r => [r.file, r.group, r.tamil, r.roman, r.english, ''].map(csvCell).join(','))
  const out = join(__dirname, '..', 'audio', 'recording-list-lk.csv')
  // BOM so Excel opens the Tamil text correctly
  writeFileSync(out, '﻿' + [header, ...body].join('\n') + '\n')
  console.log(`Wrote ${rows.length} lines to ${out}`)
}
