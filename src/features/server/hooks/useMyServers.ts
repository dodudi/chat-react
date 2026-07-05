import { useEffect, useState } from 'react'
import type { Server } from '../types'
import { fetchMyServers } from '../api/serverApi'

export function useMyServers() {
  const [servers, setServers] = useState<Server[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)

    fetchMyServers()
      .then((data) => {
        if (!isCancelled) setServers(data)
      })
      .catch(() => {
        if (!isCancelled) setServers([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [reloadKey])

  function refresh() {
    setReloadKey((key) => key + 1)
  }

  return { servers, isLoading, refresh }
}
