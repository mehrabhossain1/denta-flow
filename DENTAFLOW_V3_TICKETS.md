# DentaFlow V3 - Email-Powered Patient Communication

> **Game-changing feature:** Doctors send blog posts and AI-generated follow-ups directly to patients via email from the dashboard. No more copy-pasting -- everything flows from DentaFlow to the patient's inbox.

---

## Phase 7: Patient Email Infrastructure

### V3-001: Add Email Preferences to Patient Schema
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Add email subscription tracking to the `patient` table:
  - `emailOptedIn` (boolean, default `true`) -- whether patient receives emails
  - `unsubscribeToken` (text, unique) -- unique token for unsubscribe link
  - Generate `unsubscribeToken` automatically on patient creation (UUID or nanoid)
- **Files:** `src/db/schema/dental.ts`, run `pnpm db:generate` + `pnpm db:push`
- **Status:** [ ]

### V3-002: Build Unsubscribe Endpoint and Page
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Create a public unsubscribe flow:
  - API route: `GET /api/unsubscribe?token=xxx` -- marks patient as `emailOptedIn = false`
  - Simple confirmation page: "You've been unsubscribed from Dr. [name]'s emails"
  - Re-subscribe option on the same page
  - No auth required (token-based)
- **Files:** `src/routes/api/unsubscribe.ts` (new), `src/routes/unsubscribe.tsx` (new)
- **Status:** [ ]

### V3-003: Create Email Template System
- **Priority:** High
- **Type:** Code Change
- **Description:** Build reusable email templates using Resend's React email or HTML templates:
  - Base template: DentaFlow header, content area, footer with unsubscribe link
  - Blog email template: title, excerpt/full content, "Read more" link
  - Follow-up email template: doctor name, clinic name, personalized message
  - All templates include: unsubscribe link, clinic branding
- **Files:** `src/lib/email/templates/` (new directory)
- **Status:** [ ]

---

## Phase 8: Blog Email Blast to Patients

### V3-004: Add "Send to Patients" Button on Blog Publish
- **Priority:** Critical
- **Type:** Code Change
- **Description:** After a doctor publishes/generates a blog post, show a "Send to Patients" button:
  - Shows count of subscribed patients (e.g., "Send to 42 patients")
  - Confirmation dialog before sending
  - Option in the AI blog publish flow (after "Publish" step, offer "Also email to patients?")
- **Files:** `src/routes/dashboard/ai-blog/index.tsx`
- **Status:** [ ]

### V3-005: Build Blog Email Blast Server Function
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Server function `sendBlogToPatients`:
  - Fetches all patients where `emailOptedIn = true` and `email IS NOT NULL` for the current doctor
  - Sends blog email (title, description, content preview, link to full post) to each patient
  - Uses Resend batch send API for efficiency (up to 100 per batch)
  - Each email includes personalized unsubscribe link using patient's `unsubscribeToken`
  - Returns count of emails sent
  - Protected by `authMiddleware`
- **Files:** `src/lib/dental/email.ts` (new), `src/lib/dental/server.ts`
- **Status:** [ ]

### V3-006: Add Email Sending Status and History
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Track which blogs were emailed and when:
  - New DB table `email_log`: id, doctorId, type ('blog' | 'follow-up'), subjectId (blog slug or patient id), recipientCount, sentAt
  - Show "Emailed to X patients on [date]" badge on blog posts in dashboard
  - Prevent accidental re-sends (warn if blog was already emailed)
- **Files:** `src/db/schema/email.ts` (new), `src/routes/dashboard/ai-blog/index.tsx`
- **Status:** [ ]

---

## Phase 9: AI Follow-up Direct to Patient Email

### V3-007: Add Patient Selector to Follow-up Tab
- **Priority:** Critical
- **Type:** Code Change
- **Description:** Enhance the AI Follow-up Messages tab:
  - Add a searchable patient dropdown at the top of the form
  - When a patient is selected, auto-fill:
    - `patientName` from patient record
    - Show patient's email below the selector (so doctor knows where it'll go)
  - Doctor fills in: treatment/disease, days after treatment, tone, channel
  - If patient has no email, show warning: "No email on file -- add email in Patient Management"
