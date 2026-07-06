// app/api/elevenlabs/route.jsx
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { text, voiceId = "OUx0z7RTt92glw2BYS4R" } = await request.json();

        if (!text) {
            return NextResponse.json(
                { error: "Missing 'text' field in request body" },
                { status: 400 }
            );
        }

        const client = new ElevenLabsClient({
            apiKey: process.env.ELEVENLABS_API_KEY,
        });

        // Generate audio with the voice
        const audioStream = await client.textToSpeech.convert(
            voiceId, // Your chosen voice ID
            {
                text: text,
                modelId: "eleven_multilingual_v2",
                voiceSettings: {
                    stability: 0.35,      // Lower = more emotional
                    similarityBoost: 0.7,
                    style: 0.4,           // More expressive
                },
            }
        );

        // Convert stream to buffer
        const chunks = [];
        for await (const chunk of audioStream) {
            chunks.push(chunk);
        }
        const audioBuffer = Buffer.concat(chunks);

        return new NextResponse(audioBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-cache',
            },
        });

    } catch (error) {
        console.error('Error generating speech:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to generate speech' },
            { status: 500 }
        );
    }
}