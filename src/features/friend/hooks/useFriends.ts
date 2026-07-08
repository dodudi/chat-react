import { useEffect, useState } from 'react'
import type { Friendship } from '../types'
import { fetchFriends } from '../api/friendApi'

export function useFriends() {
  const [friends, setFriends] = useState<Friendship[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)

    fetchFriends()
      .then((data) => {
        if (!isCancelled) setFriends(data)
      })
      .catch(() => {
        if (!isCancelled) setFriends([])
      })
      .finally(() => {
        if (!isCancelled) setIsLoading(false)
      })

    return () => {
      isCancelled = true
    }
  }, [])

  return { friends, isLoading }
}
