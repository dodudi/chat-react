type HashIconProps = {
  className?: string
}

export function HashIcon({ className }: HashIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className}>
      <line x1="9" y1="3" x2="7" y2="21" />
      <line x1="17" y1="3" x2="15" y2="21" />
      <line x1="4" y1="9" x2="20" y2="9" />
      <line x1="3" y1="15" x2="19" y2="15" />
    </svg>
  )
}
