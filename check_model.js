const { GoogleGenerativeAI } = require("@google/generative-ai");

// Paste your API key here or load from .env
const genAI = new GoogleGenerativeAI("YOUR_API_KEY_HERE");

async function listModels() {
  try {
    const response = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 
    // We need the model manager, usually accessed via generic request or just listing:
    // Actually, for the JS SDK, listing is often done via direct fetch or specific manager methods 
    // depending on version. Here is the safest fetch approach:
    
    console.log("Fetching available models...");
    // Note: The JS SDK doesn't always expose listModels easily, 
    // so checking the official documentation or using curl is often faster.
  } catch (error) {
    console.error(error);
  }
}

// EASIER WAY: USE CURL in your terminal
// This bypasses SDK version issues