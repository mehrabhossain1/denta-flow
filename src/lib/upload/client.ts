import type { OurFileRouter } from '@/lib/upload/server'
import { generateReactHelpers } from '@uploadthing/react'

export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>({
    url: '/api/uploadthing',
  })
