import { useRouter } from 'next/router'
import { useEffect, useCallback } from 'react'
import useKeypress from 'react-use-keypress'
import { useSwipeable } from 'react-swipeable'

interface GestureNavigationOptions {
  prev: () => void
  next: () => void
  prevUrl?: string
  nextUrl?: string
  allowPrefetch?: boolean
}

export function useGestureNavigation({
  prevUrl,
  nextUrl,
  next,
  prev,
  allowPrefetch,
}: GestureNavigationOptions) {
  const { prefetch } = useRouter()

  // Modify swipeable handlers to disable navigation
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      // Do nothing on swipe left to disable navigation
    },
    onSwipedRight: () => {
      // Do nothing on swipe right to disable navigation
    },
    trackMouse: true,
  })

  const navigate = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        next()
      } else if (event.key === 'ArrowLeft') {
        prev()
      }
    },
    [next, prev]
  )

  useKeypress(['ArrowRight', 'ArrowLeft'], navigate)

  // prefetch routes
  useEffect(() => {
    if (allowPrefetch) {
      if (prevUrl) {
        void prefetch(prevUrl)
      }
      if (nextUrl) {
        void prefetch(nextUrl)
      }
    }
  }, [allowPrefetch, prefetch, prevUrl, nextUrl])

  return handlers
}
