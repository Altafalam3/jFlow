import React, { useState } from 'react';
import axios from 'axios';
import './Assistant.css';

const Assistant = () => {
  // State for resume handling
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isResumeProcessing, setIsResumeProcessing] = useState(false);
  
  // State for job details
  const [jobUrl, setJobUrl] = useState('');
  const [jobDetails, setJobDetails] = useState(null);
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
  
  // Active view state
  const [activeView, setActiveView] = useState('chat'); // 'chat' or 'coverLetter'

  // API base URL (should be in environment variables)
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://your-api-endpoint.com';

  // Process resume when file is uploaded
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }

    setResumeFile(file);
    setIsResumeProcessing(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await axios.post(`${API_BASE_URL}/api/process-resume`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResumeText(response.data.text);
    } catch (error) {
      console.error('Error processing resume:', error);
      alert('Failed to process resume. Please try again.');
    } finally {
      setIsResumeProcessing(false);
    }
  };

  // Extract job details from URL
  const handleExtractJobDetails = async () => {
    if (!jobUrl) {
      alert('Please enter a job URL');
      return;
    }

    setIsExtractingJobDetails(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/extract-job-details`, {
        url: jobUrl
      });

      setJobDetails(response.data);
      alert('Job details extracted successfully!');
    } catch (error) {
      console.error('Error extracting job details:', error);
      alert('Failed to extract job details. Please check the URL and try again.');
    } finally {
      setIsExtractingJobDetails(false);
    }
  };

  // Generate cover letter
  const handleGenerateCoverLetter = async () => {
    if (!resumeText) {
      alert('Please upload your resume first');
      return;
    }

    if (!jobDetails) {
      alert('Please extract job details first');
      return;
    }

    setIsGeneratingCoverLetter(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-cover-letter`, {
        resumeText,
        jobDetails,
        additionalInfo
      });

      setCoverLetter(response.data.coverLetter);
      setActiveView('coverLetter');
    } catch (error) {
      console.error('Error generating cover letter:', error);
      alert('Failed to generate cover letter. Please try again.');
    } finally {
      setIsGeneratingCoverLetter(false);
    }
  };

  // Send chat message to AI assistant
  const handleSendMessage = async () => {
    if (!chatMessage.trim()) return;

    const userMessage = {
      role: 'user',
      content: chatMessage
    };

    setChatHistory(prev => [...prev, userMessage]);
    setChatMessage('');
    setIsChatLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/chat`, {
        message: chatMessage,
        resumeText,
        jobDetails,
        chatHistory: chatHistory.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      });

      const assistantMessage = {
        role: 'assistant',
        content: response.data.reply
      };

      setChatHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending chat message:', error);
      
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };

      setChatHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Download cover letter as text file
  const downloadCoverLetter = () => {
    if (!coverLetter) return;
    
    const element = document.createElement('a');
    const file = new Blob([coverLetter], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `Cover_Letter_${getCompanyName()}_${getJobTitle()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Format job title for display
  const getJobTitle = () => {
    if (!jobDetails) return 'Unknown Position';
    return jobDetails.title || 'Unknown Position';
  };

  // Format company name for display
  const getCompanyName = () => {
    if (!jobDetails) return 'Unknown Company';
    return jobDetails.company || 'Unknown Company';
  };

  return (
    <div className="assistant-container">
      <h1>AI Based Job Assistant</h1>
      
      <div className="content-wrapper">
        {/* Left Side */}
        <div className="left-side">
          <div className="upload-section">
            <h3>Upload your Resume (PDF)</h3>
            <div className={`upload-box ${resumeFile ? 'has-file' : ''}`}>
              <input 
                type="file" 
                id="resume-upload" 
                accept=".pdf" 
                onChange={handleFileUpload}
                disabled={isResumeProcessing}
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
                    {isResumeProcessing && <p className="processing-indicator">Processing...</p>}
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="job-url-section">
            <h3>Enter the Job URL:</h3>
            <input
              type="text"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://example.com/job-posting"
              disabled={isExtractingJobDetails}
            />
            <button 
              onClick={handleExtractJobDetails}
              disabled={isExtractingJobDetails || !jobUrl}
            >
              {isExtractingJobDetails ? 'Extracting...' : 'Extract Job Details'}
            </button>
          </div>

          <div className="additional-info-section">
            <h3>Additional information (optional):</h3>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any specific requirements or preferences..."
            />
          </div>

          <button 
            className="generate-button"
            onClick={handleGenerateCoverLetter}
            disabled={isGeneratingCoverLetter || !resumeText || !jobDetails}
          >
            {isGeneratingCoverLetter ? 'Generating...' : 'Quick Cover Letter Generator'}
          </button>
        </div>

        {/* Right Side */}
        <div className="right-side">
          {activeView === 'coverLetter' ? (
            <>
              <div className="cover-letter-header">
                <h2>Cover Letter for {getJobTitle()} at {getCompanyName()}</h2>
                <button 
                  className="download-button"
                  onClick={downloadCoverLetter}
                  title="Download Cover Letter"
                >
                  <svg className="download-icon" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                  </svg>
                  Download
                </button>
              </div>
              <div className="chat-display">
                <div className="display-content">
                  {coverLetter.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
              <button 
                className="back-to-chat-button"
                onClick={() => setActiveView('chat')}
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

              <div className="chat-interface">
                <div className="chat-display">
                  {chatHistory.length === 0 ? (
                    <p className="placeholder">Your chat will appear here. Ask me about resume tips, interview prep, or job search advice!</p>
                  ) : (
                    chatHistory.map((message, index) => (
                      <div 
                        key={index} 
                        className={`message ${message.role}`}
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

                <div className="chat-input">
                  <input
                    type="text"
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    placeholder="Type your message here..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isChatLoading}
                  />
                  <button 
                    onClick={handleSendMessage}
                    disabled={isChatLoading || !chatMessage.trim()}
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