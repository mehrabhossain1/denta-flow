import config from '@/appConfig'
import { PageHeader } from '@/components/_common/PageHeader'
import { PageLayout } from '@/components/_common/PageLayout'
import { generatePageSEO } from '@/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/legal/privacy')({
  head: () => ({
    meta: generatePageSEO({
      title: 'Privacy Policy',
      description: 'Privacy Policy for Better-Starter',
    }),
  }),
  component: PrivacyPage,
})

function PrivacyPage() {
  const lastUpdated = 'November 8, 2025'

  return (
    <PageLayout showHeader showFooter>
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${lastUpdated}`}
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-muted-foreground mb-4">
            Welcome to {config.appName}. We respect your privacy and are
            committed to protecting your personal data. This privacy policy will
            inform you about how we collect, use, and protect your personal
            information when you use our service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            2. Information We Collect
          </h2>
          <p className="text-muted-foreground mb-4">
            We collect the following types of information:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>
              <strong>Account Information:</strong> Email address, name, and
              authentication credentials when you create an account
            </li>
            <li>
              <strong>Profile Information:</strong> Handle, display name,
              tagline, bio, location, website, avatar, and other information you
              choose to add to your profile
            </li>
            <li>
              <strong>User-Generated Content:</strong> Any content you create,
              upload, or share on the platform
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you use our
              service, including access times, pages viewed, and actions taken
            </li>
            <li>
              <strong>Technical Data:</strong> IP address, browser type, device
              information, and cookies
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-muted-foreground mb-4">
            We use your information for the following purposes:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>To provide and maintain our service</li>
            <li>To create and manage your user account</li>
            <li>To display your public profile information</li>
            <li>To communicate with you about your account or our service</li>
            <li>To improve and personalize your experience</li>
            <li>To monitor and analyze usage patterns</li>
            <li>To detect, prevent, and address security issues</li>
            <li>To enforce our Terms of Service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Public Information</h2>
          <p className="text-muted-foreground mb-4">
            {config.appName} is a platform for creating public profiles.
            Information you add to your profile, including your handle, name,
            bio, avatar, and other profile content, is publicly accessible and
            may be viewed by anyone on the internet.
          </p>
          <p className="text-muted-foreground mb-4">
            Please be mindful of what information you choose to make public. Do
            not share sensitive personal information in your public profile.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            5. Information Sharing
          </h2>
          <p className="text-muted-foreground mb-4">
            We do not sell your personal information. We may share your
            information in the following circumstances:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>
              <strong>Public Profiles:</strong> Profile information you choose
              to make public is accessible to all users and visitors
            </li>
            <li>
              <strong>Service Providers:</strong> With third-party service
              providers who help us operate our service (e.g., hosting, email,
              analytics)
            </li>
            <li>
              <strong>Legal Requirements:</strong> When required by law or to
              protect our rights and safety
            </li>
            <li>
              <strong>Business Transfers:</strong> In connection with a merger,
              acquisition, or sale of assets
            </li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Data Retention</h2>
          <p className="text-muted-foreground mb-4">
            We retain your personal information for as long as your account is
            active or as needed to provide you services. If you wish to delete
            your account, please contact us at {config.supportEmail}. We may
            retain certain information as required by law or for legitimate
            business purposes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">7. Data Security</h2>
          <p className="text-muted-foreground mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information. However, no method of
            transmission over the internet or electronic storage is 100% secure.
            While we strive to protect your data, we cannot guarantee absolute
            security.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">8. Your Rights</h2>
          <p className="text-muted-foreground mb-4">
            You have the following rights regarding your personal data:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
            <li>
              <strong>Access:</strong> Request access to your personal
              information
            </li>
            <li>
              <strong>Correction:</strong> Update or correct your information
              through your account settings
            </li>
            <li>
              <strong>Deletion:</strong> Request deletion of your account and
              data
            </li>
            <li>
              <strong>Objection:</strong> Object to processing of your data
            </li>
            <li>
              <strong>Data Portability:</strong> Request a copy of your data in
              a portable format
            </li>
          </ul>
          <p className="text-muted-foreground mb-4">
            To exercise these rights, please contact us at{' '}
            <a
              href={`mailto:${config.supportEmail}`}
              className="text-primary hover:underline"
            >
              {config.supportEmail}
            </a>
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            9. Cookies and Tracking
          </h2>
          <p className="text-muted-foreground mb-4">
            We use cookies and similar tracking technologies to track activity
            on our service and store certain information. Cookies help us
            provide, protect, and improve our service. You can instruct your
            browser to refuse all cookies or to indicate when a cookie is being
            sent.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            10. Third-Party Services
          </h2>
          <p className="text-muted-foreground mb-4">
            Our service may contain links to third-party websites or services.
            We are not responsible for the privacy practices of these third
            parties. We encourage you to read their privacy policies.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            11. Children's Privacy
          </h2>
          <p className="text-muted-foreground mb-4">
            Our service is not intended for users under the age of 13. We do not
            knowingly collect personal information from children under 13. If we
            become aware that we have collected data from a child under 13, we
            will take steps to delete such information.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            12. Changes to This Policy
          </h2>
          <p className="text-muted-foreground mb-4">
            We may update this Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date. You are advised to review this
            Privacy Policy periodically for any changes.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">13. Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about this Privacy Policy or our data
            practices, please contact us at{' '}
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
