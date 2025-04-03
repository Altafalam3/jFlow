import * as pdfParserUtil from "../utils/pdfParser.js";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * extractResumeDetails
 * Expects { resumePath } in req.body.
 * Reads and parses the resume PDF and then calls the Groq API to extract resume details in JSON.
 */
export const extractResumeDetails = async (req, res) => {
    let resumePath = null;
    if (req.file && req.file.path) {
        resumePath = req.file.path;
    }

    try {
        const parsedResume = await pdfParserUtil.parsePDF(resumePath);
        const prompt = `
### RESUME TEXT:
${parsedResume}

### INSTRUCTION:
Parse the provided resume text and return a structured JSON object containing:
"name", "email", "phone_number", "address", "education", "skills", "experience", "projects", "extra_curricular", "committees_and_clubs".
Return only a valid JSON object with no extra text. Don't PREAMBLE ANYTHING AT START not even json word before above json object.
`;
        const response = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
        });
        let result = response.choices[0]?.message?.content || "";
        // Remove all backticks and potential "json" text markers
        result = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        // console.log(result)

        let resumeJson;
        try {
            resumeJson = JSON.parse(result);
        } catch (e) {
            return res
                .status(500)
                .json({ error: "Error parsing resume details", raw: result });
        }
        return res.status(200).json(resumeJson);
    } catch (error) {
        console.error("extractResumeDetails error:", error);
        return res
            .status(500)
            .json({
                error: "Error extracting resume details",
                details: error.message,
            });
    }
};
