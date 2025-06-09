import axios from 'axios';

export const getLoanPrediction = async (formData) => {
  // Ensure formData is a plain JS object (NOT FormData or URLSearchParams)
  const response = await axios.post(
    'https://loan-prediction-production.up.railway.app/predict', // Correct Flask route
    formData,
    {
      headers: {
        'Content-Type': 'application/json'  // Important: tell Flask it's JSON
      }
    }
  );

  return response.data.status;
};
