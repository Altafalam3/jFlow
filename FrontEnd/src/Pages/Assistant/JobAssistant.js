// src/pages/Assistant.js
import React, { useState } from 'react';
import axios from 'axios';
import './Assistant.css';
import axiosInstance from '../../utils/axiosInstance';

const Assistant = () => {
  const FASTAPI_BASE_URL = process.env.REACT_APP_FASTAPI_BASE_URL || 'http://localhost:8000';

  // State for resume handling
  const [resumeFile, setResumeFile] = useState(null);

  // State for job details
  const [jobUrl, setJobUrl] = useState('https://jobs.lever.co/tiket/36caec4f-182b-4132-b3ef-a2e18446cf38');
  const [isExtractingJobDetails, setIsExtractingJobDetails] = useState(false);

  // State for additional info
  const [additionalInfo, setAdditionalInfo] = useState('');

  // State for chat functionality
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  // State for cover letter
  const [coverLetter, setCoverLetter] = useState('');
  const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

  // Active view state: 'chat' or 'coverLetter'
  const [activeView, setActiveView] = useState('chat');

  // ---------- EXPRESS: Resume Extraction ----------
  // Process resume via Express API (upload & extract)
  const handleProcessResume = async () => {
    if (!resumeFile) return;
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      // Call Express API to upload and extract resume details
      const uploadRes = await axiosInstance.post(
        "/api/assistant/extract-resume",
        formData,
      );

      // Save resume JSON in localStorage for later use
      localStorage.setItem('resumeInfo', JSON.stringify(uploadRes.data));
      alert('Resume processed and saved.');
    } catch (err) {
      console.error('Error processing resume:', err);
      alert('Failed to process resume. Please try again.');
    }
  };

  // ---------- FASTAPI: Job Extraction ----------
  const handleExtractJobDetails = async () => {
    if (!jobUrl) {
      alert('Please enter a job URL');
      return;
    }
    setIsExtractingJobDetails(true);
    try {
      // Send job link to FastAPI /extract-job endpoint
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/extract-job`,
        new URLSearchParams({ job_link: jobUrl })
      );

      // Parse the jobInfo, and if it's an array, pick the first element
      let rawJobInfo = response.data.jobs;
      let jobInfo = Array.isArray(rawJobInfo) ? rawJobInfo[0] : rawJobInfo;

      // Save the extracted job details (assumed under key "jobs")
      localStorage.setItem('jobInfo', JSON.stringify(jobInfo));
      alert('Job details extracted and saved.');
    } catch (err) {
      console.error('Error extracting job details:', err);
      alert('Failed to extract job details. Please check the URL and try again.');
    } finally {
      setIsExtractingJobDetails(false);
    }
  };

  // ---------- FASTAPI: Match Percentage ----------
  const handleMatchPercentage = async () => {
    try {
      const resumeInfo = localStorage.getItem('resumeInfo') || '{}';
      const jobInfo = localStorage.getItem('jobInfo') || '{}';

      const response = await axios.post(
        `${FASTAPI_BASE_URL}/match-percentage`,
        new URLSearchParams({
          job_info: jobInfo,
          resume_info: resumeInfo
        }),
      );
      // Expected response is { matchPercentage: number }
      // setJobDetails(prev => ({ ...prev, matchPercentage: response.data.matchPercentage }));
      let matchPercent = response.data.matchPercentage;
      console.log(`Match Percentage: ${matchPercent}%`);
    } catch (err) {
      console.error('Match percentage error:', err);
      alert('Failed to compute match percentage.');
    }
  };

  // ---------- FASTAPI: Chat Functionality ----------
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;
    const userMessage = { role: 'user', content: chatMessage };
    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsChatLoading(true);
    try {
      const resumeInfo = localStorage.getItem('resumeInfo') || '{}';
      const jobInfo = localStorage.getItem('jobInfo') || '{}';
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/chat`,
        new URLSearchParams({
          message: chatMessage,
          resume_info: resumeInfo,
          job_info: jobInfo
        }),
      );
      const assistantMessage = { role: 'assistant', content: response.data.response };
      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      setChatHistory(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // ---------- FASTAPI: Cover Letter Generation ----------
  const handleGenerateCoverLetter = async () => {
    if (!localStorage.getItem('resumeInfo')) {
      alert('Please upload your resume first');
      return;
    }
    if (!localStorage.getItem('jobInfo')) {
      alert('Please extract job details first');
      return;
    }

    setIsGeneratingCoverLetter(true);
    try {
      const resumeInfo = localStorage.getItem('resumeInfo') || '{}';
      const jobInfo = localStorage.getItem('jobInfo') || '{}';
  
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/cover-letter`,
        new URLSearchParams({
          resume_info: resumeInfo,
          job_info: jobInfo,
          additional_info: additionalInfo
        }),
      );

      console.log(response.data);
      setCoverLetter(response.data.coverLetter);
      setActiveView('coverLetter');
    } catch (err) {
      console.error('Cover letter generation error:', err);
      alert('Failed to generate cover letter.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // ---------- FASTAPI: Download Cover Letter DOCX ----------
  const handleDownloadCoverLetter = async () => {
    if (!coverLetter) return;
    try {
      const response = await axios.post(
        `${FASTAPI_BASE_URL}/download-cover-letter`,
        new URLSearchParams({ cover_letter_text: coverLetter }),
        { responseType: 'blob' }
      );

      const rawJobInfo = localStorage.getItem('jobInfo') || '{}';
      const parsedJobInfo = JSON.parse(rawJobInfo);

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cover_letter_${parsedJobInfo.company_name}.docx`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Download cover letter error:', err);
      alert('Failed to download cover letter.');
    }
  };

  return (
    <div className="assistant-container" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>AI Based Job Assistant</h1>

      <div className="content-wrapper" style={{ display: 'flex', gap: '20px' }}>
        {/* Left Side */}
        <div className="left-side" style={{ flex: 1 }}>
          {/* Resume Upload Section */}
          <div className="upload-section" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
            <h3>Upload your Resume (PDF)</h3>
            <div className={`upload-box ${resumeFile ? 'has-file' : ''}`}>
              <input
                type="file"
                id="resume-upload"
                accept=".pdf"
                onChange={(e) => setResumeFile(e.target.files[0])}
                disabled={false}
              />
              <label htmlFor="resume-upload">
                {!resumeFile ? (
                  <>
                    <p className="upload-instructions">Drag and drop file here</p>
                    <p className="upload-instructions">Limit 200MB per file • PDF</p>
                  </>
                ) : (
                  <div className="file-info">
                    <p className="file-name">{resumeFile.name}</p>
                    <p className="file-size">{(resumeFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                )}
              </label>
            </div>
            <button onClick={handleProcessResume} style={{ marginTop: '10px', padding: '5px 10px' }}>
              Process Resume
            </button>
          </div>

          {/* Job URL Section */}
          <div className="job-url-section" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
            <h3>Enter the Job URL:</h3>
            <input
              type="text"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
              disabled={isExtractingJobDetails}
              style={{ width: '100%', padding: '8px' }}
            />
            <button
              onClick={handleExtractJobDetails}
              disabled={isExtractingJobDetails || !jobUrl}
              style={{ marginTop: '10px', padding: '5px 10px' }}
            >
              {isExtractingJobDetails ? 'Extracting...' : 'Extract Job Details'}
            </button>
          </div>

          {/* Additional Info Section */}
          <div className="additional-info-section" style={{ marginBottom: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '5px' }}>
            <h3>Additional Information (optional):</h3>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any specific requirements or preferences..."
              style={{ width: '100%', padding: '8px', fontSize: '14px' }}
            />
          </div>

          <button
            className="generate-button"
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingCoverLetter}
            style={{ padding: '5px 10px', marginBottom: '20px' }}
          >
            {isGeneratingCoverLetter ? 'Generating...' : 'Quick Cover Letter Generator'}
          </button>
        </div>

        {/* Right Side */}
        <div className="right-side" style={{ flex: 1 }}>
          {activeView === 'coverLetter' ? (
            <>
              <div className="cover-letter-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Cover Letter for Job Link</h2>
                <button
                  className="download-button"
                  onClick={handleDownloadCoverLetter}
                  title="Download Cover Letter"
                  style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}
                >
                  Download DOCX
                </button>
              </div>
              <div className="chat-display" style={{ marginTop: '20px' }}>
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows="10"
                  style={{ width: '100%', padding: '8px', fontSize: '14px' }}
                ></textarea>
              </div>
              <button
                className="back-to-chat-button"
                onClick={() => setActiveView('chat')}
                style={{ marginTop: '10px', padding: '5px 10px' }}
              >
                Back to Chat
              </button>
            </>
          ) : (
            <>
              <h2>Chat with AI Assistant</h2>
              <p className="description">
                Ask for resume improvements, job advice, or any other question:
              </p>

              <div className="chat-interface" style={{ border: '1px solid #eee', borderRadius: '5px', padding: '10px' }}>
                <div className="chat-display" style={{ minHeight: '200px', maxHeight: '300px', overflowY: 'auto', marginBottom: '10px', padding: '10px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                  {chatHistory.length === 0 ? (
                    <p className="placeholder">Your chat will appear here. Ask me about resume tips, interview prep, or job search advice!</p>
                  ) : (
                    chatHistory.map((message, index) => (
                      <div
                        key={index}
                        className={`message ${message.role}`}
                        style={{ marginBottom: '10px' }}
                      >
                        <strong>{message.role === 'user' ? 'You:' : 'Assistant:'}</strong>
                        <p>{message.content}</p>
                      </div>
                    ))
                  )}
                  {isChatLoading && (
                    <div className="message assistant">
                      <strong>Assistant:</strong>
                      <p>Thinking...</p>
                    </div>
                  )}
                </div>

                <div className="chat-input" style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isChatLoading}
                    style={{ flex: 1, padding: '8px' }}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !chatMessage.trim()}
                    style={{ padding: '8px 12px' }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assistant;
