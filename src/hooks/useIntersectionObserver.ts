import { useEffect, useState, useRef, type MutableRefObject } from 'react'

interface IntersectionObserverOptions {
  root?: Element | null
  rootMargin?: string
  threshold?: number | number[]
}

/**
 * 요소가 뷰포트에 들어왔는지 감지하는 훅
 * @param options IntersectionObserver 옵션
 * @returns [ref, isIntersecting] - 관찰할 요소의 ref와 뷰포트에 들어왔는지 여부
 */
export function useIntersectionObserver<T extends Element>(
  options: IntersectionObserverOptions = {},
  callback?: (isIntersecting: boolean) => void,
): [MutableRefObject<T | null>, boolean] {
  const { root = null, rootMargin = '0px', threshold = 0 } = options

  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const currentRef = ref.current
    if (!currentRef) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting
        setIsIntersecting(isElementIntersecting)

        if (callback) {
          callback(isElementIntersecting)
        }
      },
      { root, rootMargin, threshold },
    )

    observer.observe(currentRef)

    return () => {
      observer.unobserve(currentRef)
    }
  }, [root, rootMargin, threshold, callback])

  return [ref, isIntersecting]
}
