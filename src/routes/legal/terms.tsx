import config from '@/appConfig'
import { PageHeader } from '@/components/_common/PageHeader'
import { PageLayout } from '@/components/_common/PageLayout'
import { generatePageSEO } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/legal/terms')({
  head: () => ({
    meta: generatePageSEO({
      title: 'Terms of Service',
      description: 'Terms of Service for BetterStarter',
    }),
  }),
  component: TermsPage,
})

function TermsPage() {
  const lastUpdated = 'November 8, 2025'

  return (
    <PageLayout showHeader showFooter>
      <PageHeader
        title="Terms of Service"
        description={`Last updated: ${lastUpdated}`}
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p className="text-muted-foreground mb-4">
            By accessing and using {config.appName} ("{config.url}"), you accept
            and agree to be bound by the terms and provision of this agreement.
            If you do not agree to these Terms of Service, please do not use our
            service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Description of Service
          </h2>
          <p className="text-muted-foreground mb-4">
            {config.appName} is a platform that allows users to create and
            manage public profiles. Users can create profiles for themselves or
            for public figures they admire. The service includes user-generated
            content and profile management features.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">3. User Accounts</h2>
          <p className="text-muted-foreground mb-4">
            You are responsible for maintaining the confidentiality of your
            account and password. You agree to accept responsibility for all
            activities that occur under your account. You must notify us
            immediately of any unauthorized use of your account.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            4. Prohibited Content and Conduct
          </h2>
          <p className="text-muted-foreground mb-4">
            You agree not to use {config.appName} to create, upload, post, or
            otherwise transmit any content that:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>Contains pornographic or sexually explicit material</li>
            <li>
              Promotes or relates to alcohol, gambling, or betting services
            </li>
            <li>Violates any local, state, national, or international law</li>
            <li>Infringes on the intellectual property rights of others</li>
            <li>Contains hate speech, threats, or harassment</li>
            <li>Impersonates any person or entity without authorization</li>
            <li>Contains malware, viruses, or harmful code</li>
            <li>Engages in spam or unsolicited advertising</li>
            <li>Violates the privacy rights of others</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. User-Generated Content
          </h2>
          <p className="text-muted-foreground mb-4">
            You retain ownership of any content you create on {config.appName}.
            However, by posting content, you grant us a worldwide,
            non-exclusive, royalty-free license to use, reproduce, modify, and
            display your content for the purpose of operating and promoting the
            service.
          </p>
          <p className="text-muted-foreground mb-4">
            You represent and warrant that you have all necessary rights to the
            content you post and that such content does not violate these Terms
            of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Content Moderation</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to review, monitor, and remove any content that
            violates these Terms of Service. We may suspend or terminate
            accounts that repeatedly violate our policies. However, we are not
            obligated to monitor all content and are not responsible for
            user-generated content.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            7. Intellectual Property
          </h2>
          <p className="text-muted-foreground mb-4">
            The {config.appName} service, including its original content,
            features, and functionality, is owned by {config.appName} and is
            protected by international copyright, trademark, and other
            intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            8. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground mb-4">
            {config.appName} is provided "as is" and "as available" without any
            warranties of any kind, either express or implied. We do not warrant
            that the service will be uninterrupted, secure, or error-free.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-muted-foreground mb-4">
            In no event shall {config.appName} be liable for any indirect,
            incidental, special, consequential, or punitive damages arising out
            of or relating to your use of the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">10. Termination</h2>
          <p className="text-muted-foreground mb-4">
            We may terminate or suspend your account and access to the service
            immediately, without prior notice or liability, for any reason,
            including if you breach these Terms of Service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">11. Changes to Terms</h2>
          <p className="text-muted-foreground mb-4">
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes by posting the new Terms of
            Service on this page. Your continued use of the service after such
            changes constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            12. Contact Information
          </h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about these Terms of Service, please
            contact us at{' '}
            <a
              href={`mailto:${config.supportEmail}`}
              className="text-primary hover:underline"
            >
              {config.supportEmail}
            </a>
          </p>
        </section>
      </div>
    </PageLayout>
  )
}
