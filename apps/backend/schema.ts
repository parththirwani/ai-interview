import {z} from "zod"

export const preInterview = z.object({
    githubUrl : z.string()
})