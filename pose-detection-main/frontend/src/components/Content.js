// import { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import contactImg from "../assets/img/contact-img.svg";
export const Content = () => {

    return (
        <section className="content" id="content">
            <Container>
                <Row className="align-items-center">
                    <Col size={12} md={6}>
                        <img src={contactImg} alt="Contact Us" />
                    </Col>
                    <Col size={12} md={6}>
                        <h2>Try It Yourself</h2>
                        // <img src="http://localhost:5000/video_feed" className="rounded thumbnail" alt="Video"></img>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}