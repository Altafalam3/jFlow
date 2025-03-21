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
      const user = await User.findById(req.user._id);
      const resumePath = path.resolve(user.resume);

      // console.log(resume_path);
      // console.log(jobDescription);
      // console.log(applicationQuestion);

      const parsedResume = await pdfParserUtil.parsePDF(resumePath);

      const prompt = `The resume is: ${parsedResume}. Job description is: ${jobDescription}. Question is: ${applicationQuestion}.`;

      const response = await llamaUtil.callChatAPI(prompt);
      const answer = response?.choices?.[0]?.message?.content || "";
      res.status(200).json({ answer });
   } catch (error) {
      console.error("Error in generateCustomAnswer:", error);
      res.status(500).json({ error: "Error generating custom answer" });
   }
};

export const matchPercentage = async (req, res) => {
   try {
      const { jobDescription } = req.body;
      const user = await User.findById(req.user._id);
      const resumePath = path.resolve(user.resume);
      const parsedResume = await pdfParserUtil.parsePDF(resumePath);

      const prompt = `You are an expert career consultant. Given the following resume and job description, compute a match percentage (score out of 100) indicating how well the resume fits the job. Resume: ${parsedResume} Job Description: ${jobDescription} Return only a valid JSON object in the format: {"matchPercentage": <number>}. Do not include any extra text.`;

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
