import { db } from '@/db'
import { patient } from '@/db/schema'
import { authMiddleware } from '@/lib/auth/middleware'
import { createServerFn } from '@tanstack/react-start'
import { and, eq, ilike, or } from 'drizzle-orm'

type CreatePatientInput = {
  name: string
  email?: string
  phone?: string
  notes?: string
}

type DeletePatientInput = {
  patientId: string
}

type ListPatientsInput = {
  search?: string
}

export const listPatients = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const input = data as unknown as ListPatientsInput | undefined

    const conditions = [eq(patient.userId, context.user.id)]

    if (input?.search) {
      const search = `%${input.search}%`
      conditions.push(
        or(ilike(patient.name, search), ilike(patient.email, search))!,
      )
    }

    const patients = await db
      .select()
      .from(patient)
      .where(and(...conditions))
      .orderBy(patient.createdAt)

    return patients
  })

export const createPatient = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const input = data as unknown as CreatePatientInput

    if (!input.name?.trim()) {
      throw new Error('Patient name is required')
    }

    const [newPatient] = await db
      .insert(patient)
      .values({
        id: crypto.randomUUID(),
        name: input.name.trim(),
        email: input.email?.trim() || null,
        phone: input.phone?.trim() || null,
        notes: input.notes?.trim() || null,
        userId: context.user.id,
      })
      .returning()

    return newPatient
  })

export const deletePatient = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const input = data as unknown as DeletePatientInput

    await db
      .delete(patient)
      .where(
        and(
          eq(patient.id, input.patientId),
          eq(patient.userId, context.user.id),
        ),
      )

    return { success: true }
  })
