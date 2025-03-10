const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

app.use(express.json()); 
app.use(cors()); 

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

const generationConfig = {
  temperature: 1.2,
  topP: 1,
  topK: 100,
  maxOutputTokens: 250,
  responseMimeType: "text/plain",
};

app.post("/generate-advice", async (req, res) => {
  const { Value } = req.body;

  if (!Value) {
    return res.status(400).json({ error: "Input is required." });
  }

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: `Give a life advice on: ${Value}` }] }],
      generationConfig,
    });

    const advice = result.response.text();
    res.json({ advice });
  } catch (error) {
    console.error("Error generating advice:", error.message);
    res.status(500).json({ error: "Failed to generate advice. Please try again later." });
  }
});



app.on("error", (err) => {
  console.error("Unhandled application error:", err.message);
});


process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
