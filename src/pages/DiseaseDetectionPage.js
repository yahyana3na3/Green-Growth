import React, { useState } from 'react';
import '../styles/disease.css';
import Menu from '../components/Menu';
import { FaTimes } from 'react-icons/fa';
// var reader;
var dataImage
function Disease() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [imageUploaded, setImageUploaded] = useState(false);
  const [data, setData] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
     const reader = new FileReader();
    
    reader.onload = (e) => {
      setUploadedImage(e.target.result);
      setImageUploaded(true); 
      dataImage=reader;
    };

    reader.readAsDataURL(file);
    
  };

  


  const handleDetect = () => {
    if (imageUploaded) { 
      setProcessing(true);
      // const formData = new FormData();

      let dataForm=new FormData();
      console.log(dataImage.result);
      dataForm.append('image', dataImage.result);
      // dataForm.append({'image':dataImage });
      fetch('http://localhost:5000/predict', {
        method: 'POST',
        // headers: {
        //   'Content-Type': 'multipart/form-data'
        // },
        body:dataForm
      })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        setResult(data.result);
        setProcessing(false);
      })
      .catch(error => {
        console.error('Error:', error);
        setProcessing(false);
      });
    }
    fetch('http://localhost:5000/predict')
      .then(response => response.json())
      .then(data => {
        console.log(data['image'])
        // setUploadedImage(data.imagePath);  // Assuming the response contains an imagePath field
        setImageUploaded(true);
      })
      .catch(error => console.error('Error fetching image:', error));

  };

  const handleCloseResult = () => {
    setResult(null);
  };

  return (
    <div className="App">
      <header>
        <Menu />
      </header>
      <h1>Find out what disease caught your plant!</h1>
      <div className="content">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <label htmlFor="image-upload" className="upload-btn">
          Upload Image
        </label>
        <button className="detect-btn" onClick={handleDetect} disabled={!imageUploaded || processing}>
          Detect!
        </button>
      
      </div>
      {uploadedImage && (
        <div className={`uploaded-image-container ${processing ? 'processing' : ''}`}>
          <img src={uploadedImage} alt="Uploaded" className="uploaded-image" />
          {processing && <div className="processing-overlay"></div>}
        </div>
      )}
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
}

export default Disease;
