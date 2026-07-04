import type { Message } from '../types'
import { Avatar } from '../../../shared/components/Avatar'
import { formatTime } from '../../../shared/utils/formatTime'

type MessageBubbleProps = {
  message: Message
  showHeader: boolean
}

export function MessageBubble({ message, showHeader }: MessageBubbleProps) {
  return (
    <div className="flex gap-3 px-4 py-0.5 hover:bg-slate-50 dark:hover:bg-slate-800/50">
      <div className="w-9 shrink-0 pt-0.5">
        {showHeader && <Avatar user={message.author} size="md" showStatus={false} />}
      </div>
      <div className="min-w-0 flex-1">
        {showHeader && (
          <div className="flex items-baseline gap-2">
            <span className="font-medium text-slate-800 dark:text-slate-100">{message.author.username}</span>
            <span className="text-xs text-slate-400 dark:text-slate-500">{formatTime(message.createdAt)}</span>
          </div>
        )}
        <p className="text-sm break-words text-slate-700 dark:text-slate-300">{message.content}</p>
      </div>
    </div>
  )
}
