'use client'

import React from 'react'

export const ContentSectionLabel: React.FC = () => {
  return (
    <div
      style={{
        padding: '16px 0',
        marginTop: '8px',
        borderTop: '1px solid var(--theme-elevation-100)',
      }}
    >
      <h3
        style={{
          margin: 0,
          fontSize: '16px',
          fontWeight: 600,
          color: 'var(--theme-text)',
        }}
      >
        Corpo do Artigo
      </h3>
      <p
        style={{
          margin: '4px 0 0',
          fontSize: '13px',
          color: 'var(--theme-elevation-500)',
        }}
      >
        Escreva o conteúdo principal da publicação utilizando o editor abaixo
      </p>
    </div>
  )
}

export default ContentSectionLabel
