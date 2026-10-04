import { Word } from '@/types'

export const words: Word[] = [
  // Family
  { id: 1, tamil: 'அம்மா', roman: 'amma', english: 'Mother', category: 'family' },
  { id: 2, tamil: 'அப்பா', roman: 'appa', english: 'Father', category: 'family' },
  { id: 3, tamil: 'அண்ணன்', roman: 'annan', english: 'Elder brother', category: 'family', notes: 'You call him அண்ணா (anna) when you speak to him.' },
  { id: 4, tamil: 'அக்கா', roman: 'akka', english: 'Elder sister', category: 'family' },
  { id: 5, tamil: 'தம்பி', roman: 'thambi', english: 'Younger brother', category: 'family' },
  { id: 6, tamil: 'தங்கை', roman: 'thangai', english: 'Younger sister', category: 'family' },
  { id: 31, tamil: 'அம்மம்மா', roman: 'ammamma', english: 'Grandmother (mum\'s mum)', category: 'family', notes: 'Dad\'s mum is அப்பம்மா (appamma).' },
  // Greetings
  { id: 7, tamil: 'வணக்கம்', roman: 'vanakkam', english: 'Hello / Greetings', category: 'greetings' },
  { id: 8, tamil: 'நன்றி', roman: 'nandri', english: 'Thank you', category: 'greetings' },
  { id: 9, tamil: 'ஓம்', roman: 'om', english: 'Yes', category: 'greetings', notes: 'Sri Lankan Tamil. In Tamil Nadu you will hear ஆமா (aamaa).' },
  { id: 10, tamil: 'இல்லை', roman: 'illai', english: 'No', category: 'greetings' },
  { id: 11, tamil: 'மன்னிக்கவும்', roman: 'mannikkavum', english: 'Sorry / Excuse me', category: 'greetings' },
  // Food
  { id: 12, tamil: 'சோறு', roman: 'sooru', english: 'Rice / Food', category: 'food' },
  { id: 13, tamil: 'தண்ணீர்', roman: 'thanneer', english: 'Water', category: 'food' },
  { id: 14, tamil: 'இடியப்பம்', roman: 'idiyappam', english: 'String hoppers', category: 'food', notes: 'Steamed rice noodle nests. A Sri Lankan breakfast staple, often eaten with sothi.' },
  { id: 15, tamil: 'தோசை', roman: 'thosai', english: 'Dosa', category: 'food', notes: 'Thin rice and lentil pancake, eaten any time of day.' },
  { id: 16, tamil: 'பால்', roman: 'paal', english: 'Milk', category: 'food' },
  { id: 17, tamil: 'கோப்பி', roman: 'koppi', english: 'Coffee', category: 'food', notes: 'Sri Lankan Tamil. In Tamil Nadu it is காபி (kaapi).' },
  // Emotions
  { id: 18, tamil: 'அன்பு', roman: 'anbu', english: 'Love', category: 'emotions' },
  { id: 19, tamil: 'மகிழ்ச்சி', roman: 'magizhchi', english: 'Joy / Happiness', category: 'emotions' },
  { id: 20, tamil: 'கோபம்', roman: 'kopam', english: 'Anger', category: 'emotions' },
  { id: 21, tamil: 'பயம்', roman: 'payam', english: 'Fear', category: 'emotions' },
  { id: 22, tamil: 'வலி', roman: 'vali', english: 'Pain', category: 'emotions' },
  // Nature
  { id: 23, tamil: 'கடல்', roman: 'kadal', english: 'Sea', category: 'nature' },
  { id: 24, tamil: 'மலை', roman: 'malai', english: 'Mountain', category: 'nature' },
  { id: 25, tamil: 'மரம்', roman: 'maram', english: 'Tree', category: 'nature' },
  { id: 26, tamil: 'வானம்', roman: 'vaanam', english: 'Sky', category: 'nature' },
  { id: 27, tamil: 'மழை', roman: 'mazhai', english: 'Rain', category: 'nature' },
  // Time
  { id: 28, tamil: 'இன்று', roman: 'indru', english: 'Today', category: 'time', notes: 'In everyday speech: இண்டைக்கு (indaikku).' },
  { id: 29, tamil: 'நாளை', roman: 'naalai', english: 'Tomorrow', category: 'time' },
  { id: 30, tamil: 'நேற்று', roman: 'netru', english: 'Yesterday', category: 'time' },
]
