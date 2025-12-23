import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// Debug logs
console.log("🔧 UploadThing Core Initializing...");
console.log("🔑 Secret Key Present:", !!process.env.UPLOADTHING_SECRET);
console.log("🆔 App ID Present:", !!process.env.UPLOADTHING_APP_ID);

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    // Set permissions and file types for this FileRoute
    .middleware(async ({ req }) => {
      try {
        console.log("🔒 Middleware starting...");
        // This code runs on your server before upload
        const user = await auth(req);

        // If you throw, the user will not be able to upload
        if (!user) {
          console.error("❌ User not found in middleware");
          throw new Error("Unauthorized");
        }

        console.log("✅ Middleware success, user:", user.id);
        // Whatever is returned here is accessible in onUploadComplete as `metadata`
        return { userId: user.id };
      } catch (error) {
        console.error("❌ Middleware Error:", error);
        throw error;
      }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;