import { authMiddleware } from '@/lib/auth/middleware'
import { canUseAI, incrementUsage } from '@/lib/billing/usage'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

// ─── Types ───────────────────────────────────────────────────────────

type GenerateFollowUpInput = {
  patientName: string
  treatment: string
  daysAfterTreatment: number
  tone: 'friendly' | 'formal'
  channel: 'whatsapp' | 'sms' | 'email'
  clinicName: string
}

type ExplainTreatmentInput = {
  procedure: string
  patientAge: string
  patientConcern: string
  language: 'simple' | 'detailed'
}

type SuggestPostCareInput = {
  treatment: string
  patientAge: string
  severity: 'minor' | 'moderate' | 'major'
  hasAllergies: boolean
  allergyDetails: string
}

// ─── Helper: get Gemini model (lazy, server-only) ────────────────────

async function callGemini(prompt: string): Promise<string> {
  const { GoogleGenerativeAI } = await import('@google/generative-ai')
  const { env } = await import('@/env')
  const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const result = await model.generateContent(prompt)
  return result.response.text().trim()
}

// ─── AI Follow-up Message ────────────────────────────────────────────

export const generateFollowUp = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      patientName: z.string().trim().min(1).max(100),
      treatment: z.string().trim().min(1).max(200),
      daysAfterTreatment: z.number().int().min(0).max(365),
      tone: z.enum(['friendly', 'formal']),
      channel: z.enum(['whatsapp', 'sms', 'email']),
      clinicName: z.string().trim().min(1).max(100),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const usageCheck = await canUseAI(context.user.id)
    if (!usageCheck.allowed) {
      throw new Error('AI_LIMIT_REACHED')
    }

    const input = data as unknown as GenerateFollowUpInput

    const prompt = `Generate a follow-up message for a dental patient.

- Patient name: ${input.patientName}
- Treatment done: ${input.treatment}
- Days after treatment: ${input.daysAfterTreatment}
- Tone: ${input.tone} and professional
- Channel: ${input.channel} (keep length appropriate for this channel)
- Clinic name: ${input.clinicName}

Rules:
- Be warm, caring, and professional
- Include specific care reminders relevant to the treatment
- For WhatsApp/SMS keep it concise (under 300 characters for SMS, under 500 for WhatsApp)
- For email, include a proper greeting and sign-off
- Do NOT provide specific medical advice or prescriptions
- End with an invitation to contact the clinic if needed

Return ONLY the message text, no extra formatting or explanation.`

    const message = await callGemini(prompt)
    await incrementUsage(context.user.id, 'follow-up')
    return { message }
  })

// ─── AI Treatment Explanation ────────────────────────────────────────

export const explainTreatment = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      procedure: z.string().trim().min(1).max(200),
      patientAge: z.string().trim().max(20),
      patientConcern: z.string().trim().max(500),
      language: z.enum(['simple', 'detailed']),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const usageCheck = await canUseAI(context.user.id)
    if (!usageCheck.allowed) {
      throw new Error('AI_LIMIT_REACHED')
    }

    const input = data as unknown as ExplainTreatmentInput

    const prompt = `Explain a dental procedure to a patient in ${input.language === 'simple' ? 'simple, easy-to-understand' : 'detailed but accessible'} language.

- Procedure: ${input.procedure}
- Patient age: ${input.patientAge}
- Patient concern: ${input.patientConcern || 'None specified'}
- Language level: ${input.language}

Rules:
- Be reassuring and empathetic
- Avoid medical jargon when language is "simple"
- Address the patient's specific concern directly
- This is for patient education only, not medical advice

Return a JSON object with this exact structure:
{
  "explanation": "A clear explanation of the procedure (2-3 paragraphs)",
  "whatToExpect": ["Step 1...", "Step 2...", "Step 3..."],
  "aftercareTips": ["Tip 1...", "Tip 2...", "Tip 3..."]
}

Return ONLY valid JSON, no markdown fences.`

    const text = await callGemini(prompt)

    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      const parsed = JSON.parse(cleaned) as {
        explanation: string
        whatToExpect: string[]
        aftercareTips: string[]
      }
      await incrementUsage(context.user.id, 'treatment-explanation')
      return parsed
    } catch {
      await incrementUsage(context.user.id, 'treatment-explanation')
      return {
        explanation: text,
        whatToExpect: [] as string[],
        aftercareTips: [] as string[],
      }
    }
  })

// ─── AI Post-Care Instructions ───────────────────────────────────────

