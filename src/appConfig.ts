export interface ConfigProps {
  appName: string
  url: string
  appDescription: string
  supportEmail?: string
  features: {
    imageOptimization: {
      enabled: boolean
    }
  }
}

const config: ConfigProps = {
  appName: 'Better-Starter',
  url: 'better-starter.com',
  appDescription:
    'Better Starter - Start Your Business Right. Launch fast, scale quickly, and be ready for the future.',
  supportEmail: 'support@better-starter.com',
  features: {
    imageOptimization: {
      enabled: true, // Set to false to disable Netlify Image CDN
    },
  },
}

export default config
