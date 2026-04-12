# DentaFlow MVP — Project Tickets

> **Project:** DentaFlow - AI-Powered Dental Practice Management
> **Built on:** BetterStarter (TanStack Start + Drizzle + better-auth + Stripe)
> **AI Provider:** Google Gemini Flash (free tier)
> **Rule:** All AI calls go through backend server functions. API key never touches the client.
> **Tone:** AI is assistive only, never medical authority.
> **Created:** April 12, 2026

---

## Board: Phase 1 — Foundation

### DENTA-001: Install Google Gemini SDK
- **Status:** To Do
- **Priority:** High
- **Labels:** `setup`
- **Task:** `pnpm add @google/generative-ai`

---

### DENTA-002: Rebrand to DentaFlow
- **Status:** To Do
- **Priority:** High
- **Labels:** `branding`
- **File:** `src/appConfig.ts`
- **Changes:**
  - [ ] `appName` → `'DentaFlow'`
  - [ ] `appDescription` → `'AI-Powered Dental Practice Management'`
  - [ ] Blog title/description → dental-focused

---

### DENTA-003: Add GEMINI_API_KEY env var
- **Status:** To Do
- **Priority:** High
- **Labels:** `config`
- **File:** `src/env.ts`
- **Task:** Add `GEMINI_API_KEY: z.string().min(1)` to `server` block (server-only, never exposed to client)
- **Free key:** https://aistudio.google.com/apikey

---

### DENTA-004: Create patient table
- **Status:** To Do
- **Priority:** High
- **Labels:** `database`
- **File:** `src/db/schema/dental.ts` (new)
- **Columns:** id (text PK), name, email, phone, notes, userId (FK→user.id), createdAt, updatedAt
- **Also:** Export from `src/db/schema/index.ts`, run `pnpm db:generate && pnpm db:push`

---

### DENTA-005: Update sidebar navigation
- **Status:** To Do
- **Priority:** High
- **Labels:** `ui`
- **File:** `src/components/AppSidebar.tsx`
- **Nav:** Dashboard, Patients, AI Assistant, AI Blog, Account
- **Fix:** `<a href>` → `<Link>` (SPA navigation)

---

## Board: Phase 2 — Patient CRUD + Dashboard

### DENTA-006: Patient server functions
- **Status:** To Do
- **Priority:** High
- **Labels:** `backend`
- **File:** `src/lib/dental/server.ts` (new)
- **Functions:** `listPatients` (GET), `createPatient` (POST), `deletePatient` (POST)
- **Pattern:** `createServerFn().middleware([authMiddleware]).handler()` — same as `src/lib/billing/server.ts`

---

### DENTA-007: Dashboard layout refactor
- **Status:** To Do
- **Priority:** High
- **Labels:** `routing`
- **File:** `src/routes/dashboard/route.tsx`
- **Task:** Convert to layout route (AppShell + Outlet), keep auth check

---

### DENTA-008: Dashboard overview page
- **Status:** To Do
- **Priority:** Medium
- **Labels:** `ui`
- **File:** `src/routes/dashboard/index.tsx` (new)
- **Content:** Patient count + 4 quick action cards linking to each feature

---

### DENTA-009: Patients list page
- **Status:** To Do
- **Priority:** High
- **Labels:** `ui`
- **File:** `src/routes/dashboard/patients/index.tsx` (new)
- **Features:** Table (name, email, phone), search, add dialog, delete action

---

## Board: Phase 3 — AI Assistant (3 tools)

### DENTA-010: AI Follow-up Message generator (backend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `backend`, `ai`
- **File:** `src/lib/dental/ai.server.ts` (new)
- **Function:** `generateFollowUp` (POST, server-side only)
- **Input (structured, product-level):**
  ```
  {
    patientName: string,          // "Sarah"
    treatment: string,            // "root canal"
    daysAfterTreatment: number,   // 2
    tone: 'friendly' | 'formal',  // "friendly"
    channel: 'whatsapp' | 'sms' | 'email',
    clinicName: string            // from appConfig or user input
  }
  ```
