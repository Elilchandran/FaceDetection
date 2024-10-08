// Importing necessary React features and styles for the FaceRecognition component.
import React, { useRef, useEffect, useState } from 'react';
import './FaceRecognition.css';

// Functional component FaceRecognition takes imageUrl, faceBox, and genderInfo as props.
const FaceRecognition = ({ imageUrl, faceBox, genderInfo }) => {
  // useRef to reference the image element for bounding box calculations.
  const imageRef = useRef();
  
  // useState to manage the bounding box dimensions in pixels.
  const [boxInPixels, setBoxInPixels] = useState(null);

  // useEffect to calculate the bounding box dimensions when faceBox or imageUrl changes.
  useEffect(() => {
    const calculateBoundingBox = () => {
      // Check if the image has loaded and has valid dimensions.
      if (imageRef.current && imageRef.current.complete) {
        const image = imageRef.current;
        const width = image.width;
        const height = image.height;

        // Calculate new bounding box dimensions in pixels.
        const newBoxInPixels = {
          top_row: isNaN(faceBox.top_row) ? 0 : faceBox.top_row * height,
          right_col: isNaN(faceBox.right_col) ? 0 : width - faceBox.right_col * width,
          bottom_row: isNaN(faceBox.bottom_row) ? 0 : height - faceBox.bottom_row * height,
          left_col: isNaN(faceBox.left_col) ? 0 : faceBox.left_col * width,
        };

        // Set the calculated dimensions in the state.
        setBoxInPixels(newBoxInPixels);
      }
    };

    // Call the calculateBoundingBox function.
    calculateBoundingBox();
  }, [faceBox, imageUrl]);

  // Return JSX for rendering the FaceRecognition component.
  return (
    <div className='center'>
      <div className='absolute mt2'>
        {/* Image element with ref to set dimensions and display the image. */}
        <img
          ref={imageRef}
          id='inputimage'
          alt=''
          src={imageUrl}
          width='500px'
          height='auto'
        />

        {/* Conditional rendering of bounding box and gender information. */}
        {boxInPixels && (
          <>
            {/* Bounding box element with dynamic styling based on calculated dimensions. */}
            <div
              className='bounding-box'
              style={{
                top: boxInPixels.top_row,
                right: boxInPixels.right_col,
                bottom: boxInPixels.bottom_row,
                left: boxInPixels.left_col,
              }}
            ></div>

            {/* Conditional rendering of gender information if available. */}
            {genderInfo && genderInfo.gender && genderInfo.confidence !== undefined && (
              <div className='gender-info'>
                {/* Displaying gender and confidence percentage with styled text. */}
                <h1 style={{ color: 'purple' }}>Gender: {genderInfo.gender} </h1>
                <h3 style={{ color: 'yellow' }}>Match: {genderInfo.confidence}%</h3>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FaceRecognition;
