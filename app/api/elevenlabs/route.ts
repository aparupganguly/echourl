import { NextResponse } from "next/server";
import { createAudioFileFromText } from "@/utils/elevenlabs";

export async function POST(req: Request) {
  try {
    const { script } = await req.json();
    console.log("Received script for audio generation - length:", script?.length);

    if (!script || typeof script !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid script format", 
          receivedType: typeof script,
          scriptLength: script?.length 
        },
        { status: 400 }
      );
    }

    const audioFile = await createAudioFileFromText(script);
    console.log("Generated audio file:", audioFile);

    return NextResponse.json({ success: true, audio: audioFile });
  } catch (error: any) {
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      details: error
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate audio",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
