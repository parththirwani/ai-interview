import express from "express";
import { preInterview } from "./schema";
import axios from "axios";
import cors from "cors"
import { prisma } from "./db"
import { initSideband } from "./sideband";

const app = express()
app.use(express.json())
app.use(cors())

app.use(express.text({ type: ["application/sdp", "text/plain"] }));

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

    const githubData = userRepos.data.map((x: any) => ({
      description: x.description,
      name: x.name,
      fullName: x.full_name,
      starCount: x.stargazers_count
    }))

    const interview = await prisma.interview.create({
      data: {
        githubMetadata: JSON.stringify(githubData),
        status: "Pre"
      }
    })

    res.status(200).json({ id: interview.id })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch GitHub repos" })
  }
})

app.post("/api/v1/session/:interviewId", async (req, res) => {
  const sessionConfig = JSON.stringify({
    type: "realtime",
    model: "gpt-realtime-2.1",
    audio: { output: { voice: "marin" } },
  });

  const fd = new FormData();
  fd.set("sdp", req.body);
  fd.set("session", sessionConfig);

  try {
    const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "OpenAI-Safety-Identifier": "hashed-user-id",
      },
      body: fd,
    });

    // Location: /v1/realtime/calls/rtc_123456
    const location = sdpResponse.headers.get("Location");
    const callId = location?.split("/").pop()!;
    console.log(callId);

    // Send back the SDP we received from the OpenAI REST API
    const sdp = await sdpResponse.text();
    res.send(sdp);
    initSideband(callId, req.params.interviewId)

  } catch (error) {
    console.error("Token generation error:", error);
    res.status(500).json({ error: "Failed to generate token" });
  }
})

app.listen(3001)