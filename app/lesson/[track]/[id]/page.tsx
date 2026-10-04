import { notFound } from 'next/navigation'
import { lessons, getLesson } from '@/data/lessons'
import { LessonFlow } from '@/components/lesson/LessonFlow'

export function generateStaticParams() {
  return lessons.map(l => ({ track: l.track, id: l.id }))
}

export default function LessonPage({ params }: { params: { track: string; id: string } }) {
  const lesson = getLesson(params.track, params.id)
  if (!lesson) notFound()
  // key resets the flow when going straight to the next lesson
  return <LessonFlow key={`${lesson.track}-${lesson.id}`} lesson={lesson} />
}
