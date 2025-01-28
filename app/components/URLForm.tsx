import { useState } from "react";

export default function URLForm({ onSubmit }: { onSubmit: (urls: string[]) => void }) {
  const [urlInput, setUrlInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const urls = urlInput
      .split(",")
      .map(url => url.trim())
      .filter(url => url.length > 0);
    onSubmit(urls);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium text-gray-700">
            Enter URLs (comma-separated)
          </label>
          <input
            id="urls"
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com, https://another-example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Generate Podcast
        </button>
      </div>
    </form>
  );
}
