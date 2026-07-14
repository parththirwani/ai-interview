import { BACKEND_URL } from "@/config";
import { useEffect, useRef } from "react"
import { useParams } from "react-router"

export function Interview() {
    const { interviewId } = useParams();
    const audioRef = useRef<HTMLAudioElement>(null)

    useEffect(() => {
        const initializeInterview = async () => {
            try {
                console.log(`Initializing interview: ${interviewId}`);
                
                // Create a peer connection
                const pc = new RTCPeerConnection();

                // Set up to play remote audio from the model
                audioRef.current = document.createElement("audio");
                audioRef.current.autoplay = true;
                pc.ontrack = (e) => (audioRef.current!.srcObject = e.streams[0]!);

                // Add local audio track for microphone input in the browser
                const ms = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                pc.addTrack(ms.getTracks()[0]!);

                // Start the session using the Session Description Protocol (SDP)
                const offer = await pc.createOffer();
                await pc.setLocalDescription(offer);

                console.log(`Calling session API at: ${BACKEND_URL}/api/v1/session`);
                const sdpResponse = await fetch(`${BACKEND_URL}/api/v1/session/${interviewId}`, {
                    method: "POST",
                    body: offer.sdp,
                    headers: {
                        "Content-Type": "application/sdp",
                    },
                });

                if (!sdpResponse.ok) {
                    throw new Error(`Session API responded with status: ${sdpResponse.status}`);
                }

                const answer = {
                    type: "answer" as "answer",
                    sdp: await sdpResponse.text(),
                };
                await pc.setRemoteDescription(answer);
                
                console.log("Interview session established successfully");
            } catch (error) {
                console.error("Error initializing interview:", error);
            }
        };

        if (interviewId) {
            initializeInterview();
        }
    }, [interviewId])

    return <div>
        Interview
    </div>
}