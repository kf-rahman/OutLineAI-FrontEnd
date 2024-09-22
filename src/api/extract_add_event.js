import { google } from 'googleapis';
import { GoogleGenerativeAI } from "@google/generative-ai";

const oAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API);
let tokens = {};  // Make sure tokens are stored properly in production

export default async function handler(req, res) {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Please provide 'text' in the request body." });

    try {
        const prompt = `Extract all important dates from the following text. Format as JSON objects with 'date' and 'description':\n\n${text}`;
        const result = await genAI.generateContent(prompt);
        let output = result.response.text().replace(/```json\n|```/g, '').trim();

        let extractedData = JSON.parse(output);

        // Ensure we have valid tokens
        if (!tokens) return res.status(401).send('Please authenticate first by visiting /api/auth');
        oAuth2Client.setCredentials(tokens);

        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
        const eventPromises = extractedData.map(async (event) => {
            const eventDetails = {
                summary: event.description,
                description: event.description,
                start: { date: event.date },
                end: { date: event.date },
            };

            try {
                const eventResponse = await calendar.events.insert({
                    calendarId: 'primary',
                    resource: eventDetails,
                });
                return eventResponse.data;
            } catch (error) {
                return { error: 'Failed to add event', event: eventDetails };
            }
        });

        const createdEvents = await Promise.all(eventPromises);
        res.json({ createdEvents });
    } catch (error) {
        res.status(500).json({ error: "Failed to extract dates or create events." });
    }
}
