import path from "path";
import { fileURLToPath } from "url";
import User from "../models/User.js";
import * as pdfParserUtil from "../utils/pdfParser.js";
import * as llamaUtil from "../utils/llama.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCustomAnswer = async (req, res) => {
    try {
        const { jobDescription, applicationQuestion } = req.body;
        const resume_path = (await User.findById(req.user._id)).resume;

        // console.log(resume_path);
        // console.log(jobDescription);
        // console.log(applicationQuestion);

        const parsedResume = await pdfParserUtil.parsePDF(resume_path);

        const prompt = `The resume is: ${parsedResume}. Job description is: ${jobDescription}. Question is: ${applicationQuestion}.`;

      const response = await llamaUtil.callChatAPI(prompt);
      const answer = response?.choices?.[0]?.message?.content || "";
      console.log(answer);
      res.status(200).json({ answer });
   } catch (error) {
      console.error("Error in generateCustomAnswer:", error);
      res.status(500).json({ error: "Error generating custom answer" });
   }
};

export const matchPercentage = async (req, res) => {
    try {
        const { jobDescription } = req.body;
        const resume_path = (await User.findById(req.user._id)).resume;

        const parsedResume = await pdfParserUtil.parsePDF(resume_path);
        const prompt = `
            ### RESUME INFORMATION:
            ${parsedResume}

            ### JOB INFORMATION:
            ${jobDescription}

            ### INSTRUCTION:
            Assume you are a Resume and JD match percentage expert for the candidate,
            Give percentage of match between the resume and the JD from 0 to 100%,
            by formula (count of common skills/ total number of skills in JD ),
            also tell which skills match and which dont in resume but requires in JD, 
            If all common skills match then give 100% match score.
            Tailor the response based on resume and job info are provided.
            Return only a valid JSON object in the format: {"matchPercentage": <number>}. Do not include any extra text.
      `;

        const response = await llamaUtil.callChatAPI(prompt);
        const answer = response?.choices?.[0]?.message?.content || "";

        let matchData;
        try {
            matchData = JSON.parse(answer);
        } catch (parseError) {
            console.error("Error parsing match percentage:", parseError);
            return res
                .status(500)
                .json({ error: "Error parsing match percentage", raw: answer });
        }

        res.status(200).json(matchData);
    } catch (error) {
        console.error("Error in matchPercentage:", error);
        res.status(500).json({ error: "Error generating match percentage" });
    }
};
