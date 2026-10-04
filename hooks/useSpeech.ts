'use client'
import { useCallback, useEffect, useRef, useState } from 'react'

function findTamilVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices()
  return (
    voices.find(v => v.lang === 'ta-IN') ??
    voices.find(v => v.lang.toLowerCase().startsWith('ta')) ??
    null
  )
}

export function useSpeech() {
  const [isAvailable, setIsAvailable] = useState(false)
  const [hasTamilVoice, setHasTamilVoice] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const voice = useRef<SpeechSynthesisVoice | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return
    setIsAvailable(true)
    // Voices load asynchronously in Chrome; Safari has them immediately
    const load = () => {
      voice.current = findTamilVoice()
      setHasTamilVoice(voice.current !== null)
    }
    load()
    window.speechSynthesis.addEventListener('voiceschanged', load)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load)
  }, [])

  const speak = useCallback(
    (text: string) => {
      if (!isAvailable) return
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'ta-IN'
      if (voice.current) utterance.voice = voice.current
      utterance.rate = 0.85
      utterance.pitch = 1
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      window.speechSynthesis.speak(utterance)
    },
    [isAvailable],
  )

  const stop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }, [])

  return { speak, stop, isSpeaking, isAvailable, hasTamilVoice }
}
