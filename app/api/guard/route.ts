import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // Ensure this is stored in your .env file
});

export const POST = async (req: NextRequest) => {
    try {
        const { text } = await req.json();
        if (!text || typeof text !== "string") {
            return NextResponse.json({ error: "Invalid input" }, { status: 400 });
        }

        // Call OpenAI API to check for profanity
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "system",
                    content:
                        "You are a strict content moderation assistant. Flag any text containing profanity, hate speech, racial/ethnic slurs, or offensive language.",
                },
                { role: "user", content: `Does this text contain offensive content? Respond with only 'YES' or 'NO' - no other responses will be acceptable. Here is the content needed to be moderated: "${text}"` },
            ],
            max_tokens: 5,
        });
        // log the response
        console.log(response.choices[0]?.message?.content?.toLowerCase());
        const flagged = response.choices[0]?.message?.content?.toLowerCase().includes("yes");

        return NextResponse.json({ flagged });
    } catch (error) {
        console.error("Error checking profanity:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
};
