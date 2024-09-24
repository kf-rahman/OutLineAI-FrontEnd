import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './App.css';

const TextSubmitPage = () => {
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const authToken = location.state ? location.state.authToken : localStorage.getItem("authToken");

  // Check if user is authenticated by checking the token
  useEffect(() => {
    if (!authToken) {
      // Redirect to login if no token
      navigate('/');
    }
  }, [authToken, navigate]);

  // Handle form submission
  const handleSubmit = async () => {
    if (!authToken) {
      alert('You are not authenticated. Please login.');
      return;
    }

    if (textInput.trim()) {
      setLoading(true);

      try {
        const response = await fetch('https://outline-ai-backend-cjk4b70nc-kf-rahmans-projects.vercel.app/extract-and-add-events', {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}` // Pass the token in the request headers
          },
          body: JSON.stringify({ text: textInput })
        });

        if (response.ok) {
          const data = await response.json();
          setMessage('Events added successfully!');
        } else {
          setMessage('Failed to add events.');
        }
      } catch (error) {
        console.error('Error submitting text:', error);
        setMessage('Failed to add events.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter some text.');
    }
  };

  return (
    <div className="App">
      <div className="content">
        <h1>Add Events</h1>
        <div className="text-input-container">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Paste your text here..."
            rows="5"
            cols="50"
          />
          <br />
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Text'}
          </button>
        </div>

        {/* Display success/error message */}
        {message && (
          <div className="message-container">
            <h3>{message}</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextSubmitPage;
