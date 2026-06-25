import axios from "axios";

export async function getEmailLogs(
  userId: string
) {

  const res =
    await axios.get(
      `https://placeflow-ai.onrender.com//api/email/logs/${userId}`
    );

  return res.data;
}