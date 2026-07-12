import {z} from "zod"

export const preInterview = z.object({
    linkedinUrl: z.string(),
    githubUrl : z.string()
})