export const suggestPostCare = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      treatment: z.string().trim().min(1).max(200),
      patientAge: z.string().trim().max(20),
      severity: z.enum(['minor', 'moderate', 'major']),
      hasAllergies: z.boolean(),
      allergyDetails: z.string().trim().max(500),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const usageCheck = await canUseAI(context.user.id)
    if (!usageCheck.allowed) {
      throw new Error('AI_LIMIT_REACHED')
    }

    const input = data as unknown as SuggestPostCareInput

    const prompt = `Suggest general post-treatment care instructions for a dental patient.

- Treatment done: ${input.treatment}
- Patient age: ${input.patientAge}
- Procedure severity: ${input.severity}
- Known allergies: ${input.hasAllergies ? input.allergyDetails : 'None reported'}

Rules:
- These are GENERAL wellness suggestions only, NOT medical prescriptions
- Be specific to the treatment type
- If allergies are reported, note them in context but do NOT prescribe alternatives
- Always include the disclaimer that these are general suggestions

Return a JSON object with this exact structure:
{
  "careInstructions": ["Instruction 1...", "Instruction 2...", "..."],
  "avoidList": ["Avoid this...", "Avoid that...", "..."],
  "warningSignsToWatch": ["Warning sign 1...", "Warning sign 2...", "..."],
  "generalNote": "A brief closing note reminding to follow dentist's specific instructions"
}

Return ONLY valid JSON, no markdown fences.`

    const text = await callGemini(prompt)

    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      const parsed = JSON.parse(cleaned) as {
        careInstructions: string[]
        avoidList: string[]
        warningSignsToWatch: string[]
        generalNote: string
      }
      await incrementUsage(context.user.id, 'post-care')
      return parsed
    } catch {
      await incrementUsage(context.user.id, 'post-care')
      return {
        careInstructions: [text],
        avoidList: [] as string[],
        warningSignsToWatch: [] as string[],
        generalNote:
          'These are general suggestions only. Please consult your dentist for personalized advice.',
      }
    }
  })

// ─── Types (Blog) ────────────────────────────────────────────────────

type GenerateBlogPostInput = {
  topic: string
  targetAudience: 'patients' | 'parents' | 'general'
  keywords: string[]
  tone: 'educational' | 'conversational' | 'professional'
  wordCount: '500-800' | '800-1200' | '1200-1500'
  clinicName: string
}

type SaveBlogPostInput = {
  title: string
  description: string
  tags: string[]
  content: string
}

// ─── AI Blog Post Generator ─────────────────────────────────────────

export const generateBlogPost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      topic: z.string().trim().min(1).max(200),
      targetAudience: z.enum(['patients', 'parents', 'general']),
      keywords: z.array(z.string().trim().max(50)).max(20),
      tone: z.enum(['educational', 'conversational', 'professional']),
      wordCount: z.enum(['500-800', '800-1200', '1200-1500']),
      clinicName: z.string().trim().min(1).max(100),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const usageCheck = await canUseAI(context.user.id)
    if (!usageCheck.allowed) {
      throw new Error('AI_LIMIT_REACHED')
    }

    const input = data as unknown as GenerateBlogPostInput

    const prompt = `Write an SEO-optimized dental blog post for a clinic website.

- Topic: ${input.topic}
- Target audience: ${input.targetAudience}
- SEO keywords (use naturally): ${input.keywords.join(', ') || 'none specified'}
- Tone: ${input.tone}
- Length: ${input.wordCount} words
- Clinic name: ${input.clinicName}

Rules:
- Write in markdown format
- Use h2 (##) and h3 (###) headings to structure the content
- Include bullet points and numbered lists where appropriate
- Write a compelling introduction and conclusion
- Naturally incorporate the SEO keywords without keyword stuffing
- Make it informative and actionable for the target audience
- Do NOT include the title as an h1 heading in the content (it will be added separately)

Return a JSON object with this exact structure:
{
  "title": "The blog post title (compelling, SEO-friendly)",
  "description": "A meta description under 160 characters for SEO",
  "tags": ["tag1", "tag2", "tag3"],
  "content": "The full markdown blog post content (without the title)"
}

Return ONLY valid JSON, no markdown fences.`

    const text = await callGemini(prompt)

    try {
      const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '')
      const parsed = JSON.parse(cleaned) as {
        title: string
        description: string
        tags: string[]
        content: string
      }
      await incrementUsage(context.user.id, 'blog-post')
      return parsed
    } catch {
      await incrementUsage(context.user.id, 'blog-post')
      return {
        title: input.topic,
        description: '',
        tags: [] as string[],
        content: text,
      }
    }
  })

// ─── Save Blog Post to Filesystem ───────────────────────────────────

export const saveBlogPost = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .inputValidator(
    z.object({
      title: z.string().trim().min(1).max(200),
      description: z.string().trim().max(500),
      tags: z.array(z.string().trim().max(50)).max(20),
      content: z.string().trim().min(1).max(50000),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const input = data as unknown as SaveBlogPostInput
    const fs = await import('node:fs')
    const path = await import('node:path')

    const slug = input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')

    const today = new Date().toISOString().split('T')[0]

    const frontmatter = [
      '---',
      `title: "${input.title.replace(/"/g, '\\"')}"`,
      `description: "${input.description.replace(/"/g, '\\"')}"`,
      `published: ${today}`,
      'authors:',
      '  - DentaFlow AI',
      'draft: false',
      `tags: [${input.tags.map((t) => `"${t}"`).join(', ')}]`,
      '---',
    ].join('\n')

    const fileContent = `${frontmatter}\n\n${input.content}\n`

    const blogDir = path.resolve(process.cwd(), 'content', 'blog')
    const filePath = path.join(blogDir, `${slug}.md`)

    fs.writeFileSync(filePath, fileContent, 'utf-8')

    return { slug }
  })
