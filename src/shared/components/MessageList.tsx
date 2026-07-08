import { MessageBubble, type BubbleMessage } from './MessageBubble'

type MessageListProps = {
  messages: BubbleMessage[]
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
