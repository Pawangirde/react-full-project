import React, { useState } from "react";
import { Sparkles, MessageCircle, Loader2, Trash } from "lucide-react";

const OPENROUTER_API_KEY =
  "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";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export default function AIWidgets() {
  const [imagePrompt, setImagePrompt] = useState("");
  const [generatedImage, setGeneratedImage] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [qnaInput, setQnaInput] = useState("");
  const [qnaResponse, setQnaResponse] = useState(null);
  const [isAnswering, setIsAnswering] = useState(false);

  const generateImage = async () => {
    if (!imagePrompt.trim()) return;

    setIsGenerating(true);

    await new Promise((res) => setTimeout(res, 1500));

    const key = imagePrompt.toLowerCase();

    let selectedImage = null;

    const imageCollections = {
      car: [
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
        "https://images.unsplash.com/photo-1502877338535-766e1452684a",
        "https://images.unsplash.com/photo-1511396274084-7449f2a8e1c0",
      ],
      mountain: [
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      ],
      cat: [
        "https://images.unsplash.com/photo-1518791841217-8f162f1e1131",
        "https://images.unsplash.com/photo-1511044568932-338cba0ad803",
        "https://images.unsplash.com/photo-1494253109108-2e30c049369b",
      ],
      city: [
        "https://images.unsplash.com/photo-1467269204594-9661b134dd2b",
        "https://images.unsplash.com/photo-1461716834623-60f89b5cb8fb",
        "https://images.unsplash.com/photo-1464297162577-f5295c892a22",
      ],
      nature: [
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1500534623283-312aade485b7",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
      ],
    };

    if (imageCollections[key]) {
      const arr = imageCollections[key];
      selectedImage = arr[Math.floor(Math.random() * arr.length)];
    } else {
      selectedImage = `https://source.unsplash.com/featured/?${encodeURIComponent(
        imagePrompt
      )}`;
    }

    setGeneratedImage(selectedImage);
    setIsGenerating(false);
  };

  //   Here im getting response Q&A using OpenRouter
  function cleanMarkdown(text) {
    if (!text) return "";

    return text
      .replace(/[*#`>/\\]/g, "")
      .replace(/\|/g, " ")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/\n+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  function limitTo100Words(text) {
    return text.split(" ").slice(0, 100).join(" ");
  }

  const handleQNA = async () => {
    if (!qnaInput.trim()) return;
    setIsAnswering(true);

    try {
      const response = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-oss-20b:free",
          messages: [
            {
              role: "user",
              content: qnaInput + ". Give answer in simple 100 words.",
            },
          ],
        }),
      });

      const data = await response.json();
      console.log("QNA DATA:", data);

      let reply =
        data?.choices?.[0]?.message?.content ||
        "Sorry, I couldn't generate an answer.";

      reply = cleanMarkdown(reply);

      reply = limitTo100Words(reply);

      setQnaResponse(reply);
      setQnaInput("");
    } catch (error) {
      console.error("QNA ERROR:", error);
      alert("OpenRouter request failed.");
    }

    setIsAnswering(false);
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="border rounded-xl shadow bg-white">
        <div className="p-4 border-b">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sparkles className="w-5 h-5" /> AI Image Generator
          </h2>
          <p className="text-sm text-gray-600">
            Unsplash-based image generator
          </p>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Describe an image..."
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generateImage()}
            />

            <button
              onClick={generateImage}
              disabled={isGenerating || !imagePrompt.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Generate"
              )}
            </button>
          </div>

          {generatedImage && (
            <div className="relative space-y-2">
              <button
                onClick={() => setGeneratedImage(null)}
                className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-700"
              >
                <Trash className="w-4 h-4" />
              </button>

              <img
                src={generatedImage}
                alt="Generated"
                className="w-full h-80 object-cover rounded-lg border"
              />
            </div>
          )}

          {!generatedImage && !isGenerating && (
            <div className="h-80 border-2 border-dashed rounded-lg flex items-center justify-center text-gray-500">
              Describe something to generate an image.
            </div>
          )}
        </div>
      </div>

      {/*This is Q&A ASSISTANT logic here */}
      <div className="border rounded-xl shadow bg-white">
        <div className="p-4 border-b">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MessageCircle className="w-5 h-5" /> AI Q&A Assistant
          </h2>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Ask something..."
              value={qnaInput}
              disabled={isAnswering}
              onChange={(e) => setQnaInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQNA()}
            />

            <button
              onClick={handleQNA}
              disabled={isAnswering || !qnaInput.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {isAnswering ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Ask"
              )}
            </button>
          </div>

          {qnaResponse && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-gray-800 text-sm">{qnaResponse}</p>
            </div>
          )}

          {!qnaResponse && !isAnswering && (
            <div className="p-4 border border-dashed rounded text-center text-gray-500">
              Try asking: “What is React?”
            </div>
          )}

          {isAnswering && (
            <div className="p-4 rounded-lg border flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
              Thinking...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
