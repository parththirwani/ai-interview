import express from "express";
import { preInterview } from "./schema";
import axios from "axios";

const app = express()
app.use(express.json())

app.post("api/v1/pre-interview", async (req,res)=>{
    const {success, data } = preInterview.safeParse(req.body)

    if(!success){
        res.status(411).json({
            message: "Incorrect urls"
        })
        return
    }

    const githubUrl = data.githubUrl.endsWith("/") ? data.githubUrl.slice(0,-1) : data.githubUrl
    const linkedinUrl = data.linkedinUrl.endsWith("/") ? data.linkedinUrl.slice(0,-1) : data.linkedinUrl

    const githubUsername = "parththirwani";
    const linkedinUsername = linkedinUrl.split("/").pop();

    const userRepos = await axios.post(`https://api.github/users/${githubUsername}/repos`)

    const filteredResponse = userRepos.data.map((x:any)=>({
        description: x.description,
        name: x.name,
        fullName: x.full_name,
        starCount: x.stargazers_count
    }))

    console.log(filteredResponse)
})

app.listen(3001)