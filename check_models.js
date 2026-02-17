require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function listModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        // Just to check if we can even init, but real list is:
        // actually SDK doesn't have a direct 'listModels' helper easily accessible on the main class in all versions, 
        // but we can try to assume 'gemini-1.5-flash' works if we use the right string.

        // Let's try the fallback model 'gemini-pro' one more time or 'gemini-1.0-pro'
        console.log("Testing model access...");

    } catch (e) {
        console.log("Error:", e.message);
    }
}

// Better yet, let's just use the known correct string. 
// "gemini-1.5-flash" is usually correct. 
// "gemini-pro" is deprecated/moved.
// "gemini-1.0-pro" might be available.

// Let's rely on a script that actually invokes the 'listModels' endpoint directly via REST if SDK fails, 
// but the SDK does have it. 
// Actually, let's just try to fix the controller to use "gemini-1.5-flash-latest" or "gemini-1.0-pro" if flash fails.

console.log("This script is just a placeholder to say: We will query the API.");
