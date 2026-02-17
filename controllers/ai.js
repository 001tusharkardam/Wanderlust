const { GoogleGenerativeAI } = require("@google/generative-ai");
const MarkdownIt = require("markdown-it");
const md = new MarkdownIt();

module.exports.renderPlanForm = (req, res) => {
    res.render("ai/plan.ejs", { plan: null, destination: null, source: null });
};

module.exports.generatePlan = async (req, res) => {
    try {
        const { source, destination, days, budget, interests, transport } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            req.flash("error", "API Key is missing! Please set GEMINI_API_KEY in .env file.");
            return res.redirect("/ai/plan");
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `Act as an expert travel agent. 
        Create a detailed ${days}-day trip itinerary from ${source} to ${destination} via ${transport} with a budget of ${budget} per person.
        The traveler is interested in: ${interests}.
        
        Make the response structured and inspiring. Include:
        - **Travel Plan**: Best route from ${source} to ${destination} by ${transport}. Estimated travel time and cost.
        - **Daily Itinerary**: Morning, Afternoon, Evening activities.
        - **Estimated Costs**: Detailed breakdown (Travel tickets, Food, Stay, Activities).
        - **Must-Visit Places**: Key attractions with brief descriptions.
        - **Food Recommendations**: Local dishes to try.
        - **Travel Tips**: Best time to visit, packing list, safety tips.
        - **Total Estimated Budget**: Provide a final calculated total cost range for the entire trip (including travel, stay, food, and activities) at the very end.
        
        Format the output in clean Markdown with bold headings and bullet points.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        const htmlContent = md.render(text);

        res.render("ai/plan.ejs", { plan: htmlContent, destination, source });

    } catch (e) {
        console.error("AI GENERATION ERROR:", e);
        console.log("DEBUG: API Key present?", !!process.env.GEMINI_API_KEY);
        if (e.response && typeof e.response.text === 'function') {
            console.error("Response Error Details:", await e.response.text());
        }
        req.flash("error", `Failed to generate plan: ${e ? e.message : "Unknown Error"}`);
        res.redirect("/ai/plan");
    }
};
