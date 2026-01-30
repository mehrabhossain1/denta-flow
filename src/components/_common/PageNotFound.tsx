import { Link } from '@tanstack/react-router'
import { PageLayout } from './PageLayout'
import { PageHeader } from './PageHeader'
import { Button } from '@/components/ui/button'

export function PageNotFound() {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center text-center">
        <PageHeader
          title="Page Not Found"
          description="The page you're looking for doesn't exist or has been moved."
        />

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Button asChild variant="default">
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
