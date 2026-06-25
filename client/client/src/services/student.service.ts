import axios from "axios";

export async function
getStudents(userId:string){

  const res =
  await axios.get(
    `https://placeflow-ai.onrender.com//api/students/${userId}`
  );

  return res.data;
}

export async function
addStudent(payload:any){

  const res =
  await axios.post(
    "https://placeflow-ai.onrender.com//api/students/add",
    payload
  );

  return res.data;
}