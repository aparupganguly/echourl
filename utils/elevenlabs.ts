import { ElevenLabsClient } from "elevenlabs";
import { v4 as uuid } from "uuid";
import { createWriteStream, mkdirSync, existsSync } from "fs";
import path from "path";

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!
});

export async function createAudioFileFromText(text: string): Promise<string> {
  try {
    if (!text || typeof text !== "string") {
      throw new Error("Invalid text provided for audio generation.");
    }

    console.log("Generating audio for text length:", text.length);
    console.log("First 100 characters:", text.substring(0, 100));

    const audio = await elevenlabs.generate({
      text,
      voice_id: "21m00Tcm4TlvDq8ikWAM", // Rachel's voice ID
      model_id: "eleven_turbo_v2",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75
      }
    });

    const fileName = `${uuid()}.mp3`;
    const dirPath = path.join(process.cwd(), 'public', 'audio');
    const filePath = path.join(dirPath, fileName);

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    const fileStream = createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      if (!audio || !audio.pipe) {
        reject(new Error("Invalid audio stream received"));
        return;
      }

      audio.pipe(fileStream);

      fileStream.on("finish", () => {
        console.log("Audio file created:", fileName);
        resolve(`/audio/${fileName}`);
      });

      fileStream.on("error", (error) => {
        console.error("Error writing audio file:", error);
        reject(new Error("Failed to save audio file"));
      });

      audio.on('error', (error) => {
        console.error("Error in audio stream:", error);
        reject(new Error("Audio stream error"));
      });
    });
  } catch (error) {
    console.error("Error generating audio:", error);
    throw error;
  }
}