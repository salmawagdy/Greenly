import axios from "axios";

export const getLoanPrediction = async (formData) => {
  // Ensure formData is a plain JS object (NOT FormData or URLSearchParams)
  const response = await axios.post(
    "http://localhost:8000/loan/predict", // Correct Flask route
    formData,
    {
      headers: {
        "Content-Type": "application/json", // Important: tell Flask it's JSON
      },
    }
  );

  return response.data.status;
};
