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
      input: '',  // Initialize input state for image URL.
      imageUrl: '',  // Initialize state for the detected image URL.
      faceBox: {},  // Initialize state for face bounding box coordinates.
      genderInfo: {},  // Initialize state for gender detection information.
      route: localStorage.getItem('route') || 'SignIn',  // Set the initial route based on local storage or default to 'SignIn'.
      isSignIn: localStorage.getItem('isSignIn') === 'true' || false,  // Set sign-in status based on local storage or default to false.
    };
  }

 // Function to update the state with the provided bounding box for displaying the face on the image.
displayFaceBox = (scaledBox) => {
  //console.log('Face Box:', scaledBox);
  this.setState({ faceBox: scaledBox });
};

// Function to update the state with gender information for display.
displayGenderInfo = (genderInfo) => {
  // console.log('Gender Info:', genderInfo);
   this.setState({ genderInfo: genderInfo });
 };
 
 // Function to update the state with the user input for image URL.
 onInputChange = (event) => {
   this.setState({ input: event.target.value });
 };
 
// Function triggered when the user submits an image for processing. 
  onButtonSubmit = () => {
    const { input } = this.state;

    if (!input) {
      //console.error('Input URL is empty');
      return;
    }

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
              image: isBase64 ? { base64: input.split(',')[1] } : { url: input },
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
        //console.log(`${modelId} API Response:`, result);
  
        if (result && result.outputs && result.outputs.length > 0) {
          callback(result.outputs[0].data);
          this.setState({ imageUrl: input });
        } 
      })
      .catch((error) => console.error(`Error in ${modelId} API:`, error));
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
    const { isSignIn, route, faceBox, genderInfo, imageUrl } = this.state;

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
