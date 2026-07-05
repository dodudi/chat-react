import { useEffect, useState } from 'react'
import type { Channel } from '../types'
import { fetchChannels } from '../api/channelApi'

export function useChannels(serverId: number) {
  const [channels, setChannels] = useState<Channel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (serverId <= 0) {
      setChannels([])
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)

    fetchChannels(serverId)
      .then((data) => {
        if (!isCancelled) setChannels(data)
      })
      .catch(() => {
        if (!isCancelled) setChannels([])
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

  return { channels, isLoading, refresh }
}