- **Prompt template sent to Gemini:**
  ```
  Generate a follow-up message:
  - Patient name: {{patientName}}
  - Treatment: {{treatment}}
  - Days after treatment: {{daysAfterTreatment}}
  - Tone: {{tone}} and professional
  - Channel: {{channel}} (keep length appropriate)
  - Clinic: {{clinicName}}
  ```
- **Output:** `{ message: string }` — channel-appropriate follow-up text
- **Gemini config:** `gemini-2.0-flash`, system instruction for dental practice follow-ups

---

### DENTA-011: AI Treatment Explanation (backend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `backend`, `ai`
- **File:** `src/lib/dental/ai.server.ts`
- **Function:** `explainTreatment` (POST, server-side only)
- **Input (structured, product-level):**
  ```
  {
    procedure: string,            // "tooth extraction"
    patientAge: string,           // "35" (adjusts language complexity)
    patientConcern: string,       // "scared of pain"
    language: 'simple' | 'detailed',  // "simple" for nervous patients
  }
  ```
- **Prompt template sent to Gemini:**
  ```
  Explain a dental procedure for a patient:
  - Procedure: {{procedure}}
  - Patient age: {{patientAge}}
  - Patient concern: {{patientConcern}}
  - Language level: {{language}}
  - Be reassuring and empathetic. Avoid medical jargon.
  ```
- **Output:** `{ explanation: string, whatToExpect: string[], aftercareTips: string[] }`
- **Disclaimer:** "Simplified explanation for patient education only."

---

### DENTA-012: AI Post-Care Instructions (backend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `backend`, `ai`
- **File:** `src/lib/dental/ai.server.ts`
- **Function:** `suggestPostCare` (POST, server-side only)
- **Input (structured, product-level):**
  ```
  {
    treatment: string,            // "dental filling"
    patientAge: string,           // "28"
    severity: 'minor' | 'moderate' | 'major',  // "minor"
    hasAllergies: boolean,        // false
    allergyDetails: string,       // "" (if hasAllergies is true)
  }
  ```
- **Prompt template sent to Gemini:**
  ```
  Suggest post-treatment care instructions:
  - Treatment done: {{treatment}}
  - Patient age: {{patientAge}}
  - Procedure severity: {{severity}}
  - Known allergies: {{hasAllergies ? allergyDetails : 'None reported'}}
  - Provide general care instructions, things to avoid, and warning signs.
  - This is assistive only — not a prescription.
  ```
- **Output:** `{ careInstructions: string[], avoidList: string[], warningSignsToWatch: string[], generalNote: string }`
- **Disclaimer:** "General suggestions only. Consult your dentist for personalized advice."

---

### DENTA-013: AI Assistant page (frontend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `ui`, `ai`
- **File:** `src/routes/dashboard/ai-assistant/index.tsx` (new)
- **3 Tabs:**

  **Tab 1: Follow-up Messages**
  - Patient name input (or select from patient list)
  - Treatment input (e.g., "root canal")
  - Days after treatment (number input, e.g., 2)
  - Tone selector: Friendly / Formal
  - Channel selector: WhatsApp / SMS / Email
  - Clinic name (pre-filled from config, editable)
  - "Generate Message" → result card with **copy button** (for pasting into WhatsApp/SMS)
  
  **Tab 2: Treatment Explanation**
  - Procedure input (e.g., "tooth extraction")
  - Patient age (e.g., "35")
  - Patient concern (e.g., "scared of pain", "worried about recovery time")
  - Language level: Simple / Detailed
  - "Explain Treatment" → explanation card + What to Expect list + Aftercare tips
  - Footer: "Simplified explanation for patient education only."
  
  **Tab 3: Post-Care Instructions**
  - Treatment input (e.g., "wisdom tooth removal")
  - Patient age (e.g., "28")
  - Severity: Minor / Moderate / Major
  - Allergies toggle + details field (if yes)
  - "Get Instructions" → care instructions + avoid list + warning signs
  - Banner: "General suggestions only. Consult your dentist for personalized advice."

