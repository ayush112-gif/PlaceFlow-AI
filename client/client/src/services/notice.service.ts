import { supabase } from "../lib/supabase";

export async function analyzeNotice(
  notice: string
) {

  const {
    data: { user }
  } = await supabase.auth.getUser();

  const response = await fetch(
    "https://placeflow-ai.onrender.com//api/notice/analyze",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        notice,
        userId: user!.id
      }),
    }
  );

  return response.json();
}