import { useEffect, useRef, useState } from "react";

function App() {
    const [messages, setMessages] = useState([]);
    const wsRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const ws = new WebSocket("ws://localhost:8080");
        ws.onmessage = (event) => {
            // @ts-ignore
            setMessages(m => [...m, event.data])
        }
        // @ts-ignore
        wsRef.current = ws;
        ws.onopen = () => {
            ws.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: "red"
                }
            }))
        }
        return () => {
            // @ts-ignore
            ws.onclose();
        }
    }, []);

    useEffect(() => {
        // @ts-ignore
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    function sendMessage() {
        // @ts-ignore
        const messageInput = document.getElementById("message"); 
        // @ts-ignore
        const message = messageInput?.value;

        if(message?.trim().length > 0) {
            // @ts-ignore
            wsRef.current.send(JSON.stringify({
                type: "chat",
                payload: {
                    message: message
                }
            }))
        }
        if (messageInput) {
            // @ts-ignore
            messageInput.value = ""; 
        }
    }

    return <div className="h-screen bg-black flex flex-col justify-center">
        <span className="text-white font-medium flex tracking-wider text-5xl fixed mt-1 self-center top-0">CHATIFY</span>
        <div className="h-[100vh] text-white mt-16 pb-6 overflow-y-auto">
            {messages.map((message) => (
                <div>
                    <span className="bg-[#415765] px-4 py-1 rounded-md inline-block max-w-96 mt-2 ml-1">{message}
                    </span>
                </div>
                ))}
                <div ref={messagesEndRef} />
        </div>


        <div className="flex justify-center">
            <input id="message" className="px-4 py-1 w-2/4 rounded-md outline-none" type="text" placeholder="Enter your message" onKeyDown={(e) => {
                if(e.key === "Enter") {
                    sendMessage();
                }
            }} />
            <button onClick={sendMessage} className="bg-blue-600 px-4 py-2 rounded-md text-white">Send</button>
        </div>
    </div>
}

export default App;
