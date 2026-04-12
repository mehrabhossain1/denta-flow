import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { listPatients } from '@/lib/dental/server'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Bot, FileText, Users } from 'lucide-react'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  const { data: patients, isLoading } = useQuery({
    queryKey: ['patients'],
    queryFn: () => listPatients(),
  })

  const patientCount = patients?.length ?? 0

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Welcome to DentaFlow. Manage your practice with AI.
        </p>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Patients</CardDescription>
            {isLoading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <CardTitle className="text-3xl">{patientCount}</CardTitle>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              {patientCount === 0
                ? 'Add your first patient to get started'
                : `${patientCount} patient${patientCount !== 1 ? 's' : ''} in your practice`}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="px-4 lg:px-6">
        <h2 className="text-lg font-medium mb-3">Quick Actions</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Users className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">Patients</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Add and manage your patient records
              </CardDescription>
              <Button asChild size="sm" variant="outline">
                <Link to="/dashboard/patients">View Patients</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Bot className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">AI Assistant</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Follow-ups, treatment explanations, post-care instructions
              </CardDescription>
              <Button asChild size="sm" variant="outline">
                <Link to="/dashboard/ai-assistant">Open Assistant</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-foreground/20 transition-colors">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <FileText className="size-5 text-muted-foreground" />
                <CardTitle className="text-base">AI Blog</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <CardDescription>
                Generate SEO dental blog posts for your clinic
              </CardDescription>
              <Button asChild size="sm" variant="outline">
                <Link to="/dashboard/ai-blog">Create Post</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
