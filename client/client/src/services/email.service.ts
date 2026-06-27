import axios from "axios";

export async function
sendEmail(
 payload:any
){

 const res =
 await axios.post(
  "https://placeflow-ai.onrender.com/api/email/send",
  payload
 );

 return res.data;
}