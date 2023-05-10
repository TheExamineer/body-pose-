//  import { useState } from "react";
import { Button} from "react-bootstrap";

import React, { useState } from 'react';


export function Content() {
  const [videoSrc, setVideoSrc] = useState('');

  // Fetch the video from the Flask endpoint and set its URL as the video source
  async function fetchVideo() {
    try {
      const response = await fetch('http://localhost:5000/video');
      const encodedImage = await response.text();
      setVideoSrc(`data:image/png;base64,${encodedImage}`);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Button onClick={fetchVideo}>Fetch Video</Button>
      {videoSrc && (
        <video width="250" height="200" controls>
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
}