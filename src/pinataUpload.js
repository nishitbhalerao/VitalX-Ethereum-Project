// pinataUpload.js
import axios from "axios";

export async function uploadToPinata(file) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(url, formData, {
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI5ZThmMTk3OS05OWM1LTQzNGEtYjM1My1mMTE1NDA3YTYxMTIiLCJlbWFpbCI6IjIwMjUudml0YWx4QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJlMTE0ODkxYzI4MTNlYTIwMmQ1OSIsInNjb3BlZEtleVNlY3JldCI6IjcwYmQ4N2MwYjRiYmI0MWI3NjJmZGY0MjQ0ZDdhNDAxYjlkODcwOGY1YzY5ZDA0ZWM4N2FiNzIyMTE2NTg4ODMiLCJleHAiOjE3OTcxNjk1Mzd9.UieKZ3RbWerABnD2cHnR_MTbTWHiAgxUSoFqNeLYboc`, // <-- Replace this
      },
    });

    // Return the CID (IpfsHash)
    return response.data.IpfsHash;

  } catch (error) {
    console.error("❌ Pinata Upload Error:", error);
    throw error;
  }
}
