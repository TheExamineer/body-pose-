//  import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import React, { useState } from 'react';
import {Button} from "react-bootstrap";

export function Content() {
    const [videoSrc, setVideoSrc] = useState('');
  
    const handleButtonClick = async () => {
      try {
        const response = await fetch('http://localhost:5000/video');
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setVideoSrc(videoUrl);
      } catch (error) {
        console.error(error);
      }
    };
  
    return (
      <Container>
        <Row className="align-items-center">
          <Col size={12} md={6}>
            
            <video src={videoSrc} className="rounded thumbnail" alt="Video" />
        
            
          </Col>
          <Col size={12} md={6}>
            <h2>Try It Yourself</h2>
            <Button onClick={handleButtonClick}>Play Video Feed</Button>
          </Col>
        </Row>
      </Container>
    );
  }