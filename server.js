const express = require('express');
const fetch = require('node-fetch'); // Optional: use node-fetch or axios
const app = express();

app.use(express.json());

app.post('/api/v2/models/:modelId/versions/:modelVersionId/outputs', async (req, res) => {
  const { modelId, modelVersionId } = req.params;

  const clarifaiResponse = await fetch(`https://api.clarifai.com/v2/models/${modelId}/versions/${modelVersionId}/outputs`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: `Key ${process.env.CLARIFAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(req.body),
  });

  const data = await clarifaiResponse.json();
  res.json(data);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
