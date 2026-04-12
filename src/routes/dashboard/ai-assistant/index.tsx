import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { getAIUsageStatus } from '@/lib/billing/server'
import {
  explainTreatment,
  generateFollowUp,
  suggestPostCare,
} from '@/lib/dental/ai'
import { listPatients } from '@/lib/dental/server'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import {
  AlertTriangle,
  Bot,
  Check,
  ClipboardCopy,
  Heart,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  Zap,
} from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

function isLimitError(error: unknown): boolean {
  return error instanceof Error && error.message.includes('AI_LIMIT_REACHED')
}

function UpgradeBanner() {
  return (
    <Alert className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
      <Zap className="size-4 text-amber-600" />
      <AlertDescription className="flex items-center justify-between gap-4">
        <span className="text-sm">
          You've used all 10 free AI requests this month. Upgrade to Pro for
          unlimited access.
        </span>
        <Button asChild size="sm" variant="default" className="shrink-0 gap-1">
          <a href="/#pricing">
            <Zap className="size-3" />
            Upgrade to Pro
          </a>
        </Button>
      </AlertDescription>
    </Alert>
  )
}

export const Route = createFileRoute('/dashboard/ai-assistant/')({
  component: AIAssistantPage,
})

// ─── Follow-up Messages Tab ──────────────────────────────────────────