- **Files:** `src/routes/dashboard/ai-assistant/index.tsx`
- **Status:** [ ]

### V3-008: Add Patient Notes/Disease Field to Patient Schema
- **Priority:** High
- **Type:** Code Change
- **Description:** Enhance patient records to store treatment/disease context:
  - Add `diagnosis` field (text, optional) to patient table -- what the patient is being treated for
  - Add `lastTreatment` field (text, optional) -- most recent treatment/procedure
  - Add `lastVisit` field (date, optional) -- date of last visit
  - Update "Add Patient" form and patient table to show these fields
  - These fields auto-populate the AI follow-up form when patient is selected
- **Files:** `src/db/schema/dental.ts`, `src/routes/dashboard/patients/index.tsx`, `src/lib/dental/server.ts`
- **Status:** [ ]

### V3-009: Add "Send to Patient" Button on Generated Follow-up
- **Priority:** Critical
- **Type:** Code Change
- **Description:** After AI generates a follow-up message, add a "Send via Email" button next to the existing "Copy" button:
  - Sends the generated message to the selected patient's email
  - Uses the follow-up email template (doctor name, clinic branding, unsubscribe link)
  - Subject line: "Follow-up from [Clinic Name] - [Treatment]"
  - Show success toast: "Follow-up sent to [patient name] at [email]"
  - Disable button if no patient selected or patient has no email
  - Log the send in `email_log` table
- **Files:** `src/routes/dashboard/ai-assistant/index.tsx`, `src/lib/dental/email.ts`
- **Status:** [ ]

### V3-010: Add "Send to Patient" for Treatment Explanations and Post-Care
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Extend the same email-send pattern to the other two AI tabs:
  - Treatment Explanation tab: "Email explanation to patient" button
  - Post-Care Instructions tab: "Email instructions to patient" button
  - Both require patient selection (add same patient dropdown as V3-007)
  - Format AI output as clean HTML email (structured sections, bullet points)
  - Log sends in `email_log`
- **Files:** `src/routes/dashboard/ai-assistant/index.tsx`, `src/lib/dental/email.ts`
- **Status:** [ ]

---

## Phase 10: Polish and Safety

### V3-011: Add Resend Rate Limit Awareness
- **Priority:** High
- **Type:** Code Change
- **Description:** Resend free tier allows 100 emails/day. Add safeguards:
  - Track daily email count per doctor in `email_log`
  - Warn doctor when approaching limit: "You've sent X/100 emails today"
  - Block sends over limit with clear message about upgrading Resend plan
  - Show daily usage in dashboard overview or account page
- **Files:** `src/lib/dental/email.ts`, `src/routes/dashboard/index.tsx`
- **Status:** [ ]

### V3-012: Email Preview Before Sending
- **Priority:** Medium
- **Type:** Code Change
- **Description:** Let doctors preview exactly what patients will receive:
  - "Preview Email" button opens a modal showing the rendered email template
  - Shows: from address, to address, subject line, full email body
  - Doctor can edit subject line before sending
  - Confirm/Cancel buttons at the bottom
- **Files:** `src/routes/dashboard/ai-assistant/index.tsx`, `src/routes/dashboard/ai-blog/index.tsx`
- **Status:** [ ]

---

## Summary

| Phase | Tickets | Focus |
|-------|---------|-------|
| 7 | V3-001 to V3-003 | Patient email infrastructure (preferences, unsubscribe, templates) |
| 8 | V3-004 to V3-006 | Blog email blast to all patients |
| 9 | V3-007 to V3-010 | AI follow-up direct to patient email |
| 10 | V3-011 to V3-012 | Rate limits, email preview |

**Total: 12 tickets across 4 phases**

### Key Architecture Decisions
- **Unsubscribe:** Token-based (no auth required), CAN-SPAM compliant
- **Email templates:** Resend React Email or HTML for consistent branding
- **Batch sending:** Resend batch API for blog blasts (efficient, single API call for up to 100 recipients)
- **Email logging:** Track all sends to prevent duplicates and show usage
- **Patient context:** Enhanced patient records (diagnosis, last treatment) auto-populate AI forms for one-click follow-ups
