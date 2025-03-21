import User from "../models/User.js";
import path from "path";
// const fs = require("fs");
// const PDFParser = require("pdf2json");

// const Groq = require("groq-sdk");
// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });


export const AddUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateUserDetails = async (req, res) => {
  try {
    const updateData = {
      ...req.body,
      ...(req.body.urls && {
        urls: req.body.urls.map((url) => JSON.parse(url)),
      }),
      ...(req?.file?.path && { resume: req.file.path }),
    };
    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    });
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    const isMatch = await user.checkPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = user.generateAuthToken();
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getResume = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const resumeUrl = `${user.resume}`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=file.pdf");

    res.sendFile(path.resolve(resumeUrl));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// const generateCustomAnswer = async (req, res) => {
//   const { jobDescription, applicationQuestion } = req.body;
//   const resume_path = (await User.findById(req.user._id)).resume;

//   // console.log(resume_path);
//   // console.log(jobDescription);
//   // console.log(applicationQuestion);

//   let parsedResume = "";
//   var pdfParser = new PDFParser(this, 1);

//   pdfParser.on("pdfParser_dataReady", async (data) => {
//     parsedResume = pdfParser.getRawTextContent();
//     try {

//       const response = await groq.chat.completions.create({
//         messages: [
//           {
//             role: "user",
//             content: `The resume is: ${parsedResume}. Job description is: ${jobDescription}. Question is: ${applicationQuestion}.`,
//           },
//         ],
//         model: "llama-3.3-70b-versatile",
//       });
      
//       const answer = response.choices[0]?.message?.content || "";
//       // console.log(answer);
//       return res.status(200).json(answer);
//     } catch (error) {
//       console.error("Error:", error);
//       return res.status(500).json({ error: "Error generating custom answer" });
//     }
//   });

//   pdfParser.loadPDF(path.resolve(resume_path));
// };

// const matchPercentage = async (req, res) => {
//   const { jobDescription } = req.body;

//   const resume_path = (await User.findById(req.user._id)).resume;
//   console.log("Resume path:", resume_path);
//   let parsedResume = "";
//   var pdfParser = new PDFParser(this, 1);

//   pdfParser.on("pdfParser_dataReady", async (data) => {
//     parsedResume = pdfParser.getRawTextContent();
//     try {
//       // Build a prompt with clear instructions:
//       const messages = [
//         {
//           role: "user",
//           content: `You are an expert career consultant. Given the following resume and job description, compute a match percentage (score out of 100) indicating how well the resume fits the job. 
// Resume: ${parsedResume} 
// Job Description: ${jobDescription}
// Return only a valid JSON object in the format: {"matchPercentage": <number>}. Do not include any extra text.`
//         },
//       ];

//       // Await the Groq API call (using your Groq client)
//       const response = await groq.chat.completions.create({
//         messages,
//         model: "llama-3.3-70b-versatile",
//       });

//       console.log("Match Percentage AI response:", response);
//       if (!response.choices || response.choices.length === 0) {
//         return res.status(500).json({ error: "AI service returned no response." });
//       }
//       const answer = response.choices[0]?.message?.content || "";
      
//       // Parse the answer as JSON
//       let matchData;
//       try {
//         matchData = JSON.parse(answer);
//       } catch (e) {
//         console.error("Error parsing AI response:", e);
//         return res.status(500).json({ error: "Error parsing match percentage from AI response", raw: answer });
//       }
//       return res.status(200).json(matchData);
//     } catch (error) {
//       console.error("Error in matchPercentage:", error);
//       return res.status(500).json({ error: "Error generating match percentage" });
//     }
//   });
//   pdfParser.loadPDF(path.resolve(resume_path));
// };
