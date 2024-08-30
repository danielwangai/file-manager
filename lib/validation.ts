"use client";

import { z } from "zod"

export const uploadFileSchema = z.object({
    name: z.string().min(1).max(200),
    file: z
        .custom<FileList>((val) => val instanceof FileList, "Required")
        .refine((files) => files.length > 0, `Required`),
});
