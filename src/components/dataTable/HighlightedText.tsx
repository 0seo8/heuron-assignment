import { useMemo } from 'react'

import { HighlightedTextProps } from '@/types'
import { dateSearchToRegexPattern } from '@/utils/dateUtils'
import { escapeRegExp } from '@/utils/escapeRegExp'

const HighlightedText = ({
  text,
  highlight,
  isDate = false,
}: HighlightedTextProps) => {
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
      if (
        isDate ||
        (safeText.match(/^\d{4}[.\s-]\d{1,2}[.\s-]\d{1,2}/) &&
          highlight.match(/^\d{4}[.\s-]?\d{0,2}[.\s-]?\d{0,2}/))
      ) {
        const pattern = dateSearchToRegexPattern(highlight.trim())
        const regex = new RegExp(`(${pattern})`, 'i')
        const parts = []

        const match = safeText.match(regex)

        if (match && match.index !== undefined) {
          if (match.index > 0) {
            parts.push({
              text: safeText.substring(0, match.index),
              isHighlight: false,
            })
          }

          parts.push({
            text: match[0],
            isHighlight: true,
          })

          const afterMatchIndex = match.index + match[0].length
          if (afterMatchIndex < safeText.length) {
            parts.push({
              text: safeText.substring(afterMatchIndex),
              isHighlight: false,
            })
          }
        } else {
          parts.push({
            text: safeText,
            isHighlight: false,
          })
        }

        return (
          <>
            {parts.map((part, i) =>
              part.isHighlight ? (
                <mark
                  key={i}
                  className="bg-green-200 px-0.5 rounded text-xs sm:text-sm md:text-base inline-block leading-tight"
                >
                  {part.text}
                </mark>
              ) : (
                <span
                  key={i}
                  className="text-xs sm:text-sm md:text-base leading-tight"
                >
                  {part.text}
                </span>
              ),
            )}
          </>
        )
      }

      // 일반 텍스트 하이라이트 처리 (기존 로직)
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
  }, [safeText, highlight, isDate])

  return <span className="inline">{highlightedContent}</span>
}

export default HighlightedText
