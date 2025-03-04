"use client";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion"; // For smooth animations
import gsap from "gsap";

export default function HomePage() {
  const [urls, setUrls] = useState<string>("");
  const [script, setScript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const podcastRef = useRef(null);

  useEffect(() => {
    if (script) {
      gsap.fromTo(
        podcastRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );
    }
  }, [script]);

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
    <div className="min-h-screen flex flex-col items-center ">

      <main className="flex-1 w-full max-w-3xl p-6">
        <div className="">
          <h2 className="heading">Enter URLs to Generate a Podcast</h2>
          <div className="Input-Container">
            <textarea
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              placeholder="Enter URLs separated by commas..."
              className="w-full h-24 p-3"
            />
            <button onClick={handleGenerate} disabled={loading}>
              {!loading && <SparklesIcon className="w-5 h-5 text-gray-700" />}
              {loading ? "Generating..." : "Generate Now"}
            </button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className=" "
            >
              {error}
            </motion.div>
          )}
        </div>

        {script && (
          <div ref={podcastRef} className="mt-6 shadow-xl rounded-lg p-6 border border-gray-800 rounded-lg">
            <h3 className="text-lg font-medium text-white mb-2">
              Generated Podcast:
            </h3>
            {audioUrl && (
              <audio controls src={audioUrl} className="mt-4 mb-4 w-full ">
                Your browser does not support the audio element.
              </audio>
            )}
            <h3 className="text-lg font-medium text-white mb-2">
              Generated Script:
            </h3>
            <p className="text-gray-400 whitespace-pre-wrap">{script}</p>
          </div>
        )}
      </main>
    </div>
  );
}
