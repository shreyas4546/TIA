import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const port = process.env.PORT || 5000;

// Initialize the Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post('/api/chat', async (req, res) => {
    try {
        const { message, videoBase64, videoMimeType, chatMode, history } = req.body;

        const parts = [];
        if (videoBase64 && videoMimeType) {
            parts.push({
                inlineData: {
                    mimeType: videoMimeType,
                    data: videoBase64,
                },
            });
        }

        if (message) {
            parts.push({ text: message });
        }

        // Build the history array for Gemini API
        const geminiHistory = Array.isArray(history)
            ? history.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }))
            : [];

        // Append the new message
        geminiHistory.push({ role: 'user', parts });

        let modelName = 'gemini-3.1-flash-lite-preview';
        let config = {
            systemInstruction: 'You are Tia, an AI financial assistant. Help the user track spending, analyze financial behavior, and forecast budgets. Be concise and professional.',
        };

        if (chatMode === 'think') {
            modelName = 'gemini-3.1-pro-preview';
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        } else if (chatMode === 'search') {
            modelName = 'gemini-3-flash-preview';
            config.tools = [{ googleSearch: {} }];
        } else if (videoBase64) {
            modelName = 'gemini-3.1-pro-preview';
            config.thinkingConfig = { thinkingLevel: ThinkingLevel.HIGH };
        }

        // We'll stream the response back
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const responseStream = await ai.models.generateContentStream({
            model: modelName,
            contents: geminiHistory,
            config,
        });

        for await (const chunk of responseStream) {
            if (chunk.text) {
                res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
            }
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('Chat API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/transcribe', async (req, res) => {
    try {
        const { audioBase64, audioMimeType } = req.body;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [
                {
                    role: 'user',
                    parts: [
                        {
                            inlineData: {
                                mimeType: audioMimeType || 'audio/webm',
                                data: audioBase64,
                            },
                        },
                        { text: 'Transcribe this audio exactly as spoken. Return only the text.' },
                    ],
                },
            ],
        });

        res.json({ text: response.text });
    } catch (error) {
        console.error('Transcription API Error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Backend server running on port ${port}`);
});
