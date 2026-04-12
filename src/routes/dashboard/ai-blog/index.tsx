import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { generateBlogPost, saveBlogPost } from '@/lib/dental/ai'
import { useMutation } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Bot, Check, ExternalLink, FileText } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

export const Route = createFileRoute('/dashboard/ai-blog/')({
  component: AIBlogPage,
})

function AIBlogPage() {
  const [topic, setTopic] = useState('')
  const [keywords, setKeywords] = useState('')
  const [audience, setAudience] = useState<'patients' | 'parents' | 'general'>(
    'patients',
  )
  const [tone, setTone] = useState<
    'educational' | 'conversational' | 'professional'
  >('educational')
  const [wordCount, setWordCount] = useState<
    '500-800' | '800-1200' | '1200-1500'
  >('800-1200')
  const [clinicName, setClinicName] = useState('DentaFlow Clinic')

  const [result, setResult] = useState<{
    title: string
    description: string
    tags: string[]
    content: string
  } | null>(null)

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [publishedSlug, setPublishedSlug] = useState<string | null>(null)

  const generateMutation = useMutation({
    mutationFn: () =>
      generateBlogPost({
        data: {
          topic,
          targetAudience: audience,
          keywords: keywords
            .split(',')
            .map((k) => k.trim())
            .filter(Boolean),
          tone,
          wordCount,
          clinicName,
        },
      }),
    onSuccess: (data) => {
      setResult(data)
      setEditTitle(data.title)
      setEditDescription(data.description)
      setPublishedSlug(null)
    },
    onError: () => {
      toast.error('Failed to generate blog post. Please try again.')
    },
  })

  const saveMutation = useMutation({
    mutationFn: () =>
      saveBlogPost({
        data: {
          title: editTitle,
          description: editDescription,
          tags: result?.tags ?? [],
          content: result?.content ?? '',
        },
      }),
    onSuccess: (data) => {
      setPublishedSlug(data.slug)
      toast.success('Blog post published!')
    },
    onError: () => {
      toast.error('Failed to save blog post. Please try again.')
    },
  })

  const canGenerate = topic.trim()

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            AI Blog Generator
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Generate SEO-optimized dental blog posts for your clinic website
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/blog">
            <ExternalLink className="size-4 mr-1" />
            View Blog
          </Link>
        </Button>
      </div>

      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generate a Blog Post</CardTitle>
            <CardDescription>
              Fill in the details and let AI create a dental blog post for your
              clinic
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2 sm:col-span-2">
                <Label>Topic *</Label>
                <Input
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Why regular dental checkups matter"
                />
              </div>

              <div className="grid gap-2 sm:col-span-2">
                <Label>SEO Keywords</Label>
                <Input
                  value={keywords}
                  onChange={(e) => setKeywords(e.target.value)}
                  placeholder="e.g., dental checkup, oral health, preventive care (comma separated)"
                />
              </div>

              <div className="grid gap-2">
                <Label>Target Audience</Label>
                <Select
                  value={audience}
                  onValueChange={(v) =>
                    setAudience(v as 'patients' | 'parents' | 'general')
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patients">Patients</SelectItem>
                    <SelectItem value="parents">Parents</SelectItem>
                    <SelectItem value="general">General Public</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Tone</Label>
                <Select
                  value={tone}
                  onValueChange={(v) =>
                    setTone(
                      v as 'educational' | 'conversational' | 'professional',
                    )
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="conversational">
                      Conversational
                    </SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Word Count</Label>
                <RadioGroup
                  value={wordCount}
                  onValueChange={(v) =>
                    setWordCount(v as '500-800' | '800-1200' | '1200-1500')
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="500-800" id="wc-short" />
                    <Label htmlFor="wc-short" className="font-normal">
                      Short
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="800-1200" id="wc-medium" />
                    <Label htmlFor="wc-medium" className="font-normal">
                      Medium
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="1200-1500" id="wc-long" />
                    <Label htmlFor="wc-long" className="font-normal">
                      Long
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="grid gap-2">
                <Label>Clinic Name</Label>
                <Input
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={() => generateMutation.mutate()}
              disabled={!canGenerate || generateMutation.isPending}
            >
              {generateMutation.isPending
                ? 'Generating post...'
                : 'Generate Post'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {generateMutation.isPending && (
        <div className="px-4 lg:px-6">
          <Card>
            <CardContent className="py-6 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {result && !generateMutation.isPending && (
        <div className="px-4 lg:px-6 space-y-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="gap-1 w-fit">
                  <Bot className="size-3" />
                  AI Generated
                </Badge>
                {publishedSlug && (
                  <Badge
                    variant="default"
                    className="gap-1 bg-green-600 hover:bg-green-700"
                  >
                    <Check className="size-3" />
                    Published
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label>Title</Label>
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Meta Description</Label>
                  <Input
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    {editDescription.length}/160 characters
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {result.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium text-sm mb-3">Content Preview</h3>
                <div className="rounded-lg border bg-background p-4 max-h-96 overflow-y-auto">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {result.content.split('\n').map((line, i) => {
                      if (line.startsWith('### '))
                        return (
                          <h3
                            key={i}
                            className="text-base font-semibold mt-4 mb-2"
                          >
                            {line.replace('### ', '')}
                          </h3>
                        )
                      if (line.startsWith('## '))
                        return (
                          <h2
                            key={i}
                            className="text-lg font-semibold mt-5 mb-2"
                          >
                            {line.replace('## ', '')}
                          </h2>
                        )
                      if (line.startsWith('- '))
                        return (
                          <li
                            key={i}
                            className="text-sm text-muted-foreground ml-4"
                          >
                            {line.replace('- ', '')}
                          </li>
                        )
                      if (line.trim() === '') return <br key={i} />
                      return (
                        <p
                          key={i}
                          className="text-sm text-muted-foreground mb-2"
                        >
                          {line}
                        </p>
                      )
                    })}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                {!publishedSlug ? (
                  <Button
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending || !editTitle.trim()}
                  >
                    <FileText className="size-4 mr-1" />
                    {saveMutation.isPending ? 'Publishing...' : 'Publish Post'}
                  </Button>
                ) : (
                  <Button asChild>
                    <Link to="/blog/$slug" params={{ slug: publishedSlug }}>
                      <ExternalLink className="size-4 mr-1" />
                      View Published Post
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  onClick={() => generateMutation.mutate()}
                  disabled={generateMutation.isPending}
                >
                  Regenerate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
