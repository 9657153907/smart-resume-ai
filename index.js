const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/suggest", async (req, res) => {
  const { section, content } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Suggest improvements for this resume section titled "${section}":\n\n${content}`,
        },
      ],
    });

    const suggestion = response.choices[0].message.content;
    res.json({ suggestion });
  } catch (error) {
    // 🔥 Log the full error, not just message
    console.error("❌ OpenAI API FULL ERROR:", error);
    res.status(500).json({ error: "OpenAI API error" });
  }
});

app.listen(5000, () => {
  console.log("✅ AI Suggestion API running on http://localhost:5000");
});
