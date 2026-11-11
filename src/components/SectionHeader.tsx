import type { ReactNode } from 'react'

type SectionHeaderProps = {
  title: string
  actions?: ReactNode
}

export function SectionHeader({ title, actions }: SectionHeaderProps) {
  return (
    <div
      className="wu-flex wu-items-center wu-justify-between wu-px-4 wu-py-4 wu-bg-white"
      style={{ borderBottom: '1px solid #eef3fb' }}
    >
      <h1
        className="wu-text-lg wu-font-medium wu-text-gray-lead"
        style={{ fontSize: 18, lineHeight: '32px' }}
      >
        {title}
      </h1>
      {actions && (
        <div className="wu-flex wu-items-center wu-gap-4">{actions}</div>
      )}
    </div>
  )
}
