"use client";

import { useState } from "react";
import { motion } from "framer-motion"; // For smooth animations

export default function HomePage() {
  const [urls, setUrls] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    setLoading(true);
    setError("");

    try {
      const urlArray = urls.split(",").map((url) => url.trim());
      // 1. Extract data
      const extractRes = await fetch("/api/firecrawl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: urlArray }),
      });
      const extractedData = await extractRes.json();
      if (!extractedData.success) throw new Error(extractedData.error);

      // 2. Generate script
      const scriptRes = await fetch("/api/groq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: extractedData.data }),
      });
      const scriptData = await scriptRes.json();
      if (!scriptData.success) throw new Error(scriptData.error);

      setScript(scriptData.script);

      // 3. Generate audio
      const audioRes = await fetch("/api/elevenlabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: scriptData.script }),
      });
      const audioData = await audioRes.json();
      if (!audioData.success) throw new Error(audioData.error);

      setAudioUrl(audioData.audio);
    } catch (err: any) {
      setError(err.message || "An error occurred during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center">
      <header className="py-6 w-full bg-white shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Podcast Generator
        </h1>
      </header>

      <main className="flex-1 w-full max-w-3xl p-6">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Enter URLs to Generate a Podcast
          </h2>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="Enter URLs separated by commas..."
            className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
            }`}
          >
            {loading ? "Generating..." : "Generate Podcast"}
          </button>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}
        </div>

        {script && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-6 bg-white shadow-lg rounded-lg p-6"
          >
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              Generated Script:
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap">{script}</p>

            {audioUrl && (
              <audio controls src={audioUrl} className="mt-4 w-full">
                Your browser does not support the audio element.
              </audio>
            )}
          </motion.div>
        )}
      </main>

      <footer className="py-4 w-full bg-gray-800 text-white text-center">
        <p className="text-sm">&copy; 2025 Podcast Generator. All rights reserved.</p>
      </footer>
    </div>
  );
}
