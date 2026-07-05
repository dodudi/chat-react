import { useEffect, useState } from 'react'
import type { ServerMember } from '../types'
import { fetchServerMembers } from '../api/serverApi'

export function useServerMembers(serverId: number) {
  const [members, setMembers] = useState<ServerMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (serverId <= 0) {
      setMembers([])
      setIsLoading(false)
      return
    }

    let isCancelled = false
    setIsLoading(true)

    fetchServerMembers(serverId)
      .then((data) => {
        if (!isCancelled) setMembers(data)
      })
      .catch(() => {
        if (!isCancelled) setMembers([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [serverId])

  return { members, isLoading }
}
