import axios from "axios";

export const getLoanPrediction = async (formData) => {
  const response = await axios.post(
    'https://loan-prediction-production.up.railway.app/predict', 
    {
      headers: {
        "Content-Type": "application/json", 
      },
    }
  );

  return response.data.status;
};
