"use client";

import { useState } from 'react';
import URLForm from '@/app/components/URLForm';
import Header from '@/app/components/Header';
import ScriptDisplay from "@/app/components/ScriptDisplay"

export default function HomePage() {
  const [script, setScript] = useState<string>("");
  const [audioUrl, setAudioUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async (urls: string[]) => {
    try {
      // 1. Extract data
      const extractRes = await fetch('/api/firecrawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ urls })
      });
      const extractedData = await extractRes.json();
      
      if (!extractedData.success) throw new Error(extractedData.error);
      console.log("Extracted data:", extractedData.data);

      // 2. Generate script
      const scriptRes = await fetch('/api/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: extractedData.data })
      });
      const scriptData = await scriptRes.json();
      
      if (!scriptData.success) throw new Error(scriptData.error);
      console.log("Generated script:", scriptData.script);

      // Store script first
      setScript(scriptData.script);

      // 3. Generate audio
      const audioRes = await fetch('/api/elevenlabs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: scriptData.script })
      });
      const audioData = await audioRes.json();
      
      if (!audioData.success) throw new Error(audioData.error);
      console.log("Generated audio:", audioData.audio);

      return {
        script: scriptData.script,
        audio: audioData.audio
      };
    } catch (error: any) {
      console.error('Generation error:', error);
      throw error;
    }
  };

  const handleSubmit = async (urls: string[]) => {
    setLoading(true);
    setError("");
    try {
      const result = await handleGenerate(urls);
      setScript(result.script);
      setAudioUrl(result.audio);
    } catch (error: any) {
      console.error("Error:", error);
      setError(error.message || "An error occurred during generation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parent">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <URLForm onSubmit={handleSubmit} />
        {loading && (
          <div className="text-center py-4">
            <p>Generating podcast...</p>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded my-4">
            {error}
          </div>
        )}
        <ScriptDisplay script={script} audioUrl={audioUrl} />
      </main>
    </div>
  );
}
