import type { ReactNode } from 'react'

interface SectionHeaderProps {
  eyebrow?: ReactNode
  title: ReactNode
  description: ReactNode
}

export function SectionHeader({
  eyebrow,
  title,
  description,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3 mb-12">
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground">
          {eyebrow}
        </p>
      )}
      <h2>{title}</h2>
      <p className="lead">{description}</p>
    </div>
  )
}
