
import React, { useState, useEffect, useRef } from "react";
import { MessageCircle, Loader2 } from "lucide-react";

export default function AIChat() {
  const [input, setInput] = useState("");
  const [chat, setChat] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();


  function cleanText(text) {
    return text
      ?.replace(/\*/g, "")
      .replace(/-/g, "")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function extractNamesFromText(text) {
    if (!text) return [];
    const matches = text.match(/[A-Z][a-z]+\s[A-Z][a-z]+/g);
    return matches ? [...new Set(matches)] : [];
  }


  useEffect(() => {
    async function loadHistory() {
      try {
        const res = await fetch("http://localhost:4000/api/ask/history");
        const data = await res.json();
        setChat(data.history || []);
      } catch (err) {
        console.log("Error loading history", err);
      }
    }
    loadHistory();
  }, []);


  const ask = async () => {
    if (!input.trim()) return;

    setLoading(true);

    const res = await fetch("http://localhost:4000/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: input }),
    });

    const data = await res.json();

    setChat(data.history || []);

   
    const cleanedAnswer = cleanText(data.answer);
    const extractedNames = extractNamesFromText(cleanedAnswer);

    const filteredEmployees = (data.results || []).filter((emp) =>
      extractedNames.includes(emp.name)
    );

    setResults(filteredEmployees);
    setInput("");
    setLoading(false);

    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="max-w mx-auto">
      <div className="border rounded-xl shadow bg-white mt-6">

   
        <div className="p-4 border-b">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <MessageCircle className="w-5 h-5" /> Employee Q&A Assistant
          </h2>
        </div>

        <div className="p-4 space-y-4">

         
          <div className="h-[350px] overflow-y-auto border p-3 rounded-lg bg-gray-50 space-y-3">
            {chat.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-3 rounded-xl ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-900"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 p-3 rounded-xl flex gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Thinking…
                </div>
              </div>
            )}

            <div ref={bottomRef}></div>
          </div>

       
          {results.length > 0 && (
            <div className="overflow-auto border rounded-lg mt-3">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-gray-200 text-gray-700">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Role</th>
                    <th className="p-2">Department</th>
                    <th className="p-2">Location</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((emp, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2">{emp.name}</td>
                      <td className="p-2">{emp.role}</td>
                      <td className="p-2">{emp.department}</td>
                      <td className="p-2">{emp.location}</td>
                      <td className="p-2">{emp.email}</td>
                      <td className="p-2">{emp.phone}</td>
                      <td className="p-2">{emp.skills?.join(", ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        
          <div className="flex gap-2">
            <input
              className="flex-1 px-3 py-2 border rounded-lg"
              placeholder="Ask something about employees..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && ask()}
            />

            <button
              onClick={ask}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ask"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
