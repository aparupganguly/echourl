import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!
});

export async function createPodcastScript(extractedData: any) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Transform this extracted data into a natural podcast script with a random host name and no background music, act like you are a host with a random speaker,."
        },
        {
          role: "user",
          content: JSON.stringify(extractedData)
        }
      ],
      model: "llama-3.3-70b-versatile"
    });

    const script = completion.choices[0]?.message?.content;

    if (!script) {
      throw new Error("Failed to generate podcast script.");
    }

    return script;
  } catch (error) {
    console.error("Error in GROQ API:", error);
    throw new Error("Failed to generate podcast script.");
  }
}