import { Navigate } from 'react-router-dom'
import { useAuth } from '../../../app/providers/AuthProvider'

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()

  if (isAuthenticated) return <Navigate to="/" replace />

  return (
    <div className="flex h-screen w-full items-center justify-center bg-white px-4 dark:bg-slate-900">
      <div className="w-full max-w-sm rounded-2xl border border-slate-200 p-8 text-center shadow-sm dark:border-slate-700">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-teal-600 text-lg font-semibold text-white">
          CR
        </div>
        <h1 className="text-xl font-semibold text-slate-800 dark:text-slate-100">chat-react에 로그인</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">계속하려면 계정으로 로그인하세요.</p>
        <button
          type="button"
          onClick={login}
          className="mt-6 w-full rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
        >
          로그인
        </button>
      </div>
    </div>
  )
}
