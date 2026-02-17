require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function findWorkingModel() {
    const key = process.env.GEMINI_API_KEY;
    const genAI = new GoogleGenerativeAI(key);

    console.log("Fetching models...");
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (!data.models) {
            console.log("No models found via REST API.");
            return;
        }

        const candidates = data.models
            .filter(m => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
            .map(m => m.name.replace("models/", ""));

        console.log(`Found ${candidates.length} candidates.`);

        // Prioritize known good models
        const priority = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro", "gemini-pro"];
        candidates.sort((a, b) => {
            const ia = priority.indexOf(a);
            const ib = priority.indexOf(b);
            if (ia === -1 && ib === -1) return 0;
            if (ia !== -1 && ib === -1) return -1;
            if (ia === -1 && ib !== -1) return 1;
            return ia - ib;
        });

        for (const modelName of candidates) {
            process.stdout.write(`Testing: ${modelName}... `);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                const text = result.response.text();
                console.log(`✅ SUCCESS! Response: "${text.substring(0, 20)}..."`);

                // If it works, let's update the controller file directly!
                const fs = require('fs');
                const controllerPath = 'd:\\iimt project\\AI based destination\\Wanderlust\\controllers\\ai.js';
                let content = fs.readFileSync(controllerPath, 'utf8');
                // Regex to replace model name
                const newContent = content.replace(/model:\s*"[^"]+"/, `model: "${modelName}"`);
                fs.writeFileSync(controllerPath, newContent);
                console.log(`Updated controller to use: ${modelName}`);
                return; // Stop after first success
            } catch (e) {
                console.log(`❌ FAILED (${e.message.split(' ')[0]})`);
            }
        }
    } catch (e) {
        console.error("Critical Error", e);
    }
}

findWorkingModel();
