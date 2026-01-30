import type { ReactNode } from 'react'

interface SectionHeaderProps {
  title: string
  description: ReactNode
}

export function SectionHeader({ title, description }: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 mb-12">
      <h2>{title}</h2>
      <p className="lead">{description}</p>
    </div>
  )
}