- **Architecture:** Each button calls a `createServerFn` → Gemini API runs server-side → result returned to UI. API key never in browser.

---

## Board: Phase 4 — AI Blog/SEO Generator

### DENTA-014: AI blog generation (backend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `backend`, `ai`, `blog`
- **File:** `src/lib/dental/ai.server.ts`
- **Function:** `generateBlogPost` (POST, server-side only)
- **Input (structured, product-level):**
  ```
  {
    topic: string,                // "Why regular dental checkups matter"
    targetAudience: 'patients' | 'parents' | 'general',  // "patients"
    keywords: string[],           // ["dental checkup", "oral health", "preventive care"]
    tone: 'educational' | 'conversational' | 'professional',
    wordCount: '500-800' | '800-1200' | '1200-1500',
    clinicName: string            // for branding in the post
  }
  ```
- **Prompt template sent to Gemini:**
  ```
  Write an SEO-optimized dental blog post:
  - Topic: {{topic}}
  - Target audience: {{targetAudience}}
  - SEO keywords (use naturally): {{keywords}}
  - Tone: {{tone}}
  - Length: {{wordCount}} words
  - Clinic name: {{clinicName}}
  - Format: Markdown with h2/h3 headings, bullet points, conclusion
  - Include a compelling meta description (under 160 chars)
  ```
- **Output:** `{ title, description, tags[], content (markdown) }`

---

### DENTA-015: Save blog post (backend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `backend`, `blog`
- **File:** `src/lib/dental/ai.server.ts`
- **Function:** `saveBlogPost` (POST, server-side only)
- **Task:** Write `.md` file to `content/blog/` with frontmatter matching `content-collections.ts` schema
- **Frontmatter:** title, description, published (today), authors (["DentaFlow AI"]), draft, tags

---

### DENTA-016: AI Blog page (frontend)
- **Status:** To Do
- **Priority:** High
- **Labels:** `ui`, `blog`
- **File:** `src/routes/dashboard/ai-blog/index.tsx` (new)
- **Flow:**
  1. Topic input (required)
  2. Target audience selector: Patients / Parents / General
  3. SEO keywords (comma-separated)
  4. Tone: Educational / Conversational / Professional
  5. Word count: Short (500-800) / Medium (800-1200) / Long (1200-1500)
  6. Clinic name (pre-filled from config)
  7. "Generate Post" → loading skeleton → markdown preview
  8. Edit title/description/tags before publishing
  9. "Publish" → saves `.md` file → success toast with link to `/blog/{slug}`
  10. "View All Posts" link → `/blog`

---

## Board: Phase 5 — Landing Page

### DENTA-017: DentaFlow landing page
- **Status:** To Do
- **Priority:** Medium
- **Labels:** `ui`, `landing`
- **Files:** New components in `src/components/Landing/`, modify `src/routes/index.tsx`
- **Sections:** Hero, 4 AI Features showcase, How It Works, CTA

---

## Summary

| Phase | Tickets | Focus |
|-------|---------|-------|
| 1 | DENTA-001 to 005 | Foundation: SDK, config, schema, sidebar |
| 2 | DENTA-006 to 009 | Patient CRUD + dashboard |
| 3 | DENTA-010 to 013 | AI Assistant: Follow-up, Explanation, Post-Care |
| 4 | DENTA-014 to 016 | AI Blog/SEO Generator |
| 5 | DENTA-017 | Landing Page |

**Total: 17 tickets across 5 phases**

---

## Architecture

```
Browser → createServerFn() → Server Handler → Google Gemini API
                                                ↑
                                        GEMINI_API_KEY (server-only)
```

**API key is in `src/env.ts` server block. Never exposed to client. Never uses VITE_ prefix.**