function FollowUpTab() {
  const queryClient = useQueryClient()
  const { data: patients } = useQuery({
    queryKey: ['patients'],
    queryFn: () => listPatients(),
  })

  const [patientName, setPatientName] = useState('')
  const [treatment, setTreatment] = useState('')
  const [days, setDays] = useState('1')
  const [tone, setTone] = useState<'friendly' | 'formal'>('friendly')
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>(
    'whatsapp',
  )
  const [clinicName, setClinicName] = useState('DentaFlow Clinic')
  const [result, setResult] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const mutation = useMutation({
    mutationFn: () =>
      generateFollowUp({
        data: {
          patientName,
          treatment,
          daysAfterTreatment: Number(days),
          tone,
          channel,
          clinicName,
        },
      }),
    onSuccess: (data) => {
      setResult(data.message)
      queryClient.invalidateQueries({ queryKey: ['ai-usage-status'] })
    },
    onError: (error) => {
      if (isLimitError(error)) {
        queryClient.invalidateQueries({ queryKey: ['ai-usage-status'] })
        toast.error('AI limit reached. Upgrade to Pro for unlimited access.')
      } else {
        toast.error('Failed to generate message. Please try again.')
      }
    },
  })

  function handleCopy() {
    if (!result) return
    navigator.clipboard.writeText(result)
    setCopied(true)
    toast.success('Copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleSelectPatient(name: string) {
    setPatientName(name)
  }

  const canGenerate = patientName.trim() && treatment.trim()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Patient Name *</Label>
          <Input
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
          {patients && patients.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {patients.slice(0, 5).map((p) => (
                <Button
                  key={p.id}
                  variant="outline"
                  size="sm"
                  className="text-xs h-6"
                  onClick={() => handleSelectPatient(p.name)}
                >
                  {p.name}
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label>Treatment Done *</Label>
          <Input
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="e.g., root canal, tooth extraction"
          />
        </div>

        <div className="grid gap-2">
          <Label>Days After Treatment</Label>
          <Input
            type="number"
            min="0"
            max="365"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Clinic Name</Label>
          <Input
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
          />
        </div>

        <div className="grid gap-2">
          <Label>Tone</Label>
          <RadioGroup
            value={tone}
            onValueChange={(v) => setTone(v as 'friendly' | 'formal')}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="friendly" id="tone-friendly" />
              <Label htmlFor="tone-friendly" className="font-normal">
                Friendly
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="formal" id="tone-formal" />
              <Label htmlFor="tone-formal" className="font-normal">
                Formal
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label>Channel</Label>
          <Select
            value={channel}
            onValueChange={(v) => setChannel(v as 'whatsapp' | 'sms' | 'email')}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
              <SelectItem value="sms">SMS</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={!canGenerate || mutation.isPending}
      >
        {mutation.isPending ? 'Generating...' : 'Generate Message'}
      </Button>

      {mutation.isPending && (
        <Card>
          <CardContent className="py-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      )}

      {result && !mutation.isPending && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="gap-1">
                <Bot className="size-3" />
                AI Generated
              </Badge>
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <Check className="size-3 mr-1" />
                ) : (
                  <ClipboardCopy className="size-3 mr-1" />
                )}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">
              {result}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Treatment Explanation Tab ───────────────────────────────────────

function ExplanationTab() {
  const queryClient = useQueryClient()
  const [procedure, setProcedure] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [concern, setConcern] = useState('')
  const [language, setLanguage] = useState<'simple' | 'detailed'>('simple')
  const [result, setResult] = useState<{
    explanation: string
    whatToExpect: string[]
    aftercareTips: string[]
  } | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      explainTreatment({
        data: {
          procedure,
          patientAge,
          patientConcern: concern,
          language,
        },
      }),
    onSuccess: (data) => {
      setResult(data)
      queryClient.invalidateQueries({ queryKey: ['ai-usage-status'] })
    },
    onError: (error) => {
      if (isLimitError(error)) {
        queryClient.invalidateQueries({ queryKey: ['ai-usage-status'] })
        toast.error('AI limit reached. Upgrade to Pro for unlimited access.')
      } else {
        toast.error('Failed to generate explanation. Please try again.')
      }
    },
  })

  const canGenerate = procedure.trim()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Procedure *</Label>
          <Input
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            placeholder="e.g., tooth extraction, dental implant, root canal"
          />
        </div>

        <div className="grid gap-2">
          <Label>Patient Age</Label>
          <Input
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            placeholder="e.g., 35"
          />
        </div>

        <div className="grid gap-2 sm:col-span-2">
          <Label>Patient Concern</Label>
          <Textarea
            value={concern}
            onChange={(e) => setConcern(e.target.value)}
            placeholder="e.g., scared of pain, worried about recovery time, afraid of needles"
            rows={2}
          />
        </div>

        <div className="grid gap-2">
          <Label>Language Level</Label>
          <RadioGroup
            value={language}
            onValueChange={(v) => setLanguage(v as 'simple' | 'detailed')}
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="simple" id="lang-simple" />
              <Label htmlFor="lang-simple" className="font-normal">
                Simple
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="detailed" id="lang-detailed" />
              <Label htmlFor="lang-detailed" className="font-normal">
                Detailed
              </Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={!canGenerate || mutation.isPending}
      >
        {mutation.isPending ? 'Explaining...' : 'Explain Treatment'}
      </Button>

      {mutation.isPending && (
        <Card>
          <CardContent className="py-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      )}

      {result && !mutation.isPending && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <Badge variant="secondary" className="gap-1 w-fit">
              <Bot className="size-3" />
              AI Generated
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-medium text-sm mb-2">Explanation</h3>
              <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
                {result.explanation}
              </p>
            </div>

            {result.whatToExpect.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm mb-2">What to Expect</h3>
                  <ul className="space-y-2">
                    {result.whatToExpect.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Stethoscope className="size-4 mt-0.5 shrink-0 text-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {result.aftercareTips.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm mb-2">Aftercare Tips</h3>
                  <ul className="space-y-2">
                    {result.aftercareTips.map((tip, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Heart className="size-4 mt-0.5 shrink-0 text-primary" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <Alert>
              <ShieldCheck className="size-4" />
              <AlertDescription>
                Simplified explanation for patient education only. Always
                consult your dentist for personalized medical advice.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Post-Care Instructions Tab ──────────────────────────────────────

function PostCareTab() {
  const queryClient = useQueryClient()
  const [treatment, setTreatment] = useState('')
  const [patientAge, setPatientAge] = useState('')
  const [severity, setSeverity] = useState<'minor' | 'moderate' | 'major'>(
    'minor',
  )
  const [hasAllergies, setHasAllergies] = useState(false)
  const [allergyDetails, setAllergyDetails] = useState('')
  const [result, setResult] = useState<{
    careInstructions: string[]
    avoidList: string[]
    warningSignsToWatch: string[]
    generalNote: string
  } | null>(null)

  const mutation = useMutation({
    mutationFn: () =>
      suggestPostCare({
        data: {
          treatment,
          patientAge,
          severity,
          hasAllergies,
          allergyDetails,
        },
      }),
    onSuccess: (data) => {
      setResult(data)
      queryClient.invalidateQueries({ queryKey: ['ai-usage-status'] })
    },
    onError: (error) => {
      if (isLimitError(error)) {
        queryClient.invalidateQueries({ queryKey: ['ai-usage-status'] })
        toast.error('AI limit reached. Upgrade to Pro for unlimited access.')
      } else {
        toast.error('Failed to generate instructions. Please try again.')
      }
    },
  })

  const canGenerate = treatment.trim()

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label>Treatment Done *</Label>
          <Input
            value={treatment}
            onChange={(e) => setTreatment(e.target.value)}
            placeholder="e.g., dental filling, wisdom tooth removal"
          />
        </div>

        <div className="grid gap-2">
          <Label>Patient Age</Label>
          <Input
            value={patientAge}
            onChange={(e) => setPatientAge(e.target.value)}
            placeholder="e.g., 28"
          />
        </div>

        <div className="grid gap-2">
          <Label>Severity</Label>
          <RadioGroup
            value={severity}
            onValueChange={(v) =>
              setSeverity(v as 'minor' | 'moderate' | 'major')
            }
            className="flex gap-4"
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem value="minor" id="sev-minor" />
              <Label htmlFor="sev-minor" className="font-normal">
                Minor
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="moderate" id="sev-moderate" />
              <Label htmlFor="sev-moderate" className="font-normal">
                Moderate
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="major" id="sev-major" />
              <Label htmlFor="sev-major" className="font-normal">
                Major
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label>Allergies</Label>
          <div className="flex items-center gap-3">
            <RadioGroup
              value={hasAllergies ? 'yes' : 'no'}
              onValueChange={(v) => setHasAllergies(v === 'yes')}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="no" id="allergy-no" />
                <Label htmlFor="allergy-no" className="font-normal">
                  None
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="yes" id="allergy-yes" />
                <Label htmlFor="allergy-yes" className="font-normal">
                  Yes
                </Label>
              </div>
            </RadioGroup>
          </div>
          {hasAllergies && (
            <Input
              value={allergyDetails}
              onChange={(e) => setAllergyDetails(e.target.value)}
              placeholder="e.g., penicillin, ibuprofen, latex"
            />
          )}
        </div>
      </div>

      <Button
        onClick={() => mutation.mutate()}
        disabled={!canGenerate || mutation.isPending}
      >
        {mutation.isPending ? 'Generating...' : 'Get Instructions'}
      </Button>

      {mutation.isPending && (
        <Card>
          <CardContent className="py-6 space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      )}

      {result && !mutation.isPending && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <Badge variant="secondary" className="gap-1 w-fit">
              <Bot className="size-3" />
              AI Generated
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {result.careInstructions.length > 0 && (
              <div>
                <h3 className="font-medium text-sm mb-2">Care Instructions</h3>
                <ul className="space-y-2">
                  {result.careInstructions.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <Heart className="size-4 mt-0.5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.avoidList.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm mb-2">Things to Avoid</h3>
                  <ul className="space-y-2">
                    {result.avoidList.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <AlertTriangle className="size-4 mt-0.5 shrink-0 text-amber-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {result.warningSignsToWatch.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-sm mb-2">
                    Warning Signs to Watch
                  </h3>
                  <ul className="space-y-2">
                    {result.warningSignsToWatch.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-destructive/80"
                      >
                        <AlertTriangle className="size-4 mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            <Alert variant="destructive">
              <ShieldCheck className="size-4" />
              <AlertDescription>
                {result.generalNote ||
                  'These are general suggestions only. Consult your dentist for personalized advice.'}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────

function AIAssistantPage() {
  const { data: usageStatus } = useQuery({
    queryKey: ['ai-usage-status'],
    queryFn: () => getAIUsageStatus(),
  })

  const limitReached =
    usageStatus && !usageStatus.isPro && usageStatus.usage >= usageStatus.limit

  return (
    <div className="flex flex-col gap-6 py-4 md:py-6">
      <div className="px-4 lg:px-6">
        <h1 className="text-2xl font-semibold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered tools to help your dental practice. All suggestions are
          assistive only.
        </p>
      </div>

      {limitReached && (
        <div className="px-4 lg:px-6">
          <UpgradeBanner />
        </div>
      )}

      <div className="px-4 lg:px-6">
        <Tabs defaultValue="follow-up">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="follow-up" className="gap-1">
              <MessageSquare className="size-4" />
              <span className="hidden sm:inline">Follow-up</span>
            </TabsTrigger>
            <TabsTrigger value="explanation" className="gap-1">
              <Stethoscope className="size-4" />
              <span className="hidden sm:inline">Explanation</span>
            </TabsTrigger>
            <TabsTrigger value="post-care" className="gap-1">
              <Heart className="size-4" />
              <span className="hidden sm:inline">Post-Care</span>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="follow-up">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Follow-up Message Generator
                  </CardTitle>
                  <CardDescription>
                    Generate polite follow-up messages for patients after
                    treatment. Copy and paste into WhatsApp, SMS, or email.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FollowUpTab />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="explanation">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Treatment Explanation
                  </CardTitle>
                  <CardDescription>
                    Explain dental procedures in patient-friendly language.
                    Ideal for nervous patients or pre-treatment education.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExplanationTab />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="post-care">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Post-Care Instructions
                  </CardTitle>
                  <CardDescription>
                    Generate general post-treatment care suggestions. These are
                    assistive only and should be reviewed before sharing.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PostCareTab />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
