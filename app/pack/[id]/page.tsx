import { notFound } from 'next/navigation'
import { packs, getPack } from '@/data/packs'
import { PackFlow } from '@/components/pack/PackFlow'

export function generateStaticParams() {
  return packs.map(p => ({ id: p.id }))
}

export default function PackPage({ params }: { params: { id: string } }) {
  const pack = getPack(params.id)
  if (!pack) notFound()
  // key resets the flow when moving straight to the next pack
  return <PackFlow key={pack.id} pack={pack} />
}
