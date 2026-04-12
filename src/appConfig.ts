interface ConfigProps {
  appName: string
  url: string
  appDescription: string
  supportEmail?: string
  features: {
    blog: {
      enabled: boolean
      title: string
      description: string
    }
  }
}

export default {
  appName: 'DentaFlow',
  url: 'dentaflow.app',
  appDescription:
    'AI-Powered Dental Practice Management. Streamline patient follow-ups, treatment explanations, and clinic content with AI.',
  supportEmail: 'support@dentaflow.app',
  features: {
    blog: {
      enabled: true,
      title: 'DentaFlow Blog',
      description:
        'AI-generated dental insights, treatment guides, and practice tips for your clinic.',
    },
  },
} as ConfigProps
