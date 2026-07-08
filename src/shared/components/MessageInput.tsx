import { useState, type FormEvent } from 'react'
import { SendIcon } from './icons/SendIcon'

type MessageInputProps = {
  placeholder: string
  onSubmit: (text: string) => void
}

export function MessageInput({ placeholder, onSubmit }: MessageInputProps) {
  const [text, setText] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    onSubmit(trimmed)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="px-4 pb-6">
      <div className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 focus-within:border-teal-400 focus-within:bg-white dark:border-slate-700 dark:bg-slate-800 dark:focus-within:border-teal-500 dark:focus-within:bg-slate-800">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none dark:text-slate-100 dark:placeholder-slate-500"
        />
        <button
          type="submit"
          aria-label="전송"
          disabled={text.trim().length === 0}
          className="text-teal-600 hover:text-teal-700 disabled:text-slate-300 dark:text-teal-400 dark:hover:text-teal-300 dark:disabled:text-slate-600"
        >
          <SendIcon className="h-5 w-5" />
        </button>
      </div>
    </form>
  )
}
