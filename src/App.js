// App.js
import React, { useState, useRef } from 'react';

const App = () => {
  const [image, setImage] = useState(null);
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

      videoRef.current.addEventListener('loadeddata', () => {
        requestAnimationFrame(() => {
          context.drawImage(
            videoRef.current,
            0,
            0,
            canvas.width,
            canvas.height
          );

          console.log('Captured Image:', canvas.toDataURL('image/png'));
          const imageDataURL = canvas.toDataURL('image/png');
          setImage(imageDataURL);
        });
      });
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  const handleDismiss = () => {
    setImage(null);
  };

  const handleUpload = () => {
    console.log('Uploading...');
    // Add your upload logic here (e.g., send image to server)
  };

  return (
    <div>
      <h1>React Camera App</h1>
      <div style={{ display: 'flex' }}>
        <div>
          <video ref={videoRef} width="400" height="300" autoPlay playsInline />
        </div>
        <div>
          {image && (
            <>
              <img src={image} alt="Captured" width="400" height="300" />
              <div>
                <button onClick={handleDismiss}>Dismiss</button>
                <button onClick={handleUpload}>Upload</button>
              </div>
            </>
          )}
        </div>
      </div>
      <div>
        <button onClick={handleCapture}>Capture Photo</button>
      </div>
    </div>
  );
};

export default App;
