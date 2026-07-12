import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config";

export function Form() {
    const [linkedinUrl, setLinkedinUrl] = useState("")
    const [githubUrl, setGithubUrl] = useState("")

    async function onSubmit(){
        if (!githubUrl || !linkedinUrl){
            toast("Please provide valid github and linkedin url")
        }

        await axios.post(`${BACKEND_URL}/api/v1/pre-interview`,{
            linkedinUrl,
            githubUrl
        })
    }

    return <div className="h-screen w-screen flex justify-center items-center">
        <div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                AI Interview Kickstart
            </h2>

            <div className="p-2">
                <Input placeholder="Linkedin URL" onChange={e => setLinkedinUrl(e.target.value)}></Input>
            </div>

            <div className="p-2">
                <Input placeholder="Github URL" onChange={e => setGithubUrl(e.target.value)}></Input>
            </div>

            <div className="flex justify-center p-4">
                <Button onClick={onSubmit}>Start Interview</Button>
            </div>

        </div>
    </div>
}