import { NextResponse } from "next/server";
import { extractFromUrls } from "@/utils/firecrawl";

export async function POST(req: Request) {
  try {
    const { urls } = await req.json();
    console.log("Received URLs:", urls);

    if (!Array.isArray(urls) || urls.length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid or empty URLs provided." },
        { status: 400 }
      );
    }

    const extractedData = await extractFromUrls(urls);
    console.log("Extracted data:", extractedData);

    return NextResponse.json({ success: true, data: extractedData });
  } catch (error: any) {
    console.error("Detailed API error:", {
      message: error.message,
      stack: error.stack,
      details: error
    });

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to process the URLs.",
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
}