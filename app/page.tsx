"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useRef, useEffect } from "react";
import { Send, Bot, Sparkles, Zap, Loader2, User } from "lucide-react"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export default function Home() {
  // 1. STATE MANAGEMENT
  const [messages, setMessages] = useState<any[]>([
    { role: "assistant", content: "Hello! I am Nexus. I can browse the web and generate live reports for you." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [canvasData, setCanvasData] = useState<any>(null);
  
  // Ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 2. AUTO-SCROLL LOGIC (Triggers on every new message)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // 3. SEND MESSAGE LOGIC
  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsLoading(true); // Start Thinking

    try {
      // 👇 THIS IS THE CLOUD URL
      const API_URL = "https://nexus-backend-193226167127.us-central1.run.app";
      
      const response = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let isFirstChunk = true;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((line) => line.trim() !== "");

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            
            if (json.type === "message") {
              const assistantMessage = typeof json.content === "string" ? json.content : JSON.stringify(json.content);

              // --- FIRST CHUNK LOGIC ---
              if (isFirstChunk) {
                setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
                isFirstChunk = false;
              }

              // --- UI COMPONENT DETECTION ---
              if (assistantMessage.includes("<UI_COMPONENT>")) {
                const parts = assistantMessage.split("<UI_COMPONENT>");
                const textPart = parts[0].trim(); // Get the summary text
                const jsonPart = parts[1].split("</UI_COMPONENT>")[0];

                // Update Text Stream (Ensure we don't wipe out the text!)
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  const lastMsgIndex = newMsgs.length - 1;
                  // If there is text, show it. If empty, keep what we have or show a default.
                  const newContent = textPart.length > 0 ? textPart : (newMsgs[lastMsgIndex].content || "Here is the requested data:");
                  newMsgs[lastMsgIndex] = { ...newMsgs[lastMsgIndex], content: newContent }; 
                  return newMsgs;
                });

                // Update Canvas (Chart/Table)
                try {
                  const uiData = JSON.parse(jsonPart);
                  setCanvasData(uiData);
                } catch (e) {
                  console.error("Failed to parse UI JSON", e);
                }
              } else {
                // Normal Text Stream
                setMessages((prev) => {
                  const newMsgs = [...prev];
                  // Safety check to ensure we have a message to update
                  if (newMsgs.length > 0) {
                      const lastMsgIndex = newMsgs.length - 1;
                      newMsgs[lastMsgIndex] = { ...newMsgs[lastMsgIndex], content: assistantMessage };
                  }
                  return newMsgs;
                });
              }
            }
          } catch (e) {
            console.error("Error parsing stream", e);
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "Error connecting to Nexus Brain." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      {/* --- LEFT PANEL: CHAT --- */}
      <div className="w-1/2 flex flex-col border-r border-zinc-800 h-full">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900/50 shrink-0">
          <Bot className="w-6 h-6 text-emerald-400" />
          <h1 className="font-semibold text-lg tracking-tight">Nexus Engine</h1>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              
              {/* Avatar Logic */}
              {msg.role === "assistant" ? (
                <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 shrink-0 order-2">
                  <User className="w-4 h-4 text-zinc-400" />
                </div>
              )}

              {/* Message Bubble - Hide if empty content to avoid "Ghost Bubbles" */}
              {msg.content.trim() !== "" && (
                 <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                  msg.role === "user" 
                    ? "bg-zinc-100 text-zinc-900 font-medium order-1" 
                    : "bg-zinc-800/50 text-zinc-300 border border-zinc-700/50"
                }`}>
                  <ReactMarkdown>{typeof msg.content === 'string' ? msg.content : ''}</ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {/* THINKING INDICATOR FIX: Shows ONLY when loading & waiting for first token */}
          {isLoading && (messages.length === 0 || messages[messages.length - 1].role === "user") && (
            <div className="flex gap-4 justify-start animate-in fade-in duration-300">
               <div className="w-8 h-8 rounded-full bg-emerald-900/30 flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
               </div>
               <div className="bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 p-3 rounded-lg text-sm flex items-center gap-2">
                  <span className="animate-pulse">Thinking...</span>
               </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-zinc-900/50 border-t border-zinc-800 shrink-0">
          <div className="relative">
            <Input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask Nexus anything..." 
              className="bg-zinc-950 border-zinc-700 text-zinc-100 pr-12 py-6 focus-visible:ring-emerald-500"
              disabled={isLoading}
            />
            <Button 
              onClick={sendMessage}
              size="icon" 
              className="absolute right-1 top-1 bg-emerald-600 hover:bg-emerald-500 text-white"
              disabled={isLoading}
            >
              {isLoading ? <Zap className="w-4 h-4 animate-pulse" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* --- RIGHT PANEL: LIVE CANVAS --- */}
      <div className="w-1/2 bg-zinc-950 p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-4 shrink-0">
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Live Canvas</h2>
        </div>

        <Card className="flex-1 bg-zinc-900/30 border-zinc-800 border-dashed flex flex-col items-center justify-center text-zinc-500 overflow-hidden p-4 relative h-full">
          {!canvasData ? (
             <div className="text-center">
              <p>Generative UI Content will appear here.</p>
              <p className="text-xs mt-2 opacity-50">(Try asking: "Compare iPhone 16 vs Pixel 9")</p>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-start justify-start animate-in fade-in zoom-in duration-300 overflow-auto">
              <div className="bg-emerald-950/30 text-emerald-400 px-3 py-1 rounded-full text-xs mb-4 border border-emerald-500/20 shrink-0">
                Generated Artifact: {canvasData.type}
              </div>
              <h3 className="text-xl font-bold text-zinc-100 mb-4 shrink-0">{canvasData.title}</h3>
              
              {/* RENDER TABLE */}
              {canvasData.type === 'table' && (
                <div className="w-full overflow-auto rounded-lg border border-zinc-700">
                   <table className="w-full text-sm text-left">
                    <thead className="bg-zinc-800 text-zinc-400 uppercase">
                      <tr>
                        {canvasData.data.headers.map((h:any, i:number) => <th key={i} className="px-6 py-3 whitespace-nowrap">{h}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      {canvasData.data.rows.map((row:any[], i:number) => (
                        <tr key={i} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                          {row.map((cell, j) => <td key={j} className="px-6 py-4 text-zinc-300">{cell}</td>)}
                        </tr>
                      ))}
                    </tbody>
                   </table>
                </div>
              )}

              {/* RENDER BAR CHART */}
              {canvasData.type === 'bar_chart' && (
                <div className="w-full h-96 mt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={canvasData.data}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="label" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', color: '#f4f4f5' }} 
                        itemStyle={{ color: '#10b981' }}
                        cursor={{ fill: '#27272a' }}
                      />
                      <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}