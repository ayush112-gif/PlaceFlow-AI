import axios from "axios";

export async function
sendEmail(
 payload:any
){

 const res =
 await axios.post(
  "http://localhost:5000/api/email/send",
  payload
 );

 return res.data;
}