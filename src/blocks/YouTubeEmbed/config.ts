import type { Block } from 'payload'

export const YouTubeEmbed: Block = {
  slug: 'youtubeEmbed',
  interfaceName: 'YouTubeEmbedBlock',
  labels: {
    singular: 'YouTube Embed',
    plural: 'YouTube Embeds',
  },
  fields: [
    {
      name: 'url',
      type: 'text',
      label: 'URL do YouTube',
      required: true,
      admin: {
        placeholder: 'https://www.youtube.com/watch?v=... ou https://youtu.be/...',
        description: 'Cole a URL do vídeo do YouTube. Formatos aceitos: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID',
      },
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Legenda',
      admin: {
        description: 'Legenda opcional para o vídeo',
      },
    },
  ],
}
