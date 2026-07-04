const TIME_FORMATTER = new Intl.DateTimeFormat('ko-KR', { hour: 'numeric', minute: '2-digit' })

export function formatTime(isoString: string): string {
  return TIME_FORMATTER.format(new Date(isoString))
}
