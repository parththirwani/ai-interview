import express from "express";
import { preInterview } from "./schema";
import axios from "axios";
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors())

app.post("/api/v1/pre-interview", async (req, res) => {
  const { success, data } = preInterview.safeParse(req.body)

  if (!success) {
    res.status(411).json({
      message: "Incorrect urls"
    })
    return
  }

  const githubUrl = data.githubUrl.endsWith("/") ? data.githubUrl.slice(0, -1) : data.githubUrl
  const githubUsername = githubUrl.split("/").pop();

  try {
    const userRepos = await axios.get(`https://api.github.com/users/${githubUsername}/repos`)

    const filteredResponse = userRepos.data.map((x: any) => ({
      description: x.description,
      name: x.name,
      fullName: x.full_name,
      starCount: x.stargazers_count
    }))

    res.status(200).json(filteredResponse)
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch GitHub repos" })
  }
})

app.listen(3001)