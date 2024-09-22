// api/test-llm.js

import { GoogleGenerativeAI } from "@google/generative-ai"; // Adjust import as needed

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Please provide 'text' in the request body." });
    }

    try {
      // Initialize Google Generative AI (assuming API key is in env vars)
      const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `Extract all important dates from the following text. Format your response as a JSON array of objects, where each object has a 'date' field (in YYYY-MM-DD format if possible) and a 'description' field. Here's the text:\n\n${text}`;

      const result = await model.generateContent(prompt);
      const output = result.response.text(); // Handle the output from the LLM

      // Return the response
      res.status(200).json({ output });
    } catch (error) {
      console.error("Error during LLM call:", error);
      res.status(500).json({ error: "Failed to get response from LLM." });
    }
  } else {
    res.status(405).json({ message: 'Only POST method is allowed' });
  }
}
