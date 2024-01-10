// App.js
import React, { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import Webcam from 'react-webcam';
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
  const [imgSrc, setImgSrc] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  const webcamRef = useRef(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
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

  return (
    <div className="app-container">
     
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
  );
};

export default App;

// // App.js
// import React, { useState, useRef } from 'react';
// import { initializeApp } from 'firebase/app';
// import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
// import Webcam from 'react-webcam';
// import './App.css'; // Import the CSS file


// const app = initializeApp(firebaseConfig);
// const storage = getStorage(app);

// const App = () => {
//   const [imgSrc, setImgSrc] = useState(null);

//   const webcamRef = useRef(null);
//   const videoConstraints = {
//     width: 1280,
//     height: 720,
//     facingMode: "user"
//   };

//   const handleCapture = async () => {
//     const captureSrc = webcamRef.current.getScreenshot();
//     setImgSrc(captureSrc);
//   };

//   const handleUpload = async () => {
//     if (!imgSrc) return;

//     try {
//       const storageRef = ref(storage, `/files/${Date.now()}.jpeg`);
//       await uploadString(storageRef, imgSrc, 'data_url');

//       const downloadURL = await getDownloadURL(storageRef);
//       console.log('File available at', downloadURL);
//     } catch (error) {
//       console.error('Error uploading image to Firebase:', error);
//     }
//   };

//   return (
//     <div className="app-container">
//       <div className="camera-container">
//         <Webcam
//           audio={false}
//           height={300}
//           ref={webcamRef}
//           screenshotFormat="image/jpeg"
//           width={500}
//           videoConstraints={videoConstraints}
//         />
//         <button onClick={handleCapture}>Capture photo</button>
//       </div>
      
//       {imgSrc && (
//         <div className="preview-container">
//           <img src={imgSrc} alt="Captured" className="preview-image" />
//           <button onClick={handleUpload}>Upload to Firebase Storage</button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default App;

