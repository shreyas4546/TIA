import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, Zap, Brain, Globe, Video, X, Mic } from "lucide-react";
import { GoogleGenAI, ThinkingLevel, type GenerateContentResponse } from "@google/genai";
import Markdown from "react-markdown";
import { GlassCard } from "./ui/GlassCard";
import { GlowButton } from "./ui/GlowButton";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

type Message = {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  hasVideo?: boolean;
};

type ChatMode = "fast" | "think" | "search";

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm Tia, your AI financial assistant. How can I help you today?",
      sender: "ai",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<ChatMode>("fast");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  
  // Use a ref for the container to scroll IT, not the window
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      const { scrollHeight, clientHeight } = scrollContainerRef.current;
      const maxScrollTop = scrollHeight - clientHeight;
      
      scrollContainerRef.current.scrollTo({
        top: maxScrollTop > 0 ? maxScrollTop : 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith('video/')) {
        setSelectedVideo(file);
      } else {
        alert("Please select a video file.");
      }
    }
  };

  const fileToBase64 = (file: File | Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the Data-URL declaration (e.g. "data:video/mp4;base64,")
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleAudioTranscription(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioTranscription = async (audioBlob: Blob) => {
    setIsTyping(true);
    try {
      const base64Audio = await fileToBase64(audioBlob);
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: audioBlob.type || "audio/webm",
                  data: base64Audio
                }
              },
              { text: "Transcribe this audio exactly as spoken. Return only the text." }
            ]
          }
        ]
      });

      const text = response.text;
      if (text) {
        setInput((prev) => (prev ? prev + " " + text : text));
      }
    } catch (error) {
      console.error("Transcription error:", error);
      alert("Failed to transcribe audio.");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !selectedVideo) || isTyping) return;

    const userText = input;
    const hasVideo = !!selectedVideo;
    const currentVideo = selectedVideo; // Capture for processing

    const userMsg: Message = {
      id: Date.now().toString(),
      text: userText || (hasVideo ? "[Video Uploaded]" : ""),
      sender: "user",
      timestamp: new Date(),
      hasVideo: hasVideo,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSelectedVideo(null);
    setIsTyping(true);

    try {
      // Prepare history - simplified for this demo to just text context
      // In a real app, you'd want to persist multimodal history carefully
      const history = messages.slice(1).map(m => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }]
      }));
      
      const parts: any[] = [];
      
      if (currentVideo) {
        const base64Video = await fileToBase64(currentVideo);
        parts.push({
          inlineData: {
            mimeType: currentVideo.type,
            data: base64Video
          }
        });
      }
      
      if (userText) {
        parts.push({ text: userText });
      }

      history.push({ role: "user", parts });

      let modelName = "gemini-3.1-flash-lite-preview";
      let config: any = {
        systemInstruction: "You are Tia, an AI financial assistant. Help the user track spending, analyze financial behavior, and forecast budgets. Be concise and professional.",
      };

      if (chatMode === "think") {
        modelName = "gemini-3.1-pro-preview";
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
      } else if (chatMode === "search") {
        modelName = "gemini-3-flash-preview";
        config.tools = [{ googleSearch: {} }];
      } else if (currentVideo) {
        // MUST use Pro for video understanding
        modelName = "gemini-3.1-pro-preview";
      }

      const responseStream = await ai.models.generateContentStream({
        model: modelName,
        contents: history,
        config,
      });

      const aiMsgId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: aiMsgId, text: "", sender: "ai", timestamp: new Date() },
      ]);

      let fullText = "";
      for await (const chunk of responseStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === aiMsgId ? { ...msg, text: fullText } : msg
            )
          );
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Sorry, I encountered an error processing your request.",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <section className="py-24 relative z-10" id="assistant">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4 text-white">
            Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-purple to-accent-blue">AI Assistant</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Ask questions about your finances in natural language and get instant, personalized insights.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard className="flex flex-col h-[600px] overflow-hidden p-0" hoverEffect={false}>
            {/* Chat Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center relative shadow-lg shadow-accent-purple/20">
                  <Bot className="w-5 h-5 text-white" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0B0F19] rounded-full animate-pulse"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white flex items-center gap-2">
                    Tia Assistant <Sparkles className="w-4 h-4 text-accent-cyan" />
                  </h3>
                  <p className="text-xs text-green-400 font-medium">Online & Ready</p>
                </div>
              </div>
              
              <div className="flex items-center gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
                <button onClick={() => setChatMode('fast')} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${chatMode === 'fast' ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}><Zap className="w-3 h-3"/> Fast</button>
                <button onClick={() => setChatMode('think')} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${chatMode === 'think' ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30 shadow-[0_0_10px_rgba(139,92,246,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}><Brain className="w-3 h-3"/> Deep Think</button>
                <button onClick={() => setChatMode('search')} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all duration-200 ${chatMode === 'search' ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'}`}><Globe className="w-3 h-3"/> Search</button>
              </div>
            </div>

            {/* Chat Messages */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-md ${msg.sender === "user" ? "bg-white/10 border border-white/10" : "bg-gradient-to-br from-accent-purple to-accent-blue"}`}>
                      {msg.sender === "user" ? <User className="w-4 h-4 text-gray-300" /> : <Bot className="w-4 h-4 text-white" />}
                    </div>
                    
                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.sender === "user" ? "bg-accent-purple/20 border border-accent-purple/20 text-white rounded-tr-sm backdrop-blur-sm" : "bg-white/5 border border-white/10 text-gray-200 rounded-tl-sm backdrop-blur-sm"}`}>
                      {msg.hasVideo && (
                        <div className="mb-2 flex items-center gap-2 text-xs bg-black/30 p-2 rounded-lg border border-white/5">
                          <Video className="w-4 h-4 text-accent-cyan" />
                          <span>Video Attachment</span>
                        </div>
                      )}
                      <div className="leading-relaxed prose prose-invert prose-sm max-w-none">
                        <Markdown>{msg.text}</Markdown>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-2 block text-right">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center flex-shrink-0 shadow-md">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-1 backdrop-blur-sm">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-accent-purple rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-accent-blue rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-accent-cyan rounded-full" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
              {selectedVideo && (
                <div className="mb-3 flex items-center gap-2 bg-accent-purple/10 border border-accent-purple/30 p-2 rounded-lg w-fit">
                  <Video className="w-4 h-4 text-accent-purple" />
                  <span className="text-xs text-gray-300 max-w-[200px] truncate">{selectedVideo.name}</span>
                  <button onClick={() => setSelectedVideo(null)} className="hover:text-white text-gray-400"><X className="w-3 h-3" /></button>
                </div>
              )}
              <form onSubmit={handleSend} className="relative flex items-center gap-3">
                <input 
                  type="file" 
                  accept="video/*" 
                  ref={fileInputRef} 
                  className="hidden" 
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-accent-purple/50 transition-all duration-200 flex-shrink-0"
                  title="Upload Video"
                >
                  <Video className="w-5 h-5" />
                </button>
                
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all duration-200 flex-shrink-0 ${isRecording ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.4)]" : "bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/10 hover:border-accent-purple/50"}`}
                  title={isRecording ? "Stop Recording" : "Record Audio"}
                >
                  <Mic className="w-5 h-5" />
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isRecording ? "Recording..." : (selectedVideo ? "Ask about this video..." : "Ask Tia about your finances...")}
                  className="w-full bg-black/20 border border-white/10 rounded-full py-3.5 pl-6 pr-14 text-white placeholder:text-gray-500 focus:outline-none focus:border-accent-purple/50 focus:bg-black/40 transition-all duration-200"
                  disabled={isTyping || isRecording}
                />
                
                <div className="absolute right-2">
                  <GlowButton
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={(!input.trim() && !selectedVideo) || isTyping || isRecording}
                    className="!rounded-full !w-9 !h-9 !p-0 flex items-center justify-center"
                  >
                    <Send className="w-4 h-4" />
                  </GlowButton>
                </div>
              </form>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}

