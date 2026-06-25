import axios from "axios";

export async function
getStudents(userId:string){

  const res =
  await axios.get(
    `http://localhost:5000/api/students/${userId}`
  );

  return res.data;
}

export async function
addStudent(payload:any){

  const res =
  await axios.post(
    "http://localhost:5000/api/students/add",
    payload
  );

  return res.data;
}