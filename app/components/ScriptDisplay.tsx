export default function ScriptDisplay({ script, audioUrl }: { script: string; audioUrl: string }) {
  return (
    <div className="space-y-6">
      {script && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Generated Script</h2>
          <div className="prose max-w-none">
            <p className="whitespace-pre-wrap">{script}</p>
          </div>
        </div>
      )}
      {audioUrl && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Podcast Audio</h2>
          <audio controls className="w-full" src={audioUrl}></audio>
        </div>
      )}
    </div>
  );
}
