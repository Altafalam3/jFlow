"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Webcam from "react-webcam";
import { Button } from "@/components/ui/button";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic, StopCircle } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "@/utils/GeminiAIModel";
import { db } from "@/utils/db";
import { UserAnswer } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import moment from "moment";

function RecordAnswerSection({ activeQuestionIndex, mockInterViewQuestion, interviewData }) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  if (error) {
    toast(error);
    return;
  }

  const StartStopRecording = async () => {
    if (isRecording) {
      // Stop recording
      stopSpeechToText();
    } else {
      // Start recording
      startSpeechToText();
    }
  };

  useEffect(() => {
    if (!isRecording && results.length) {
      // console.log(userAnswer.length);
      UpdateUserAnswerInDb();
    }
  }, [isRecording]);

  const UpdateUserAnswerInDb = async () => {
    setLoading(true);
    console.log(results);

    // Build the user answer from results using a for loop
    let ans = "";
    for (let i = 0; i < results.length; i++) {
      ans += results[i]?.transcript;
    }
    console.log(ans);

    // Check if ans has a valid length before proceeding
    if (ans.length < 10) {
      console.log("Error while saving your answer, Please record again");
      setLoading(false);
      return;
    }


    const feedbackPrompt = `
    Question: ${mockInterViewQuestion[activeQuestionIndex]?.question},
    User Answer: ${ans}.

    ### INSTRUCTIONS:
    1. Role:
      You are an AI Mock Interview Expert, designed to generate concise, voice-answerable interview questions.
      You have already generated questions now it is time to evaluate user answers.

    2. Evaluation:
      - Based on the question and the user's answer, provide a rating from 0 to 10.
      - Rating Criteria:
        - The rating should reflect the content of the answer.
        - The answer should demonstrate understanding of the topic, even if not perfectly structured or well-organized.
        - If the user provides a related but imperfect solution, focus on their understanding rather than expecting a memorized definition.
        - If the user provides no related information or says "I don’t know," rate it as 0.

    3. Feedback:
      - Provide feedback focusing on areas for improvement in 3-4 lines, based on the user's answer.

    4. Sample Correct Answer:
      - Give Sample correct answer in short properly for above question

      Ensure the response is strictly in JSON format with fields: "Sample Correct Answer", "Rating", and "Feedback".
      JSON FORMAT (NO PREAMBLE):
      {
        "sampleCorrectAnswer": "",
        "rating": "",
        "feedback": ""
      }
    `;

    const result = await chatSession.sendMessage(feedbackPrompt);
    const mockJsonResp = result.response.text().replace(/```json/g, "").replace(/```/g, "");
    const JsonFeedbackResp = JSON.parse(mockJsonResp);
    console.log(JsonFeedbackResp);

    const resp = await db.insert(UserAnswer).values({
      mockIdRef: interviewData?.mockId,
      question: mockInterViewQuestion[activeQuestionIndex]?.question,
      correctAns: JsonFeedbackResp?.sampleCorrectAnswer,
      userAns: ans,
      feedback: JsonFeedbackResp?.feedback,
      rating: JsonFeedbackResp?.rating,
      userEmail: user?.primaryEmailAddress?.emailAddress,
      createdAt: moment().format('DD-MM-yyyy')
    });

    if (resp) {
      toast('User Answer recorded successfully!');
      console.log('User Answer recorded successfully!');
    } else {
      // toast('Not saved');
      console.log('User answer not saved');
    }

    setResults([]);
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src={"/webcam.png"}
          width={200}
          height={200}
          className="absolute"
        />
        <Webcam
          mirrored={true}
          style={{
            height: "50vh",
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <Button disabled={loading} variant="outline" onClick={StartStopRecording} className="my-10">
        {isRecording ? (
          <h2 className="flex items-center justify-center text-red-600 gap-2">
            <StopCircle />
            Stop Recording...
          </h2>
        ) : (
          <h2 className="flex items-center justify-center gap-2">
            <Mic />
            Start Recording
          </h2>
        )}
      </Button>

      <div className="pb-10">
        <h6> Transcript:</h6>
        <ul>
          {results.map((result) => (
            <span key={result.timestamp}>{result.transcript}</span>
          ))}
          {interimResult && <li>{interimResult}</li>}
        </ul>
      </div>

    </div>
  );
}

export default RecordAnswerSection;
