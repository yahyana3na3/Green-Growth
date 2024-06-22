import React, { useState } from 'react';
import '../styles/Croprecommend.css';
import Menu from '../components/Menu';
import { FaTimes } from 'react-icons/fa'; 

const FormComponent = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    N: '',
    P: '',
    K: '',
    temperature: '',
    humidity: '',
    pH: '',
    rainfall: ''
  });

  const [result, setResult] = useState(null); 
  const [showResult, setShowResult] = useState(false); 
  const [processing, setProcessing] = useState(false); 
  const [formError, setFormError] = useState(false); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    
    for (let key in formData) {
      if (formData[key] === '') {
        setFormError(true);
        return;
      }
    }
    
 
    setProcessing(true); 
    setTimeout(() => {
      const fakeResult = "apple"; 
      setResult(fakeResult);
      setShowResult(true); 
      setProcessing(false); 
    }, 2500); 
  };

  const handleCloseResult = () => {
    setShowResult(false);
    setResult(null); 
  };

  return (
    <div className="container">
      <header>
        <Menu />
      </header>
      <div className="form-container">
        <div className="hth-container">
          <h2>Share your land info and let's make it thrive!</h2>
        </div>
        <form onSubmit={handleSubmit} className="crop-form">
          <div className="input-group">
            <label htmlFor="N">N (Nitrogen)</label>
            <input type="number" name="N" value={formData.N} onChange={handleChange} placeholder="N" />
          </div>
          <div className="input-group">
            <label htmlFor="P">P (Phosphorus)</label>
            <input type="number" name="P" value={formData.P} onChange={handleChange} placeholder="P" />
          </div>
          <div className="input-group">
            <label htmlFor="K">K (Potassium)</label>
            <input type="number" name="K" value={formData.K} onChange={handleChange} placeholder="K" />
          </div>
          <div className="input-group">
            <label htmlFor="temperature">Temperature</label>
            <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} placeholder="Temperature in °C" />
          </div>
          <div className="input-group">
            <label htmlFor="humidity">Humidity</label>
            <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} placeholder="Humidity%" />
          </div>
          <div className="input-group">
            <label htmlFor="pH">pH</label>
            <input type="number" name="pH" value={formData.pH} onChange={handleChange} placeholder="pH" />
          </div>
          <div className="input-group">
            <label htmlFor="rainfall">Rainfall</label>
            <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} placeholder="Rainfall in mm" />
          </div>
          <div className="button-container">
            <button type="submit">Recommend!</button>
          </div>
          {formError && <p style={{ color: 'red' }}>Please fill all fields!</p>}
        </form>
      </div>
      {/* Processing effect */}
      {processing && (
        <div className="processing-overlay">
          <div className="processing-spinner"></div>
          <p>Processing...</p>
        </div>
      )}
      {/* Result display */}
      {result && (
        <div className="result-container">
          <div className="result-rectangle">
            <button className="close-btn" onClick={handleCloseResult}>
              <FaTimes />
            </button>
            <h2>Result</h2>
            <p>{result}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormComponent;
