import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export const FeedbackForm = () => {
    const [fname, setfName] = useState('');
    const [lname, setlName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      try {
        const response = await fetch('http://localhost:5000/add', {
          method: 'POST',
          body: new FormData(e.target)
        });
        
        if (response.ok) {
          alert('User created successfully!');
          setfName('');
          setlName('');
          setPhone('');
          setMessage('');
          setEmail('');
        } else {
          const data = await response.json();
          alert(`Error: ${data.error}`);
        }
      } catch (err) {
        alert('An error occurred.',err);
        // console.log(err);
      }
    };
  return (
    <div className="feedbackform-bx">
      <h3>Get In Touch</h3>
      <Form onSubmit={handleSubmit} id="feedbackform">
        <Row>
          <Col>
          <Form.Group className="mb-3 text-bx" controlId="fname">
          <Form.Control type="text" name="fname" value={fname} placeholder="First Name" onChange={(e) => setfName(e.target.value)} />
        </Form.Group>
          </Col>
          <Col>
          <Form.Group className="mb-3 text-bx" value="lname">
        <Form.Control type="text" name="lname" value={lname} placeholder="Last Name" onChange={(e) => setlName(e.target.value)} />
        </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
          <Form.Group className="mb-3 text-bx" controlId="email">
        <Form.Control type="email" name="email" value={email} placeholder="Email Address" onChange={(e) => setEmail(e.target.value)} />
        </Form.Group>
          </Col>
          <Col>
          <Form.Group className="mb-3 text-bx" controlId="phone">
        <Form.Control type="tel" name="phone" value={phone} placeholder="Phone No." onChange={(e) => setPhone(e.target.value)}/>
        </Form.Group>
          </Col>
        </Row>
        <Form.Group className="mb-3 text-bx" controlId="formBasicPassword" onChange={(e) => setMessage(e.target.value)} >
        <Form.Control rows="6" name="message" value={message} placeholder="Message" onChange={(e) => setMessage(e.target.value)} />
        <Button type="submit">Submit</Button>
        
        </Form.Group>
        
        
      </Form>
    </div>
  )
}