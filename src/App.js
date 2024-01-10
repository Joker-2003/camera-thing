// App.js
import React, { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString } from 'firebase/storage';
import Webcam from 'react-webcam';

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
  const [imgSrc, setImgSrc] = useState(null);

  const handleCapture = async () => {
    const captureSrc = webcamRef.current.getScreenshot();
    setImgSrc(captureSrc);
  };

  const handleUpload = async () => {
    if (!imgSrc) return;
    
    try {
      const storageRef = ref(storage, `/files/${Date.now()}.jpeg`);
      await uploadString(storageRef, imgSrc, 'data_url');

      storageRef.getDownloadURL().then(downloadURL => {
        console.log('File available at', downloadURL);
      });
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
    }
  };

  const webcamRef = useRef(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };

  return (
    <>
      <Webcam
        audio={false}
        height={300}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={500}
        videoConstraints={videoConstraints}
      />
      <button onClick={handleCapture}>Capture photo</button>
      <button onClick={handleUpload}>Upload to Firebase Storage</button>
    </>
  );
};

export default App;
