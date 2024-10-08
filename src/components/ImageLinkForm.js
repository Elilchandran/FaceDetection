// Importing necessary React features and styles for the ImageLinkForm component.
import React from 'react';
import './ImageLinkFormD.css';

// Functional component ImageLinkForm takes onInputChange and onButtonSubmit as props.
const ImageLinkForm = ({ onInputChange, onButtonSubmit }) => {
  // Return JSX for rendering the ImageLinkForm component.
  return (
    <div>
      {/* Container div for centering the form. */}
      <div className="center">
        {/* Form container with styling for input and button. */}
        <div className="form center pa4 br3 shadow-5">
          {/* Input field for entering the image URL with styling. */}
          <input className="f4 pa2 w-70 center" type="text" onChange={onInputChange} />
          
          {/* Button for triggering the image detection with styling. */}
          <button className="w-30 grow f4 link ph3 pv2 dib white bg-light-purple" onClick={onButtonSubmit}>Detect</button>
        </div>
      </div>
    </div>
  );
};

export default ImageLinkForm;
