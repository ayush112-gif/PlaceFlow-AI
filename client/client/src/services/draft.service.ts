import axios from "axios";
import { supabase } from "../lib/supabase";

export async function generateDrafts(
  payload: any
) {
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User not authenticated"
    );
  }

  const response =
    await axios.post(
      "http://localhost:5000/api/drafts/generate",
      {
        ...payload,
        userId: user.id,
      }
    );

  return response.data;
}