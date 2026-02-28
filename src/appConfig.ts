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
  appName: 'BetterStarter',
  url: 'betterstarter.dev',
  appDescription:
    'Better Starter - Start Your Business Right. Launch fast, scale quickly, and be ready for the future.',
  supportEmail: 'support@betterstarter.dev',
  features: {
    blog: {
      enabled: true,
      title: 'BetterStarter Blog',
      description:
        'Articles about BetterStarter, and launching your SaaS quickly and correctly.',
    },
  },
} as ConfigProps
