import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * callChatAPI - Sends a prompt to the Groq chat completions endpoint.
 *
 * @param {string} prompt - The prompt to send.
 * @returns {Promise<Object>} - The API response.
 */
export const callChatAPI = async (prompt) => {
  const messages = [
    {
      role: "user",
      content: prompt,
    },
  ];
  return await groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
  });
};
