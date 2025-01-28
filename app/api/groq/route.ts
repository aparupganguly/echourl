import { NextResponse } from "next/server";
import { createPodcastScript } from "@/utils/groq";

export async function POST(req: Request) {
  try {
    const { data } = await req.json();
    console.log("Received data for script generation:", data);

    if (!data) {
      return NextResponse.json(
        { success: false, error: "Invalid or empty data provided." },
        { status: 400 }
      );
    }

    const podcastScript = await createPodcastScript(data);
    console.log("Generated script:", podcastScript);

    return NextResponse.json({ success: true, script: podcastScript });
  } catch (error: any) {
    console.error("Detailed API error:", {
      message: error.message,
      stack: error.stack,
      details: error
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to generate the podcast script.",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}
