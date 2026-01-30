import { createUploadthing, type FileRouter } from 'uploadthing/server'

const f = createUploadthing()

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Profile image uploader
  profileImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
      // Uploadthing will automatically optimize images
      // You can add additional transformations if needed
      // See: https://docs.uploadthing.com/api-reference/server#image-transformations
    },
  })
    // Set permissions and file types
    .middleware(async () => {
      // You can add auth check here if needed
      // For now, we'll allow uploads for all users
      // const session = await getSession()
      // if (!session) throw new Error('Unauthorized')

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { uploadedBy: 'user' }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on your server after upload
      console.log('Upload complete for user:', metadata.uploadedBy)
      console.log('File URL:', file.url)

      // Return data to the client
      return { url: file.url, key: file.key }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
