import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

// console.log("UploadThing App ID:", process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID);
console.log("TOKEN", process.env.UPLOADTHING_TOKEN);


const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);

      if (!user) throw new UploadThingError("Unauthorized");
      console.log("user", user)
      return { userId: user.id };
      
    })
  .onUploadComplete(({ metadata, file }) => {
      console.log("completed", {metadata,file});
      return { uploadedBy: metadata.userId };
})
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
