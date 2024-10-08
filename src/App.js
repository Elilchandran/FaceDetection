import React, { Component } from 'react';  // Importing necessary React modules.

import './App.css';  // Importing the stylesheet for the App component.
import Navigation from './components/Navigation';  // Importing the Navigation component.
import Logo from './components/Logo';  // Importing the Logo component.
import ImageLinkForm from './components/ImageLinkForm';  // Importing the ImageLinkForm component.
import FaceRecognition from './components/FaceRecognition';  // Importing the FaceRecognition component.
import Design from './components/Design';  // Importing the Design component.
import SignIn from './components/SignIn';  // Importing the SignIn component.
import Register from './components/Register';  // Importing the Register component.

const CLARIFAI_API_KEY = '74911ad3b1e9418cb551f2b5ebd35635';  // Clarifai API key.
const USER_ID = 'clarifai';  // User ID for Clarifai API.
const APP_ID = 'main';  // App ID for Clarifai API.
const MODEL_FACE_ID = 'face-detection';  // Model ID for face detection.
const MODEL_FACE_VERSION_ID = '6dc7e46bc9124c5c8824be4822abe105';  // Model version ID for face detection.
const MODEL_GENDER_ID = 'gender-demographics-recognition';  // Model ID for gender detection.
const MODEL_GENDER_VERSION_ID = 'ff83d5baac004aafbe6b372ffa6f8227';  // Model version ID for gender detection.

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      faceBox: {},
      genderInfo: {},
      route: localStorage.getItem('route') || 'SignIn',
      isSignIn: localStorage.getItem('isSignIn') === 'true' || false,
      isLoading: false, // New state for loading indicator
    };
  }

  displayFaceBox = (scaledBox) => {
    this.setState({ faceBox: scaledBox });
  };

  displayGenderInfo = (genderInfo) => {
    this.setState({ genderInfo: genderInfo });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onButtonSubmit = () => {
    const { input } = this.state;

    if (!input) {
      return;
    }

    // Set loading state to true before API calls
    this.setState({ isLoading: true });

    // Face Detection
    this.callClarifaiAPI(input, MODEL_FACE_ID, MODEL_FACE_VERSION_ID, this.calculateFace);

    // Gender Detection
    this.callClarifaiAPI(
      input,
      MODEL_GENDER_ID,
      MODEL_GENDER_VERSION_ID,
      this.calculateGender   

    );
  };


  // Function to make a Clarifai API call for face or gender detection.
  callClarifaiAPI = (input, modelId, modelVersionId, callback) => {
    const isBase64 = input.startsWith('data:image/');

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Key ${CLARIFAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_app_id: {
          user_id: USER_ID,
          app_id: APP_ID,
        },
        inputs: [
          {
            data: {
              image: isBase64 ? { base64: input.split(',')[1] } : { url: input},
            },
          },
        ],
      }),
    };
  
    fetch(
      `https://api.clarifai.com/v2/models/${modelId}/versions/${modelVersionId}/outputs`,
      requestOptions
    )
    
    .then((response) => response.json())
      .then((result) => {
        // Set loading state to false after API calls
        this.setState({ isLoading: false });

        if (result && result.outputs && result.outputs.length > 0) {
          callback(result.outputs[0].data);
          this.setState({ imageUrl: input });
        }
      })
      .catch((error) => {
        console.error(`Error in ${modelId} API:`, error);   

        // Set loading state to false on error
        this.setState({ isLoading: false });
      });
  };
  
 // Function to process gender information from the Clarifai API response. 
  calculateGender = (data) => {
    //console.log('Gender-Demographics API Response:', data);
  
    if (data && data.concepts && data.concepts.length > 0) {
      const mostConfidentConcept = data.concepts[0];
      let gender = mostConfidentConcept.name;
      const confidence = mostConfidentConcept.value * 100;
  
      // Maping the gender labels to desired format
      if (gender.toLowerCase() === 'feminine') {
        gender = 'female';
      } else if (gender.toLowerCase() === 'masculine') {
        gender = 'male';
      }
  
     /* console.log('Gender:', gender);
      console.log('Confidence:', confidence);*/
  
      this.setState({
        genderInfo: {
          gender: gender,
          confidence: confidence,
        },
      });
    } 
  };
  
  
// Function to process face information from the Clarifai API response.
  calculateFace = (data) => {
    //console.log('Face-detection API Response:', data);
  
    if (data && data.regions && data.regions.length > 0) {
      const faceRegion = data.regions[0];
  
      if (faceRegion.region_info && faceRegion.region_info.bounding_box) {
        const faceBox = faceRegion.region_info.bounding_box;
  
        // Simplifing the face box coordinates
        const simplifiedFaceBox = {
          top_row: faceBox.top_row,
          right_col: faceBox.right_col,
          bottom_row: faceBox.bottom_row,
          left_col: faceBox.left_col,
        };
  
        this.displayFaceBox(simplifiedFaceBox);
  
        // Gender Detection using the entire image
        this.calculateGender(data);
      } else {
        console.error('Invalid response format or missing bounding box information in the face-detection response.');
      }
    } else {
      console.error('Invalid response format or no regions found in the face-detection response.');
    }
  };
  
  
  
// Function to handle changes in the application's route.
  onRouteChange = (route) => {
    if (route === 'signout') {
      localStorage.removeItem('isSignIn');
      localStorage.removeItem('route');
      this.setState({ isSignIn: false, route: 'SignIn' }); // Set the route to 'SignIn' on signout
    } else if (route === 'home') {
      localStorage.setItem('isSignIn', 'true');
      localStorage.setItem('route', 'home');
      this.setState({ isSignIn: true, route: 'home' });
    } else {
      localStorage.setItem('isSignIn', 'false');
      localStorage.setItem('route', route);
      this.setState({ route: route });
    }
  };
  

  // Function to render the main application component.
render() {
    const { isSignIn, route, faceBox, genderInfo, imageUrl, isLoading } = this.state;

    return (
      <div className='App'>
        <Design />
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        {route === 'home' ? (
          <div>
            <Logo />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onButtonSubmit}
            />
            <FaceRecognition
              faceBox={faceBox}
              genderInfo={genderInfo}
              imageUrl={imageUrl}   

              isLoading={isLoading} // Pass loading state to FaceRecognition
            />
          </div>
        ) : route === 'SignIn' ? (
          <SignIn onRouteChange={this.onRouteChange} />
        ) : (
          <Register onRouteChange={this.onRouteChange} />
        )}
      </div>
    );
  }
}

export default App;