// src/uploadthing.config.ts
import type { FileRouter } from "uploadthing/next";
import { ourFileRouter } from "@/app/api/uploadthing/core";

export type OurFileRouter = typeof ourFileRouter;
