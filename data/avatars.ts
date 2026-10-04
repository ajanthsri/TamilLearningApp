export type HairStyle = 'short' | 'bun' | 'braid' | 'curly' | 'long' | 'ponytail'

export type Character = {
  id: string
  name: string
  meaning: string
  hair: HairStyle
  skin: string
  outfit: string
  backdrop: string
}

// Six poster-style characters. Users pick one; it ages with their XP level.
export const characters: Character[] = [
  { id: 'nila', name: 'Nila', meaning: 'moon', hair: 'bun', skin: '#8D5A3B', outfit: '#C1272D', backdrop: '#2D1F3C' },
  { id: 'kavi', name: 'Kavi', meaning: 'poet', hair: 'short', skin: '#6B4226', outfit: '#2F6F8F', backdrop: '#1F2438' },
  { id: 'malar', name: 'Malar', meaning: 'flower', hair: 'braid', skin: '#A86B45', outfit: '#8B5CB8', backdrop: '#26203A' },
  { id: 'arivu', name: 'Arivu', meaning: 'wisdom', hair: 'curly', skin: '#7A4A2E', outfit: '#2D6A3F', backdrop: '#1F2E28' },
  { id: 'thendral', name: 'Thendral', meaning: 'breeze', hair: 'long', skin: '#9A6141', outfit: '#E88A4F', backdrop: '#3A2420' },
  { id: 'veera', name: 'Veera', meaning: 'brave', hair: 'ponytail', skin: '#5E3A22', outfit: '#B7791F', backdrop: '#2A2618' },
]

export function getCharacter(id: string | null | undefined): Character {
  return characters.find(c => c.id === id) ?? characters[0]
}
