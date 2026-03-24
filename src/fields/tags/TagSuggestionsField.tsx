'use client'

import { useField, useFormFields, FieldLabel } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'
import { useState, useCallback } from 'react'

type TagSuggestionsFieldProps = TextFieldClientProps

const TagSuggestionsField: React.FC<TagSuggestionsFieldProps> = ({ field, path }) => {
  const { value, setValue } = useField<string[]>({ path: path || field.name })
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Watch title and content fields for generating suggestions
  const title = useFormFields(([fields]) => fields.title?.value as string)
  const subtitle = useFormFields(([fields]) => fields.subtitle?.value as string)
  const headline = useFormFields(([fields]) => fields.headline?.value as string)

  const tags = Array.isArray(value) ? value : []

  const generateSuggestions = useCallback(async () => {
    if (!title) {
      alert('Adicione um título primeiro para gerar sugestões de tags.')
      return
    }

    setIsLoading(true)
    setShowSuggestions(true)

    try {
      const response = await fetch('/admin/api/suggest-tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          subtitle,
          headline,
          existingTags: tags,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error('Error generating suggestions:', error)
      // Fallback to basic suggestions based on title
      const fallbackSuggestions = generateBasicSuggestions(title, subtitle, headline)
      setSuggestions(fallbackSuggestions)
    } finally {
      setIsLoading(false)
    }
  }, [title, subtitle, headline, tags])

  const generateBasicSuggestions = (
    title: string,
    subtitle?: string,
    headline?: string,
  ): string[] => {
    const text = `${title} ${subtitle || ''} ${headline || ''}`.toLowerCase()

    // Common TV/Radio related keywords
    const mediaKeywords = [
      'televisão',
      'tv',
      'rádio',
      'mídia',
      'audiência',
      'ibope',
      'globo',
      'record',
      'sbt',
      'band',
      'redetv',
      'cnn brasil',
      'jovem pan',
      'bbc',
      'entretenimento',
      'jornalismo',
      'novela',
      'telejornal',
      'programa',
      'apresentador',
      'âncora',
      'streaming',
      'digital',
      'broadcast',
      'emissora',
      'canal',
      'programação',
      'matéria',
      'reportagem',
      'notícia',
      'comunicação',
    ]

    const suggestions: string[] = []

    // Extract potential keywords from title
    const words = text
      .split(/\s+/)
      .filter((word) => word.length > 3)
      .filter((word) => !['para', 'como', 'com', 'que', 'uma', 'seu', 'sua', 'por', 'mais', 'sobre'].includes(word))

    // Add relevant media keywords that appear in the text
    mediaKeywords.forEach((keyword) => {
      if (text.includes(keyword) && !suggestions.includes(keyword)) {
        suggestions.push(keyword)
      }
    })

    // Add some title words as tags
    words.slice(0, 5).forEach((word) => {
      const cleanWord = word.replace(/[^\w\sáéíóúâêîôûãõç]/gi, '').trim()
      if (cleanWord.length > 3 && !suggestions.includes(cleanWord)) {
        suggestions.push(cleanWord)
      }
    })

    // Add common generic tags based on context
    if (text.includes('audiência') || text.includes('ibope')) {
      suggestions.push('audiência de tv')
    }
    if (text.includes('contrat') || text.includes('demiss')) {
      suggestions.push('mercado de trabalho')
    }
    if (text.includes('estreia') || text.includes('lança')) {
      suggestions.push('estreias')
    }

    return suggestions.slice(0, 10).filter((s) => !tags.includes(s))
  }

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setValue([...tags, trimmedTag])
    }
    setInputValue('')
  }

  const removeTag = (tagToRemove: string) => {
    setValue(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (inputValue.trim()) {
        addTag(inputValue)
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1])
    }
  }

  const addSuggestion = (suggestion: string) => {
    addTag(suggestion)
    setSuggestions(suggestions.filter((s) => s !== suggestion))
  }

  return (
    <div className="field-type text">
      <FieldLabel htmlFor={`field-${path}`} label={field.label} />
      <p style={{ marginTop: '4px', marginBottom: '12px', fontSize: '12px', color: '#666' }}>
        Tags para SEO. Essas keywords serao usadas nos dados estruturados do Google.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Tags display */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
            padding: '8px',
            border: '1px solid var(--theme-elevation-150)',
            borderRadius: '4px',
            minHeight: '42px',
            backgroundColor: 'var(--theme-elevation-0)',
          }}
        >
          {tags.map((tag, index) => (
            <span
              key={index}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '4px 8px',
                backgroundColor: 'var(--theme-elevation-100)',
                borderRadius: '4px',
                fontSize: '13px',
              }}
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0 2px',
                  fontSize: '14px',
                  lineHeight: 1,
                  color: 'var(--theme-elevation-500)',
                }}
              >
                x
              </button>
            </span>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={tags.length === 0 ? 'Digite uma tag e pressione Enter...' : ''}
            style={{
              flex: 1,
              minWidth: '120px',
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontSize: '14px',
            }}
          />
        </div>

        {/* Generate suggestions button */}
        <button
          type="button"
          onClick={generateSuggestions}
          disabled={isLoading}
          style={{
            padding: '8px 16px',
            backgroundColor: 'var(--theme-elevation-100)',
            border: '1px solid var(--theme-elevation-200)',
            borderRadius: '4px',
            cursor: isLoading ? 'wait' : 'pointer',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            width: 'fit-content',
          }}
        >
          {isLoading ? (
            <>
              <span className="spinner" style={{ width: '14px', height: '14px' }} />
              Gerando sugestoes...
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L12 6M12 18L12 22M2 12L6 12M18 12L22 12M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" />
              </svg>
              Sugerir Tags
            </>
          )}
        </button>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            style={{
              padding: '12px',
              backgroundColor: 'var(--theme-elevation-50)',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-150)',
            }}
          >
            <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--theme-elevation-500)' }}>
              Sugestoes (clique para adicionar):
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => addSuggestion(suggestion)}
                  style={{
                    padding: '4px 10px',
                    backgroundColor: 'var(--theme-success-100)',
                    border: '1px solid var(--theme-success-200)',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-success-200)'
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--theme-success-100)'
                  }}
                >
                  + {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { TagSuggestionsField }
