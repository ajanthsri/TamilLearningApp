'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import manifest from '@/data/audio-manifest.json'

const RECORDINGS = manifest as Record<string, string>

/** A real recording exists for this exact Tamil text */
export function hasRecording(text: string) {
  return text in RECORDINGS
}

// Prefer a Sri Lankan Tamil voice, then any Tamil voice
function findTamilVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'ta-LK') ??
    voices.find(v => v.lang === 'ta-IN') ??
    voices.find(v => v.lang.toLowerCase().startsWith('ta')) ??
    null
  )
}

// Only one sound at a time across the whole app
let currentAudio: HTMLAudioElement | null = null
function stopAll() {
  if (currentAudio) {
    currentAudio.pause()
    currentAudio = null
  }
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
}

export function useSpeech() {
  const [ttsAvailable, setTtsAvailable] = useState(false)
  const [hasTamilVoice, setHasTamilVoice] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voice = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setTtsAvailable(true)
    const load = () => {
      voice.current = findTamilVoice()
      setHasTamilVoice(voice.current !== null)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speakTTS = useCallback(
    (text: string) => {
      if (!ttsAvailable) return
      const u = new SpeechSynthesisUtterance(text)
      u.lang = voice.current?.lang ?? 'ta-LK'
      if (voice.current) u.voice = voice.current
      u.rate = 0.85
      u.onstart = () => setIsSpeaking(true)
      u.onend = () => setIsSpeaking(false)
      u.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(u)
    },
    [ttsAvailable],
  )

  const speak = useCallback(
    (text: string) => {
      stopAll()
      const src = RECORDINGS[text]
      if (!src) return speakTTS(text)
      const audio = new Audio(src)
      currentAudio = audio
      setIsSpeaking(true)
      audio.onended = () => setIsSpeaking(false)
      audio.onerror = () => {
        setIsSpeaking(false)
        speakTTS(text) // file missing or unplayable: fall back to the phone voice
      }
      audio.play().catch(() => {
        setIsSpeaking(false)
        speakTTS(text)
      })
    },
    [speakTTS],
  )

  const stop = useCallback(() => {
    stopAll()
    setIsSpeaking(false)
  }, [])

  // A button works if there's a recording or a phone voice
  const isAvailable = ttsAvailable || Object.keys(RECORDINGS).length > 0

  return { speak, stop, isSpeaking, isAvailable, hasTamilVoice }
}
