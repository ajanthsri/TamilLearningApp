'use client'
import { getStore } from './store'

/**
 * Small drum sounds synthesised in the browser, so there are no audio files
 * and nothing to license. Loosely a thavil "ta-ka" hit.
 */
let ctx: AudioContext | null = null

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!getStore<boolean>('tamil-sfx', true)) return null
  try {
    ctx ??= new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function hit(c: AudioContext, at: number, freq: number, level: number, decay: number) {
  // Body of the drum: a pitched sine that drops quickly
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(freq, at)
  osc.frequency.exponentialRampToValueAtTime(freq * 0.45, at + decay)
  gain.gain.setValueAtTime(level, at)
  gain.gain.exponentialRampToValueAtTime(0.001, at + decay)
  osc.connect(gain).connect(c.destination)
  osc.start(at)
  osc.stop(at + decay + 0.02)

  // The slap of the hand on the skin: a short burst of filtered noise
  const len = Math.floor(c.sampleRate * 0.03)
  const buf = c.createBuffer(1, len, c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len)
  const noise = c.createBufferSource()
  noise.buffer = buf
  const band = c.createBiquadFilter()
  band.type = 'bandpass'
  band.frequency.value = 1800
  const ng = c.createGain()
  ng.gain.value = level * 0.35
  noise.connect(band).connect(ng).connect(c.destination)
  noise.start(at)
}

/** Correct answer: ta-DHUM */
export function playCorrect() {
  const c = audio()
  if (!c) return
  const t = c.currentTime + 0.01
  hit(c, t, 320, 0.35, 0.12)
  hit(c, t + 0.1, 130, 0.8, 0.35)
}

/** Pack complete: ta-ka-ta-ka-DHUM */
export function playFanfare() {
  const c = audio()
  if (!c) return
  const t = c.currentTime + 0.01
  ;[0, 0.11, 0.22, 0.33].forEach((d, i) => hit(c, t + d, i % 2 ? 280 : 340, 0.3, 0.1))
  hit(c, t + 0.48, 110, 0.9, 0.6)
}
