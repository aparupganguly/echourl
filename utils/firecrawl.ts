import FirecrawlApp from "@mendable/firecrawl-js";
import { z } from "zod";

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

const podcastSchema = z.object({
  title: z.string(),
  content: z.string(),
  key_points: z.array(z.string()),
  dates: z.array(z.string()),
  summary: z.string()
});

export async function extractFromUrls(urls: string[]) {
  try {
    console.log('Starting extraction with URLs:', urls);

    // Validate URLs
    urls.forEach(url => {
      try {
        new URL(url);
      } catch (e) {
        throw new Error(`Invalid URL: ${url}`);
      }
    });

    const scrapeResult = await firecrawl.extract(urls, {
      prompt: "Extract news, updates, and announcements suitable for a podcast. Include the main title, content details, key points, relevant dates, and a brief summary.",
      schema: podcastSchema
    });

    if (!scrapeResult.success) {
      console.error("Extraction failed:", scrapeResult.error);
      throw new Error(scrapeResult.error);
    }

    console.log("Successful extraction:", scrapeResult.data);
    return scrapeResult.data;
  } catch (error) {
    console.error('Extraction error:', error);
    throw error;
  }
}