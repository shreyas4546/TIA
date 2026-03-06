import { useState, useRef, useEffect, type FormEvent, type ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, Bot, User, Sparkles, Zap, Brain, Globe, Video, X, Mic } from "lucide-react";
import { GoogleGenAI, ThinkingLevel, type GenerateContentResponse } from "@google/genai";
import Markdown from "react-markdown";

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
    <section className="py-24 bg-brand-surface/30 relative z-10" id="assistant">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">
            Interactive <span className="text-gradient">AI Assistant</span>
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
          className="glass-card flex flex-col h-[600px] overflow-hidden"
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center relative">
                <Bot className="w-5 h-5 text-white" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0B0F19] rounded-full"></div>
              </div>
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Tia Assistant <Sparkles className="w-4 h-4 text-accent-cyan" />
                </h3>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-[#0B0F19] p-1 rounded-xl border border-brand-border">
              <button onClick={() => setChatMode('fast')} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${chatMode === 'fast' ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/30' : 'text-gray-400 hover:bg-brand-surface'}`}><Zap className="w-3 h-3"/> Fast</button>
              <button onClick={() => setChatMode('think')} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${chatMode === 'think' ? 'bg-accent-purple/20 text-accent-purple border border-accent-purple/30' : 'text-gray-400 hover:bg-brand-surface'}`}><Brain className="w-3 h-3"/> Deep Think</button>
              <button onClick={() => setChatMode('search')} className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors ${chatMode === 'search' ? 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30' : 'text-gray-400 hover:bg-brand-surface'}`}><Globe className="w-3 h-3"/> Search</button>
            </div>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-brand-border scrollbar-track-transparent"
          >
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  className={`flex gap-4 ${msg.sender === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === "user" ? "bg-brand-surface border border-brand-border" : "bg-gradient-to-br from-accent-purple to-accent-blue"}`}>
                    {msg.sender === "user" ? <User className="w-4 h-4 text-gray-300" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>
                  
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === "user" ? "bg-accent-purple/20 text-white rounded-tr-sm" : "bg-brand-surface border border-brand-border text-gray-200 rounded-tl-sm"}`}>
                    {msg.hasVideo && (
                      <div className="mb-2 flex items-center gap-2 text-xs bg-black/20 p-2 rounded-lg">
                        <Video className="w-4 h-4" />
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
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-brand-surface border border-brand-border rounded-2xl rounded-tl-sm p-4 flex items-center gap-1">
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 bg-gray-400 rounded-full" />
                </div>
              </motion.div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 border-t border-brand-border bg-brand-surface/50">
            {selectedVideo && (
              <div className="mb-3 flex items-center gap-2 bg-accent-purple/10 border border-accent-purple/30 p-2 rounded-lg w-fit">
                <Video className="w-4 h-4 text-accent-purple" />
                <span className="text-xs text-gray-300 max-w-[200px] truncate">{selectedVideo.name}</span>
                <button onClick={() => setSelectedVideo(null)} className="hover:text-white text-gray-400"><X className="w-3 h-3" /></button>
              </div>
            )}
            <form onSubmit={handleSend} className="relative flex items-center gap-2">
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
                className="w-10 h-10 rounded-full bg-brand-surface border border-brand-border flex items-center justify-center text-gray-400 hover:text-white hover:border-accent-purple transition-colors flex-shrink-0"
                title="Upload Video"
              >
                <Video className="w-5 h-5" />
              </button>
              
              <button
                type="button"
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 ${isRecording ? "bg-red-500/20 border-red-500 text-red-500 animate-pulse" : "bg-brand-surface border-brand-border text-gray-400 hover:text-white hover:border-accent-purple"}`}
                title={isRecording ? "Stop Recording" : "Record Audio"}
              >
                <Mic className="w-5 h-5" />
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isRecording ? "Recording..." : (selectedVideo ? "Ask about this video..." : "Ask Tia about your finances...")}
                className="w-full bg-[#0B0F19] border border-brand-border rounded-full py-4 pl-6 pr-14 text-white focus:outline-none focus:border-accent-purple transition-colors"
                disabled={isTyping || isRecording}
              />
              <button
                type="submit"
                disabled={(!input.trim() && !selectedVideo) || isTyping || isRecording}
                className="absolute right-2 w-10 h-10 rounded-full bg-accent-purple flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-blue transition-colors"
              >
                <Send className="w-4 h-4 ml-1" />
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
