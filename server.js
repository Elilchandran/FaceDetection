require('dotenv').config(); // Add this to load environment variables
const express = require('express');
const fetch = require('node-fetch'); // Using node-fetch for making API requests
const app = express();

app.use(express.json());

app.post('/api/v2/models/:modelId/versions/:modelVersionId/outputs', async (req, res) => {
  const { modelId, modelVersionId } = req.params;

  try {
    const clarifaiResponse = await fetch(`https://api.clarifai.com/v2/models/${modelId}/versions/${modelVersionId}/outputs`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Key ${process.env.CLARIFAI_API_KEY}`,  // Using environment variable
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    if (!clarifaiResponse.ok) {
      throw new Error('Clarifai API request failed.');
    }

    const data = await clarifaiResponse.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching Clarifai API:', error);
    res.status(500).json({ error: 'An error occurred while processing the request.' });
  }
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
