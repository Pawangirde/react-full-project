const express = require("express");
const router = express.Router();
const EmployeeDetails = require("../models/Employee");
const ChatHistory = require("../models/ChatHistory");
const OpenAI = require("openai");
require("dotenv").config();

const client = new OpenAI({
  apiKey:"abcd"
});

const FALLBACK =
  "I’m sorry, but I couldn’t find any employee information related to your query. Feel free to ask me anything else about employee details!";

async function questionToMongoFilter(question) {
  const prompt = `
Convert this question into a valid MongoDB filter JSON.
Allowed fields: name, role, department, location, skills.

Question: "${question}"

Rules:
- Return ONLY JSON.
- If question doesn't match any field, return {}.
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
  });

  const raw = response.choices[0].message.content.trim();

  try {
    return JSON.parse(raw);
  } catch {
    console.log("Filter JSON Error:", raw);
    return {};
  }
}

async function runMongoQuery(filter) {
  try {
    return await EmployeeDetails.find(filter);
  } catch (err) {
    console.log("MongoDB Query Error:", err);
    return [];
  }
}

async function generateAnswer(question, results) {
  const prompt = `
User question: "${question}"

Relevant MongoDB results:
${JSON.stringify(results, null, 2)}

Using ONLY this data, write a clear answer.

If answer cannot be found in the data, say:
"${FALLBACK}"
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content.trim();
}

router.get("/ask/history", async (req, res) => {
  try {
    const history = await ChatHistory.find().sort({ createdAt: 1 });
    res.json({ history });
  } catch (err) {
    res.status(500).json({ error: "Could not load history" });
  }
});

router.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    console.log("USER QUESTION:", question);

    await ChatHistory.create({ role: "user", message: question });

    const filter = await questionToMongoFilter(question);
    const results = await runMongoQuery(filter);

    let answer = FALLBACK;
    if (results.length > 0) {
      answer = await generateAnswer(question, results);
    }

    await ChatHistory.create({ role: "assistant", message: answer });

    const history = await ChatHistory.find().sort({ createdAt: 1 });

    return res.json({
      answer,
      results,
      filter,
      history,
    });
  } catch (error) {
    console.log("ASK ROUTE ERROR:", error);
    res.status(500).json({ answer: "Server error occurred." });
  }
});

module.exports = router;
