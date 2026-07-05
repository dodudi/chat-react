import { useState, type FormEvent } from 'react'
import type { Server } from '../types'
import { updateServer } from '../api/serverApi'
import { SettingsIcon } from '../../../shared/components/icons/SettingsIcon'
import { Modal } from '../../../shared/components/Modal'

type ServerSettingsModalProps = {
  server: Server
  onServerUpdated: (server: Server) => void
}

export function ServerSettingsModal({ server, onServerUpdated }: ServerSettingsModalProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label="서버 설정"
        onClick={() => setIsOpen(true)}
        className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        <SettingsIcon className="h-4.5 w-4.5" />
      </button>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="서버 설정">
        <ServerSettingsForm
          server={server}
          onServerUpdated={(updated) => {
            onServerUpdated(updated)
            setIsOpen(false)
          }}
        />
      </Modal>
    </>
  )
}

type ServerSettingsFormProps = {
  server: Server
  onServerUpdated: (server: Server) => void
}

function ServerSettingsForm({ server, onServerUpdated }: ServerSettingsFormProps) {
  const [name, setName] = useState(server.name)
  const [description, setDescription] = useState(server.description ?? '')
  const [isPublic, setIsPublic] = useState(server.isPublic)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return

    setIsSubmitting(true)
    setError(null)

    try {
      const updated = await updateServer(server.id, {
        name: trimmed,
        description: description.trim() || undefined,
        isPublic,
      })
      onServerUpdated(updated)
    } catch {
      setError('서버 설정을 저장하지 못했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        서버 이름
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-500"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium text-slate-500 dark:text-slate-400">
        설명
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
          className="resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-teal-400 focus:bg-white dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-teal-500"
        />
      </label>

      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(event) => setIsPublic(event.target.checked)}
          className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500 dark:border-slate-600"
        />
        공개 서버로 설정
      </label>

      <button
        type="submit"
        disabled={name.trim().length === 0 || isSubmitting}
        className="w-full rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:bg-slate-300 dark:disabled:bg-slate-700"
      >
        저장
      </button>

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </form>
  )
}
