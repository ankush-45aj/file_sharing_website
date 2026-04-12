import React, { useState } from 'react';
import api from '../services/api';

function Home() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadCode, setUploadCode] = useState('');
  const [downloadCode, setDownloadCode] = useState('');
  const [fileInfo, setFileInfo] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setUploadCode('');
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert('Please select a file first.');

    const formData = new FormData();
    formData.append('file', selectedFile);
    setIsUploading(true);

    try {
      const res = await api.post('/files/upload', formData); // Boundary generated securely
      setUploadCode(res.data.code);
      setSelectedFile(null);
    } catch (err) {
      alert('File upload failed: ' + (err.response?.data?.msg || err.message));
    } finally {
      setIsUploading(false);
    }
  };

  const checkFileInfo = async () => {
      if (downloadCode.length !== 6) return alert('Enter a 6-digit code');
      setIsChecking(true);
      try {
          const res = await api.get(`/files/info/${downloadCode}`);
          setFileInfo(res.data);
      } catch (err) {
          alert('Failed to find file: ' + (err.response?.data?.msg || err.message));
          setFileInfo(null);
      } finally {
          setIsChecking(false);
      }
  };

  const handleDownload = async () => {
      if (!fileInfo) return;
      try {
        const response = await api.get(`/files/download/${downloadCode}`, {
            responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileInfo.originalName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        setFileInfo(null);
        setDownloadCode('');
      } catch (err) {
          alert('Failed to download file');
      }
  };

  return (
    <>
      <h1 className="main-title">AeroDrop</h1>
      <div className="cards-wrapper">
        
        {/* Upload Card */}
        <div className="glass-card">
          <h3>Send File</h3>
          <p>Drop a file to securely generate a 24-hour anonymous sharing OTP code.</p>
          
          <div className="file-input-wrapper">
            <input type="file" onChange={handleFileChange} />
            <div className="custom-file-button">
              {selectedFile ? (
                <span><strong>Selected:</strong> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              ) : (
                <span>Click or drag a file here to share</span>
              )}
            </div>
          </div>

          <button 
            className="btn-primary" 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? 'Encrypting & Uploading...' : 'Generate Sharing Code'}
          </button>

          {uploadCode && (
              <div className="code-display">
                  <p>Your secure sharing OTP is</p>
                  <div className="code">{uploadCode}</div>
                  <p>Share this 6-digit code with the receiver.</p>
              </div>
          )}
        </div>

        {/* Download Card */}
        <div className="glass-card">
          <h3>Receive File</h3>
          <p>Enter the 6-digit sending code to instantly download a file.</p>
          
          <input 
              type="text" 
              className="otp-input"
              placeholder="000000" 
              value={downloadCode} 
              onChange={e => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                setDownloadCode(val);
                setFileInfo(null); // Reset when typing new code
              }} 
              maxLength={6}
          />
          
          <button 
            className="btn-primary" 
            onClick={checkFileInfo}
            disabled={downloadCode.length !== 6 || isChecking}
          >
            {isChecking ? 'Verifying...' : 'Find File'}
          </button>

          {fileInfo && (
              <div className="file-info-card">
                  <p className="filename">{fileInfo.originalName}</p>
                  <p className="filesize">{(fileInfo.size / 1024).toFixed(2)} KB</p>
                  <button className="btn-primary" onClick={handleDownload} style={{background: 'linear-gradient(90deg, #00c6ff 0%, #0072ff 100%)'}}>
                      Download Securely
                  </button>
              </div>
          )}
        </div>

      </div>
    </>
  );
}

export default Home;
