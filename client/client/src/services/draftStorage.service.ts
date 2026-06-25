import axios from "axios";
import { supabase } from "../lib/supabase";

export async function saveDraft(
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

  const res = await axios.post(
    "http://localhost:5000/api/draft-storage/save",
    {
      ...payload,
      user_id: user.id
    }
  );

  return res.data;
}

export async function getDrafts() {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User not authenticated"
    );
  }

  const res = await axios.get(
    "http://localhost:5000/api/draft-storage",
    {
      params: {
        user_id: user.id
      }
    }
  );

  return res.data;
}