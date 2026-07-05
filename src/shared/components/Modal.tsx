import type { ReactNode } from 'react'
import { XIcon } from './icons/XIcon'

type ModalProps = {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/50"
      />
      <div className="relative w-full max-w-sm rounded-xl bg-white p-5 shadow-xl dark:bg-slate-800">
        <div className="mb-4 flex items-center justify-between">
          {title && <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h2>}
          <button
            type="button"
            aria-label="닫기"
            onClick={onClose}
            className="ml-auto rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <XIcon className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
