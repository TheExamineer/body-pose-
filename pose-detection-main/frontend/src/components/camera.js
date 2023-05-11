import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";

export function WebcamCapture() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [timerId, setTimerId] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);

  useEffect(() => {
    if (timerId) {
      return () => clearInterval(timerId);
    }
  }, [timerId]);

  const startVideo = async () => {
    const constraints = { video: true };
    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoRef.current.srcObject = mediaStream;
    videoRef.current.addEventListener("loadedmetadata", () => {
      videoRef.current.play();
    });
  };

  const sendVideo = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Set canvas dimensions to match video dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw current video frame onto canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Get canvas data and send to backend
    const dataUrl = canvas.toDataURL("image/JPEG ");
    console.log("Data being sent to backend:", { frame: dataUrl });

    fetch("https://body-pose-backend1.onrender.com/process_video", {
      method: "POST",
      body: JSON.stringify({ frame: dataUrl }),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then((response) => response.json())
    .then((data) => {
      // Set the processed image data
      setProcessedImage(`data:image/jpeg;base64,${data.processed_image}`);
    });
  };

  const startSendingVideo = () => {
    const delay = 100; // in milliseconds
    const timer = setInterval(() => {
      sendVideo();
    }, delay);
    setTimerId(timer);
  };

  const stopSendingVideo = () => {
    clearInterval(timerId);
    setTimerId(null);
  };

  return (
    <div>
    {/* Current webcam feed section */}
    <div style={{ float: "left", marginRight: "20px" }} className="web" class="rounded float-start"  >
      <h3>Current Webcam Feed</h3>
      <video ref={videoRef} style={{ width: "100%", height: "auto" }} />
      <Button onClick={startVideo}>Start Webcam</Button>
      <br />
      <br />
      
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>

    {/* Response video feed section */}

    <div style={{ float: "right", marginRight: "20px" }}  className="res"   >

      <h3>Response Video Feed</h3>
      {processedImage && <img src={processedImage} style={{ width: "100%", height: "auto" }} />}
      {timerId ? (
        <Button onClick={stopSendingVideo}>Stop Sending Video</Button>
      ) : (
        <Button onClick={startSendingVideo}>Start Sending Video & Get Prediction</Button>
      )}
    </div>
  </div>
);
  
}
