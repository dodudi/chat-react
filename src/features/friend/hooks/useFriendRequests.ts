import { useEffect, useState } from 'react'
import type { FriendRequest } from '../types'
import {
  acceptFriendRequest,
  cancelFriendRequest,
  fetchReceivedFriendRequests,
  fetchSentFriendRequests,
  rejectFriendRequest,
} from '../api/friendApi'

export function useFriendRequests() {
  const [received, setReceived] = useState<FriendRequest[]>([])
  const [sent, setSent] = useState<FriendRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let isCancelled = false
    setIsLoading(true)

    Promise.all([fetchReceivedFriendRequests(), fetchSentFriendRequests()])
      .then(([receivedData, sentData]) => {
        if (isCancelled) return
        setReceived(receivedData)
        setSent(sentData)
      })
      .catch(() => {
        if (!isCancelled) {
          setReceived([])
          setSent([])
        }
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

  async function accept(requestId: number) {
    await acceptFriendRequest(requestId)
    setReceived((previous) => previous.filter((request) => request.id !== requestId))
  }

  async function reject(requestId: number) {
    await rejectFriendRequest(requestId)
    setReceived((previous) => previous.filter((request) => request.id !== requestId))
  }

  async function cancel(requestId: number) {
    await cancelFriendRequest(requestId)
    setSent((previous) => previous.filter((request) => request.id !== requestId))
  }

  return { received, sent, isLoading, refresh, accept, reject, cancel }
}
