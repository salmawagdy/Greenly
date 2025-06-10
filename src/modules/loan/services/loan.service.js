import axios from "axios";

export const getLoanPrediction = async (formData) => {
  const response = await axios.post(
    'https://loan-prediction-production.up.railway.app/predict',
    formData, 
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.status;
};
