import { useMemo } from 'react'

import { HighlightedTextProps } from '@/types'
import { escapeRegExp } from '@/utils/escapeRegExp'

const HighlightedText = ({ text, highlight }: HighlightedTextProps) => {
  const safeText = text ?? ''

  const highlightedContent = useMemo(() => {
    if (!highlight || !highlight.trim()) {
      return (
        <span className="text-xs sm:text-sm md:text-base leading-tight">
          {safeText}
        </span>
      )
    }

    try {
      const escapedHighlight = escapeRegExp(highlight.trim())

      const regex = new RegExp(`(${escapedHighlight})`, 'gi')

      const parts = safeText.split(regex)

      return (
        <>
          {parts.map((part, i) =>
            regex.test(part) ? (
              <mark
                key={i}
                className="bg-green-200 px-0.5 rounded text-xs sm:text-sm md:text-base inline-block leading-tight"
              >
                {part}
              </mark>
            ) : (
              <span
                key={i}
                className="text-xs sm:text-sm md:text-base leading-tight"
              >
                {part}
              </span>
            ),
          )}
        </>
      )
    } catch (error) {
      console.error('Regex error in HighlightedText:', error)
      return (
        <span className="text-xs sm:text-sm md:text-base leading-tight">
          {safeText}
        </span>
      )
    }
  }, [safeText, highlight])

  return <span className="inline">{highlightedContent}</span>
}

export default HighlightedText
