import React, { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import Webcam from 'react-webcam';
import bcrypt from 'bcryptjs'; // Import bcryptjs for password hashing
import Logo from './logo.png';
import './App.css';

const firebaseConfig = {
  apiKey: "AIzaSyD8VxVPnBJTkX0F7GYZOViZ2RYCHtj_Of8",
  authDomain: "ieee-camera.firebaseapp.com",
  projectId: "ieee-camera",
  storageBucket: "ieee-camera.appspot.com",
  messagingSenderId: "422076680956",
  appId: "1:422076680956:web:9c2b1fbfb4e8137a97e579",
  measurementId: "G-00TF5Y5KG8"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);


const App = () => {
  const hashedPassword = '$2a$10$YQ1sSmnoYi1dS8yWON50VucmCYfp9P4oWCpAfEviuDxsgI0S6bGWy'; 


  const [showMainPage, setShowMainPage] = useState(false);
  const [imgSrc, setImgSrc] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);
  const webcamRef = useRef(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: 'environment',
  };

  const handleCapture = async () => {
    const captureSrc = webcamRef.current.getScreenshot();
    setImgSrc(captureSrc);
  };

  const handleUpload = async () => {
    if (!imgSrc) return;

    try {
      const storageRef = ref(storage, `/files/${Date.now()}.jpeg`);
      const snapshot = await uploadString(storageRef, imgSrc, 'data_url');

      const url = await getDownloadURL(storageRef);
      setDownloadURL(url);
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
    }
  };

  const handleCopyURL = () => {
    if (downloadURL) {
      navigator.clipboard.writeText(downloadURL);
      //alert('Download URL copied to clipboard!');
    }
  };

  const AccessWall = () => {
    const [password, setPassword] = useState('');
    const checkPassword = () => {
      const isPasswordCorrect = bcrypt.compareSync(password, hashedPassword);
      if (isPasswordCorrect) {
        setShowMainPage(true);
      } else {
        alert('Incorrect password. Please try again.');
      }
    };

    return (
      <div className="access-wall">
        <h2>IEEE Tech Team </h2>
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => { if (e.key === 'Enter') checkPassword(); } }
        />
        <button onClick={checkPassword}>Enter</button>
      </div>
    );
  };

  return (
    <div>
      {!showMainPage ? (
        <AccessWall />
      ) : (
        <div className="app-container">
          <header className="app-header">
            <img src={Logo} alt="IEEE Tech Team Logo" className="app-logo" />
            <h1>IEEE Tech Team</h1>
          </header>

          <Webcam
            audio={false}
            height={300}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={500}
            videoConstraints={videoConstraints}
          />
          <button onClick={handleCapture}>Capture photo</button>

          {imgSrc && (
            <div className="preview-container">
              <img src={imgSrc} alt="Captured" className="preview-image" />
              <button onClick={handleUpload}>Upload to Firebase Storage</button>
              <button onClick={() => setImgSrc(null)} className="red-warning">
                Retake
              </button>

              {downloadURL && (
                <div>
                  <p>Download URL:</p>
                  <input type="text" value={downloadURL} readOnly />
                  <button onClick={handleCopyURL}>Copy URL</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
