/**
 * Runs before every build. Looks in public/audio/lk/ for recordings named as in
 * the recording list, and writes data/audio-manifest.json mapping each Tamil
 * text to its file. AudioButton plays the file when one exists, otherwise it
 * falls back to the phone's Tamil voice.
 */
import { existsSync, readdirSync, writeFileSync } from 'node:fs'
import { join, parse } from 'node:path'
import { buildRows } from './recording-list'

const dir = join(__dirname, '..', 'public', 'audio', 'lk')
const available = new Map<string, string>()
if (existsSync(dir)) {
  for (const f of readdirSync(dir)) {
    const { name, ext } = parse(f)
    if (['.mp3', '.m4a', '.wav', '.ogg'].includes(ext.toLowerCase())) available.set(name, f)
  }
}

const manifest: Record<string, string> = {}
const missing: string[] = []
for (const row of buildRows()) {
  const file = available.get(row.file)
  if (file) manifest[row.tamil] = `/audio/lk/${file}`
  else missing.push(row.file)
}

writeFileSync(join(__dirname, '..', 'data', 'audio-manifest.json'), JSON.stringify(manifest, null, 2) + '\n')
console.log(`Audio: ${Object.keys(manifest).length} recorded, ${missing.length} still using the phone voice`)
