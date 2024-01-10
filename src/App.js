// App.js
import React, { useState, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import {ref} from 'firebase/storage';
import Webcam from 'react-webcam'

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

const App = () => {
  const [image, setImage] = useState(null);
  const [streamPaused, setStreamPaused] = useState(false);
  const videoRef = useRef(null);

  const handleCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      videoRef.current.addEventListener('loadedmetadata', () => {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvas.width,
          canvas.height
        );
        const imageDataURL = canvas.toDataURL('image/png');
        setImage(imageDataURL);
        setStreamPaused(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the live stream
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleUpload = async () => {
    if (!imgSrc) return;
    try {
      const storageRef = app.storage().ref();
      storageRef.putString(imgSrc, 'data_url').then(function(snapshot) {
        console.log('Uploaded a data_url string!');
      });
      const imageRef = storageRef.child(`images/${Date.now()}.png`);
      await imageRef.putString(image.replace('data:image/png;base64,', ''), 'data_url');

      const downloadURL = await imageRef.getDownloadURL();
      console.log('Firebase download link:', downloadURL);
    } catch (error) {
      console.error('Error uploading image to Firebase:', error);
    }
  };

  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc)
      console.log(imageSrc)
    },
    [webcamRef]
  );
  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user"
  };
  const [imgSrc, setImgSrc] = useState(null)
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
      <button onClick={capture}>Capture photo</button>
      <button onClick={handleUpload}>Upload to Firebase Storage</button>
    </>
  );
};

export default App;

// import React, { useState, useRef } from 'react';
// import { initializeApp } from 'firebase/app';
// import 'firebase/storage';

// const firebaseConfig = {
//   apiKey: "AIzaSyD8VxVPnBJTkX0F7GYZOViZ2RYCHtj_Of8",
//   authDomain: "ieee-camera.firebaseapp.com",
//   projectId: "ieee-camera",
//   storageBucket: "ieee-camera.appspot.com",
//   messagingSenderId: "422076680956",
//   appId: "1:422076680956:web:9c2b1fbfb4e8137a97e579",
//   measurementId: "G-00TF5Y5KG8"
// };
// const app = initializeApp(firebaseConfig);

// const App = () => {
//   const [image, setImage] = useState(null);
//   const [streamPaused, setStreamPaused] = useState(false);
//   const videoRef = useRef(null);

//   const handleCapture = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//       videoRef.current.srcObject = stream;
//       videoRef.current.play();

//       const canvas = document.createElement('canvas');
//       const context = canvas.getContext('2d');
//       canvas.width = videoRef.current.videoWidth;
//       canvas.height = videoRef.current.videoHeight;

//       videoRef.current.addEventListener('loadedmetadata', () => {
//         context.drawImage(
//           videoRef.current,
//           0,
//           0,
//           canvas.width,
//           canvas.height
//         );
//         const imageDataURL = canvas.toDataURL('image/png');
//         setImage(imageDataURL);
//         setStreamPaused(true);
//         stream.getTracks().forEach(track => track.stop()); // Stop the live stream
//       });
//     } catch (error) {
//       console.error('Error accessing camera:', error);
//     }
//   };

//   const handleUpload = async () => {
//     try {
//       const storageRef = app.storage().ref();
//       const imageRef = storageRef.child(`images/${Date.now()}.png`);
//       await imageRef.putString(image.replace('data:image/png;base64,', ''), 'data_url');

//       const downloadURL = await imageRef.getDownloadURL();
//       console.log('Firebase download link:', downloadURL);
//     } catch (error) {
//       console.error('Error uploading image to Firebase:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>React Camera App</h1>
//       <div>
//         <video ref={videoRef} width="400" height="300" />
//       </div>
//       {image && (
//         <>
//           <div>
//             <img src={image} alt="Captured" width="200" height="150" />
//           </div>
//           <div>
//             <button onClick={handleUpload}>Upload to Firebase Storage</button>
//           </div>
//         </>
//       )}
//       <div>
//         <button onClick={handleCapture}>Capture Photo</button>
//       </div>
//     </div>
//   );
// };

// export default App;
