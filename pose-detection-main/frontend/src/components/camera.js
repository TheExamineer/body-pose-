import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Button } from 'react-bootstrap';

  export function  WebcamCapture() {
  const [processedVideoSrc, setProcessedVideoSrc] = useState(null);
  const webcamRef = React.useRef(null);

  // Function to process the video and display it in the video tag
  const processVideo = async () => {
    // Get the webcam frame from the webcam component
    const video = webcamRef.current.video;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    const frame = canvas.toDataURL('image/jpeg');

    // Send the webcam frame to the Flask API for processing
    const response =  fetch('http://localhost:5000/process_video', {
      method: 'POST',
      body: frame,
    });

    // Get the processed video bytes from the response
    // const processedVideoBytes = await response.arrayBuffer();

    // Create a blob object from the processed video bytes
    // const processedVideoBlob = new Blob([processedVideoBytes], { type: 'video/mp4' });

    // Create a URL for the processed video blob
    // const processedVideoUrl = URL.createObjectURL(processedVideoBlob);

    // Set the processed video URL as the source of the video tag
    // setProcessedVideoSrc(processedVideoUrl);
  };

  return (
    <div>
      <Webcam ref={webcamRef} />
      <Button onClick={processVideo}>Process Video</Button>
      {/* {processedVideoSrc && <video src={processedVideoSrc} controls />} */}
    </div>
  );
}


