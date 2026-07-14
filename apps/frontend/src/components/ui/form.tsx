import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/config";
import { useNavigate } from "react-router";

export function Form() {
    const [githubUrl, setGithubUrl] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    async function onSubmit(){
        if (!githubUrl){
            toast("Please provide valid github url")
            return
        }

        setIsLoading(true)
        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`,{
                githubUrl
            })

            navigate(`/interview/${response.data.id}`)
        } catch (error) {
            toast("Failed to start interview. Please try again.")
            setIsLoading(false)
        }
    }

    if (isLoading) {
        return <div className="h-screen w-screen flex justify-center items-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold">Preparing your interview...</h2>
                <p className="text-muted-foreground mt-2">This may take a moment</p>
            </div>
        </div>
    }

    return <div className="h-screen w-screen flex justify-center items-center">
        <div>
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                AI Interview Kickstart
            </h2>
            
            <div className="p-2">
                <Input placeholder="Github URL" onChange={e => setGithubUrl(e.target.value)}></Input>
            </div>

            <div className="flex justify-center p-4">
                <Button onClick={onSubmit} disabled={isLoading}>Start Interview</Button>
            </div>

        </div>
    </div>
}
