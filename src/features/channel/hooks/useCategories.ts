import { useEffect, useState } from 'react'
import type { Category } from '../types'
import { fetchCategories } from '../api/channelApi'

export function useCategories(serverId: number) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (serverId <= 0) {
      setCategories([])
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)

    fetchCategories(serverId)
      .then((data) => {
        if (!isCancelled) setCategories(data)
      })
      .catch(() => {
        if (!isCancelled) setCategories([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [serverId, reloadKey])

  function refresh() {
    setReloadKey((key) => key + 1)
  }

  return { categories, isLoading, refresh }
}
