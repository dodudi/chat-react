import type { Message } from '../types'
import { MessageBubble } from './MessageBubble'

type MessageListProps = {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      {messages.map((message, index) => {
        const previous = messages[index - 1]
        const showHeader = !previous || previous.author.id !== message.author.id

        return <MessageBubble key={message.id} message={message} showHeader={showHeader} />
      })}
    </div>
  )
}
