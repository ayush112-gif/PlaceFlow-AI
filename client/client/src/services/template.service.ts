import { supabase } from "../lib/supabase";

export async function saveTemplate(
  payload: any
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } =
    await supabase
      .from("templates")
      .insert([
        {
          user_id: user?.id,
          ...payload,
        },
      ])
      .select();

  if (error) throw error;

  return data;
}

export async function getTemplates() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } =
    await supabase
      .from("templates")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", {
        ascending: false,
      });

  if (error) throw error;

  return data;
}