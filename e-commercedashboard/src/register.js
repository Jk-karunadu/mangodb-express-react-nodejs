import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import './Register.css'; // Import the CSS file

const Regist = () => {
  const [firstname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, [navigate]);

  const validateForm = () => {
    if (!firstname || !lastname || !email || !password) {
      setError("All fields are required.");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email address.");
      return false;
    }
    return true;
  };

  const collectdata = async () => {
    if (!validateForm()) return;

    let result = await fetch(`${import.meta.env.VITE_REACT_APP_URL}/regist`, {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname, email, password }),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    result = await result.json();
    if (result) {
      localStorage.setItem("user", JSON.stringify(result.result));
      localStorage.setItem("token", JSON.stringify(result.auth));
      navigate("/");
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  const logingo = () => {
    navigate("/login");
  };

  return (
    <div className='regist-container'>
      <h1>Register or Sign Up Here!</h1>
      <Form>
        <Form.Group className="regist-form-group" controlId="formGroupUsername">
          <Form.Label>Username</Form.Label>
          <Row>
            <Col>
              <Form.Control
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFname(e.target.value)}
              />
            </Col>
            <Col>
              <Form.Control
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLname(e.target.value)}
              />
            </Col>
          </Row>
        </Form.Group>
        <Form.Group className="regist-form-group" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="regist-form-group" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>
        {error && <div className="alert">{error}</div>}
        <Button className="regist-button" variant="dark" onClick={collectdata}>Sign Up!</Button>
        <Button className="regist-button" variant="dark" onClick={logingo}>Go to Login</Button>
      </Form>
    </div>
  );
};

export default Regist;
