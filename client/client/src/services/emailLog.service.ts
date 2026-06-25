import axios from "axios";

export async function getEmailLogs(
  userId: string
) {

  const res =
    await axios.get(
      `http://localhost:5000/api/email/logs/${userId}`
    );

  return res.data;
}