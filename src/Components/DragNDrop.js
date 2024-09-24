import React, { useState } from "react";
import "./drag-drop.css"; // Assuming your styles are here

const TextSubmitComponent = () => {
  const [textInput, setTextInput] = useState(''); // Text input state
  const [authToken, setAuthToken] = useState(''); // Token (could be fetched from props or localStorage)
  const [loading, setLoading] = useState(false);  // Loading state for the submit button
  const [message, setMessage] = useState('');     // Message state for success/error feedback

  // Handle the form submission
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
            'Authorization': `Bearer ${authToken}`  // Pass the token in the request headers
          },
          body: JSON.stringify({ text: textInput })
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Response:', data);
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
    <div>
      <div className="text-input-container">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)} // Update textInput using setTextInput
          placeholder="Paste your text here..."
          rows="5"
          cols="50"
        />
        <br/>
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
  );
};

export default TextSubmitComponent;
